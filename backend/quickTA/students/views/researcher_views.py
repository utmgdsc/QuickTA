import time
import csv
from datetime import datetime, date
from ..constants import * 

from ..functions import user_functions, course_functions, report_functions, conversation_functions,  time_utils, gptmodel_functions
from ..functions.common_topics import generate_wordcloud

from django.http import HttpResponse
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers import researcher_serializers as rs
from drf_yasg.utils import swagger_auto_schema

# Endpoints
@swagger_auto_schema(methods=['post'], request_body=rs.AverageRatingSerializer)
@api_view(['POST'])
def average_ratings(request):
    """
    Finds the average rating of a particular course given the course id
    """
    if request.method == 'POST':
        try:
            start = time.time()
            course = Course.objects.filter(course_id=request.data['course_id'])
            if not(course.count()): 
                raise CourseNotFoundError
            end = time.time()
            print("Time elapsed (Course filtering):", (end-start) * 1000)

            start = time.time()
            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])
            end = time.time()
            print("Time elapsed (Conversations filtering):", (end-start) * 1000)

            # Retrieve all feedback from the conversations
            ratings = []
            start = time.time()
            for convo in convos:
                q2 = Feedback.objects.filter(conversation_id=convo.conversation_id)
                if (len(q2) != 0):
                    ratings.append(q2[0].rating)
            end = time.time()
            print("Time elapsed (Feedback filtering):", (end-start) * 1000)
            
            if len(ratings) == 0:
                avg_ratings = 0
            else:
                avg_ratings = sum(ratings) / len(ratings)

            # Find average of all the ratings of that particular course
            response = { 
                'avg_ratings': avg_ratings,  
                'all_ratings': ratings
            }

            return Response(response, status=status.HTTP_200_OK)
        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Ratings missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.AverageRatingSerializer)
@api_view(['POST'])
def average_ratings_csv(request):
    """
    Retrieves the average ratings given a course id and returns a copy of
    all the ratings of the chatbot from the course.
    """
    if request.method == 'POST':
        try:
            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError

            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            response = HttpResponse(
                content_type='text/csv',
                headers={ 'Content-Disposition': 'attachement; filename="average-ratings-{}.csv"'.format(datetime.now())}
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
            
            # Retrieve all feedback from the conversations
            writer = csv.writer(response)
            writer.writerow([
                'Course ID',
                'Conversation ID',
                'User Name',
                'Utorid',
                'Rating',
                'Feedback Message'
            ])
            for convo in convos:
                feedback = Feedback.objects.filter(conversation_id=convo.conversation_id)
                if len(feedback) != 0:
                    feedback = feedback[0]
                    user = User.objects.get(user_id=convo.user_id)

                    writer.writerow([
                        str(convo.course_id),
                        str(convo.conversation_id),
                        str(user.name),
                        str(user.utorid),
                        str(feedback.rating),
                        str(feedback.feedback_msg)
                    ])
            return response
        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Ratings CSV missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.ReportedListSerializer)
@api_view(['POST'])
def list_reported_conversations(request):
    """
    Returns all reported conversations of a given course.
    
    Information returned includes:
    - Conversation ID
    - Course ID
    - User ID
    - User name
    - User utorid
    - Report time
    - Report status ('O' - opened, 'C' - closed)
    - Report message
    """
    if request.method == 'POST':
        try:
            data = request.data
            reported_convos = report_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])
            
            # Retrieve all reported conversations
            response = {
                "total_reported": len(reported_convos),
                "reported_conversations": {}
            }

            for i, report in enumerate(reported_convos):
                response['reported_conversations'][i] = {
                    'conversation_id': report.conversation_id,
                    'course_id': report.course_id,
                    'user_id': report.user_id,
                    'name': report.name,
                    'utorid': report.utorid,
                    'time': report.time,
                    'status': report.status,
                    'msg': report.msg
                }
            return Response(response, status=status.HTTP_200_OK)  
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Reported Conversations missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.ReportedListSerializer)
@api_view(['POST'])
def list_reported_conversations_csv(request):
    """
    Returns all reported conversations of a given course.
    
    Information returned includes:
    - Conversation ID
    - Course ID
    - User ID
    - User name
    - User utorid
    - Report time
    - Report status ('O' - opened, 'C' - closed)
    - Report message
    """
    if request.method == 'POST':
        try:
            # Acquire reported conversations based on filter view and timezone 
            data = request.data
            reported_convos = report_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            # Initialize CSV response
            response = HttpResponse(
                content_type='text/csv',
                headers={ 'Content-Disposition': 'attachement; filename="reported-conversations-{}.csv"'.format(datetime.now())}
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"

            # Write all reported conversation information to CSV response
            writer = csv.writer(response)
            writer.writerow([
                'Course ID',
                'Conversation ID',
                'User Name',
                'Utorid',
                'Time'
                'Status',
                'Report Message'
            ])
            for report in reported_convos:
                writer.writerow([
                    str(report.course_id),
                    str(report.conversation_id),
                    str(report.name),
                    str(report.utorid),
                    str(report.time),
                    str(report.status),
                    str(report.msg)
                ])
            return response
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Reported Conversations missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.ChatlogListSerializer)
@api_view(['POST'])
def get_reported_chatlogs(request):
    """
    Returns all of the chatlogs of a reported conversation ID 
    """
    try:
        cid = request.data['conversation_id']
        conversation = Conversation.objects.filter(conversation_id=cid)

        if not(conversation):
            raise ConversationNotFoundError


        user = User.objects.get(user_id=conversation[0].user_id)

        chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        conversations = []
        for chatlog in chatlogs:
            if chatlog.is_user:
                speaker = user.name
            else:
                speaker = 'Agent'
            conversations.append({
                'chatlog_id': chatlog.chatlog_id,
                'speaker': speaker,
                'chatlog': chatlog.chatlog,
                'time': chatlog.time,
                'delta': chatlog.delta
            })
        
        response = {
            "total_reported_count": len(conversations),
            "conversations": conversations
        }
        return Response(response, status=status.HTTP_200_OK)

    except ConversationNotFoundError:
        return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_401_UNAUTHORIZED) 
    except:
        error = []
        if 'conversation_id' not in request.data.keys():
            error.append("Conversation ID")
        
        if (not(error)): 
            err = {"msg": "Internal Server Error"}
            return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            err = {"msg": "Reported Chatlogs missing fields: " + ','.join(error) + '.'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)
       
@swagger_auto_schema(methods=['post'], request_body=rs.ChatlogListSerializer)
@api_view(['POST'])
def get_reported_chatlogs_csv(request):
    """
    Retrieves the reported conversation id and returns a CSV copy of the chatlog.
    """
    if request.method == 'POST':
        try:
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id=cid)

            # Checks if conversation is found
            if (len(conversation) > 0):
                uid = conversation[0].user_id
            else:
                raise ConversationNotFoundError

            # Checks if user is found
            user = User.objects.filter(user_id=uid)
            if (len(user) > 0):
                user = user[0]
            else:
                raise UserNotFoundError

            chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachement; filename="convo-report.csv"'
                }
            )

            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"

            writer = csv.writer(response)
            
            for chatlog in chatlogs:
                chatlog.time = chatlog.time.strftime("%m/%d/%Y %H:%M:%S")
                if chatlog.is_user:
                    writer.writerow(['[' + str(chatlog.time) + ']', str(user.name), str(chatlog.chatlog)])
                else: 
                    writer.writerow(['[' + str(chatlog.time) + ']', 'QuickTA', str(chatlog.chatlog)])

            return response

        except ConversationNotFoundError:
            return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_401_UNAUTHORIZED) 
        except UserNotFoundError:
            return Response({"msg": "Error: User not Found."}, status=status.HTTP_401_UNAUTHORIZED) 
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Reported Chatlogs CSV missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_400_BAD_REQUEST) 

@swagger_auto_schema(methods=['post'], request_body=rs.ResponseRateSerializer)
@api_view(['POST'])
def get_average_response_rate(request):
    if request.method == 'POST':
        try:
            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError

            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])
            
            deltas = []
            total_delta = 0
            total_chatlogs = 0
            
            for convo in convos:
                q2 = Chatlog.objects.filter(conversation_id=convo.conversation_id)
                for chatlog in q2:
                    if chatlog.is_user:                    
                        delta = chatlog.delta.total_seconds() 
                        if delta != 0:
                            deltas.append(delta)
                            total_delta += delta
                            total_chatlogs += 1
            if total_chatlogs != 0:
                avg_response_rate = total_delta / total_chatlogs
            else:
                avg_response_rate = 0
            response = {
                "avg_response_rate": avg_response_rate,
                "all_response_rates": deltas
            }
            return Response(response, status=status.HTTP_200_OK)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Response Rate missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.ResponseRateSerializer)
@api_view(['POST'])
def get_average_response_rate_csv(request):
    """
    Retrieves the response rates given a course id and returns a copy of
    all the relevant chatlog response rates of a course.
    """
    if request.method == 'POST':
        try:
            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError

            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])
            
            # Initialize CSV Response
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachement; filename="convo-report.csv"'
                }
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
            
            # Write all response rates information to CSV response
            writer = csv.writer(response)
            writer.writerow([
                'Course Code',
                'Conversation ID',
                'Chatlog ID',
                'User Name'
                'Utorid',
                'Delta Time'
            ])

            for convo in convos:
                q2 = Chatlog.objects.filter(conversation_id=convo.conversation_id)
                course = Course.objects.get(course_id=convo.course_id)
                user = User.objects.get(user_id=convo.user_id)
                for chatlog in q2:
                    if chatlog.is_user:                    
                        delta = chatlog.delta.total_seconds() 
                        if delta != 0:
                            writer.writerow([
                                str(convo.course_id),
                                str(chatlog.chatlog_id),
                                str(course.course_code),
                                str(user.name),
                                str(user.utorid),
                                str(delta)
                            ])
            return response
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Response Rate CSV missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.MostCommonWordsSerializer)
@api_view(['POST'])
def get_most_common_words(request):
    if request.method == 'POST':
        try:
            # serializer = MostCommonWordsSerializer(data=request.data)
            # serializer.is_valid()

            # Gather all user chatlogs
            sentences = []
            convo_count = 0
            chatlog_count = []

            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:  # 600 ms
                raise CourseNotFoundError

            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            for convo in convos:
                convo_count += 1
                chatlog_count.append(0)
                chatlogs = get_convo_chatlogs(convo.conversation_id)
                for chatlog in chatlogs:
                    chatlog_count[convo_count-1] += 1
                    if chatlog.is_user:
                        sentences.append(chatlog.chatlog)
            
            words = generate_wordcloud(sentences)

            if convo_count != 0:
                avg_chatlog_count =  sum(chatlog_count) / convo_count
            else: 
                avg_chatlog_count = 0
            
            if sum(chatlog_count) != 0:
                avg_chatlog_length = sum([len(chatlog) for chatlog in sentences]) / sum(chatlog_count)
            else: 
                avg_chatlog_length = 0

            response = {
                "avg_chatlog_count": avg_chatlog_count,
                "total_chatlog_count": sum(chatlog_count),
                "avg_chatlog_length": avg_chatlog_length,
                "sentences": sentences,
                "most_common_words": words
            }
            return Response(response, status=status.HTTP_200_OK)
        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Most Common Topics missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.CourseComfortabilityListSerializer)
@api_view(['POST'])
def get_course_comfortability(request):
    if request.method == 'POST':
        try:
            serializer = rs.CourseComfortabilityListSerializer(data=request.data)
            serializer.is_valid()

            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError
            
            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            all_ratings = []

            for convo in convos:
                if convo.comfortability_rating:
                    all_ratings.append(convo.comfortability_rating)
            
            if all_ratings:
                avg = sum(all_ratings) / len(all_ratings)
            else:
                avg = 0
            response = {
                "total_conversations": len(all_ratings),
                "comfortability_ratings": all_ratings,
                "avg_comfortability_rating": avg
            }

            return Response(response, status=status.HTTP_200_OK)
        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            if 'course_id' not in request.data.keys():
                error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Course comfortability missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)
        
@swagger_auto_schema(methods=['post'], request_body=rs.CourseComfortabilityListSerializer)
@api_view(['POST'])
def get_course_comfortability_csv(request):
    """
    Retrieves a CSV copy of all the course comfortability ratings of a given course id.
    """
    if request.method == 'POST':
        try:
            serializer = rs.CourseComfortabilityListSerializer(data=request.data)
            serializer.is_valid()

            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError

            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

             # Initialize CSV Response
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachement; filename="convo-report.csv"'
                }
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
            
            # Write all response rates information to CSV response
            writer = csv.writer(response)
            writer.writerow([
                'Course Code',
                'Conversation ID',
                'User Name'
                'Utorid',
                'Comfortability Rating'
            ])

            for convo in convos:
                course = Course.objects.get(course_id=convo.course_id)
                user = User.objects.get(user_id=convo.user_id)
                writer.writerow([
                    str(convo.course_id),
                    str(convo.conversation_id),
                    str(user.name),
                    str(user.utorid),
                    str(convo.comfortability_rating)
                ])

            return response

        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Course comfortability missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.InteractionFrequencySerializer)
@api_view(['POST'])
def get_interaction_frequency(request):
    """
    Retrieves the interaction frequency of QuickTA of a given

    An interaction is considered when a user initializes a conversation
    with the model.
    """
    if request.method == 'POST':
        try:
            # Check for course existence
            course = Course.objects.filter(course_id=request.data['course_id'])
            print(course)
            start = time.time()
            if len(course) == 0:
                raise CourseNotFoundError
            end = time.time()
            print("len:", (end-start) * 1000)
            # Get all dates in range for a particular filter view (Weekly or Monthly)
            data = request.data
            dates = time_utils.get_all_dates(data['filter'], data['timezone'])

            interactions = conversation_functions.get_filtered_interactions(data['course_id'], dates, data['timezone'])

            response = {
                "interactions": interactions 
            }
            
            return Response(response, status=status.HTTP_200_OK)

        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Course ID")
            if 'filter' not in keys: error.append("Filter view")
            if 'timezone' not in keys: error.append("Timezone")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Ratings CSV missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.CourseUserListSerializer)
@api_view(['POST'])
def get_course_users(request):
    """
    Acquires the information of all students of a course given the course_id.

    Request:
    - course_id

    Response:
    - total_students: number of students that has accessibility to the course
    - users: contains all user data
        - user_id
        - name
        - utorid
        - user_role
    """
    try:
        # Form validation
        serializer = rs.CourseUserListSerializer(data=request.data)
        serializer.is_valid()

        course_id = request.data['course_id']

        # Acquire the course's list of students
        users = course_functions.get_all_course_users(course_id)
        if not(users):
            raise CourseNotFoundError

        # Acquire all user's information 
        users_info = user_functions.get_users_info(users)

        response = {
            "total_students": len(users),
            "users": users_info
        }
        
        return Response(response, status=status.HTTP_200_OK)

    except CourseNotFoundError:
        return Response({"msg": "Error: Course not Found."}, status=status.HTTP_400_BAD_REQUEST)
    except:
        error = []
        if 'course_id' not in request.data.keys():
            error.append("Course ID")
        
        if (not(error)): 
            err = {"msg": "Internal Server Error"}
            return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            err = {"msg": "Course User List missing fields: " + ','.join(error) + '.'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.GPTModelSerializer)
@api_view(['POST'])
def gptmodel_detail(request):
    """
    Creates a GPT Model given the parameter specifications.
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.create_gptmodel(data)
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_name' not in keys: error.append("Model Name")
            if 'course_id' not in keys: error.append("Course ID")
            if 'model' not in keys: error.append("Model")
            if 'prompt' not in keys: error.append("Prompt")
            if 'suffix' not in keys: error.append("Suffix")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model creation missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=rs.GPTModelSerializer)
@api_view(['POST'])
def gptmodel_update(request):
    """
    Updates a particular GPT model
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.update_gptmodel(data)
            
            if OPERATION_FAILED:
                raise Exception
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_name' not in keys: error.append("Model Name")
            if 'course_id' not in keys: error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model update missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)                

@swagger_auto_schema(methods=['post'], request_body=rs.GPTModelSerializer)
@api_view(['POST'])
def gptmodel_select(request):
    """
    Activates a selected GPTModel
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.switch_gptmodel(data['course_id'], data['model_id'])
            
            if OPERATION_FAILED:
                raise Exception
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_id' not in keys: error.append("Model ID")
            if 'course_id' not in keys: error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model creation missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)                

@swagger_auto_schema(methods=['post'], request_body=rs.CourseUserListSerializer)
@api_view(['POST'])
def gptmodel_get(request):
    """
    Returns all GPT models related to a course
    """
    if request.method == 'POST':
        try:
            data = request.data
            gpt_models = gptmodel_functions.get_gptmodels(data['course_id'])

            if not(gpt_models):
                raise Exception
            
            return JsonResponse({"gpt_models": gpt_models})
        except:
            return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['get'])
@api_view(['GET'])
def gptmodel_get_all(request):
    """
    Retrieves all GPT models from all courses
    """
    if request.method == 'GET':
        try:
            gpt_models = GPTModel.objects.all().values()
            return JsonResponse({ "gpt_models": list(gpt_models)})
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@swagger_auto_schema(methods=['post'])
@api_view(['POST'])
def gptmodel_delete(request):
    """
    Deletes a GPT model configuration
    """
    if request.method == 'POST':
        try:
            data = request.data
            ret = gptmodel_functions.delete_gptmodels(data['model_id'])
            if not(ret):
                raise Exception
            return Response(status=status.HTTP_200_OK)
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Helper functions
def get_courses_convos(course_id):
    return Conversation.objects.filter(course_id=course_id)

def get_convo_chatlogs(cid):
    return Chatlog.objects.filter(conversation_id=cid)

# Exceptions
class CourseNotFoundError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass