import time
import csv
from io import BytesIO
from datetime import datetime, date
from ..constants import * 

from ..functions import user_functions, course_functions, report_functions, conversation_functions,  time_utils, gptmodel_functions
from ..functions.common_topics import generate_wordcloud, get_wordcloud_image

from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
from django.utils.timezone import now

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers.serializers import *
from ..serializers.researcher_serializers import *
from ..serializers import researcher_serializers as rs
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q

# Research Filter view endpoints 
# ===============================================================================
@api_view(['GET', 'POST'])
def get_filtered_chatlogs(request):
    """
    TODO: Make swagger documentation for this endpoint
    """
    if request.method in ['GET', 'POST']:
        # id_contains = request.GET.get('id_contains')
        # chatlog_contains = request.GET.get('chatlog_contains')

        # qs = Chatlog.objects.all()
        convos = []
        qs = Conversation.objects.filter()
        
        for convo in qs:
            convo_id = convo.conversation_id
            feedback = ''
            try:
                # Get Feedback information
                feedback = Feedback.objects.get(conversation_id=convo_id)
            except:
                pass
            
            if convo.report: report = "True"
            else: report = "False"

            data = {
                "conversation_id": convo.conversation_id,
                "course_id": convo.course_id,
                "user_id": convo.user_id,
                "start_time": convo.start_time,
                "end_time": convo.end_time,
                "status": convo.status,
                "report": report
            }
            if (feedback):
                data['rating'] = feedback.rating
                data['feedback_msg'] = feedback.feedback_msg
            else:
                data['rating'] = None
                data['feedback_msg'] = None
            convos.append(data)

            # Sorting based on rating
            convos = sorted(convos, key=lambda item: item["rating"], reverse=False)
        
        # serializer = rs.ConversationSerializer(qs, context={'request': request}, many=True)

        return Response(convos)

# Research Analytics view endpoints
# ===============================================================================
@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', AverageRatingsResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def average_ratings(request):
    """
    Acquires the average ratings of a course.

    Finds the average rating of a particular course given the course id.
    The average rating can ether be within a weekly or monthly range.
    """
    if request.method == 'POST':
        try:
            # Check if course exists
            course = Course.objects.filter(course_id=request.data['course_id'])
            if not(course.count()): 
                raise CourseNotFoundError

            # Acquire the conversation record
            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            # Retrieve all feedback from the conversations
            ratings = []
            for convo in convos:
                q2 = Feedback.objects.filter(conversation_id=convo.conversation_id)
                if (len(q2) != 0):
                    ratings.append(q2[0].rating)
            
            # Compute average ratings
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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def average_ratings_csv(request):
    """
    Acquires the average ratings of a course in a CSV file.

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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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

@swagger_auto_schema(methods=['post'], request_body=ResolveReportedConvoRequest,
  responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def resolve_reported_conversation(request):
    """
    Resolves a reported conversation.
    """
    if request.method == 'POST':
        try:
            data = request.data
            ret = report_functions.resolve_conversation(data['conversation_id'])
            if not(ret): 
                raise Exception

            return HttpResponse(status=status.HTTP_200_OK)

        except:
            error = []
            keys = request.data.keys()
            if 'course_id' not in keys: error.append("Conversation ID")
        
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Reported Conversations missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetReportedConvoListResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
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

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def list_reported_conversations_csv(request):
    """
    Returns all reported conversations of a given course in a CSV file.
    
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

@swagger_auto_schema(methods=['post'], request_body=GetReportedConvoChatlogsRequest,
    responses={
        200: openapi.Response('Success', GetReportedConvoChatlogsResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_reported_chatlogs(request):
    """
    Returns all of the chatlogs of a reported conversation ID.

    Acquires the conversation ID of the reported conversation and returns the corresponding chatlogs.
    """
    if request.method == 'POST':
        # try:
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id=cid)

            if not(conversation):
                raise ConversationNotFoundError

            print(conversation[0].user_id)
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

        # except ConversationNotFoundError:
        #     return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_404_NOT_FOUND) 
        # except:
        #     error = []
        #     if 'conversation_id' not in request.data.keys():
        #         error.append("Conversation ID")
            
        #     if (not(error)): 
        #         err = {"msg": "Internal Server Error"}
        #         return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        #     else:
        #         err = {"msg": "Reported Chatlogs missing fields: " + ','.join(error) + '.'}
        #         return Response(err, status=status.HTTP_400_BAD_REQUEST)
       
@swagger_auto_schema(methods=['post'], request_body=GetReportedConvoChatlogsRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
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
            return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_404_NOT_FOUND) 
        except UserNotFoundError:
            return Response({"msg": "Error: User not Found."}, status=status.HTTP_404_NOT_FOUND) 
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Reported Chatlogs CSV missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_400_BAD_REQUEST) 

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetAverageResponseRateResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_average_response_rate(request):
    """
    Acquires the average response rate of a given course.

    Given the course ID, filter and timezone, returns the average response rate of a course.
    The response rate (delta) is calculated based on the second user response onwards for a particular conversation.
    Each delta is the difference between the last model-generated response from the user input.
    """
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

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_average_response_rate_csv(request):
    """
    Acquires a CSV containing the average response rate of a given course.

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

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetMostCommonTopicsResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_most_common_words(request):
    """
    Acquires the most common topics within user responses for a given course.

    Retrieves the most common topics through the use of YAKE (Yet Another Keyword Extractor).
    Returns 3-gram topics keywords with their associated frequency. 
    """
    if request.method == 'POST':
        try:
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

            #  Extract these words and create word clouds with them

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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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

@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetMostCommonTopicsWordCloudResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse),
    })
@api_view(['POST'])
def get_most_common_words_wordcloud(request):
    """
    Acquires the most common topics within user response for a given course.

    Retrieves the most common topics through the use of YAKE (Yet Another Keyword Extractor).
    Returns 3-gram topic keywords with their associated frequency. 
    The resulting response will be a PNG image file containing a worldcloud image.
    """
    if request.method == 'POST':
        try:
            sentences = []
            data = request.data
            convos = conversation_functions.get_filtered_convos(data['course_id'], data['filter'], data['timezone'])

            #  Acquire all the conversations of a selected time period given the course
            for convo in convos:
                chatlogs = get_convo_chatlogs(convo.conversation_id)
                for chatlog in chatlogs:
                    if chatlog.is_user:
                        sentences.append(chatlog.chatlog)
            
            # Generate the wordcloud image
            img = get_wordcloud_image(sentences)

            image_data = BytesIO()
            img.save(image_data, format='png')
            image_data.seek(0)

            # Return the wordcloud image as a file to the frontend
            today = timezone.now()
            response = HttpResponse(
                image_data,
                content_type='image/png',
                headers={'Content-Disposition': 'attachement; filename="wordcloud-{}-{}.png"'.format(today, data['filter'])}
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"

            return response
        except:
            error = []
            if 'course_code' not in request.data.keys(): error.append("Course Code")
            if 'filter' not in request.data.keys(): error.append("Filter")
            if 'timezone' not in request.data.keys(): error.append("Timezone")
            
            if error:
                err = {"msg": "Most Common Words Wordcloud Missing FIelds:" + ','.join(error)}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)



@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetCourseComfortabilityResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_course_comfortability(request):
    """
    Acquires the average course comfortability rating for a given course.

    Retrieves the average course comfortability rating of a course for a given period of time.
    The filter can be either 'Weekly' or 'Monthly'.
    """
    if request.method == 'POST':
        try:
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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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
        
@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def get_course_comfortability_csv(request):
    """
    Retrieves a CSV copy of all the course comfortability ratings of a given course id.

    Retrieves the average course comfortability rating of a course for a given period of time.
    The filter can be either 'Weekly' or 'Monthly'.
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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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


@swagger_auto_schema(methods=['post'], request_body=GetFilteredStatsRequest,
    responses={
        200: openapi.Response('Success', GetInteractionFrequencyResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
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

            if len(course) == 0:
                raise CourseNotFoundError

            # Get all dates in range for a particular filter view (Weekly or Monthly)
            data = request.data
            dates = time_utils.get_all_dates(data['course_id'], data['filter'], data['timezone'])

            interactions = conversation_functions.get_filtered_interactions(data['course_id'], dates, data['timezone'])

            response = {
                "interactions": interactions 
            }
            
            return Response(response, status=status.HTTP_200_OK)

        except CourseNotFoundError:
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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
                err = {"msg": "Interaction Frequency missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=GetCourseUserListRequest,
    responses={
        200: openapi.Response('Success', GetCourseUserListResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
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
    if request.method == 'POST':
        try:
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
            return Response({"msg": "Error: Course not Found."}, status=status.HTTP_404_NOT_FOUND)
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

# GPT Model Related Endpoints
# ====================================================================================
@swagger_auto_schema(methods=['post'], request_body=GetOneGPTModelRequest,
    responses={
        200: openapi.Response('Success', GetOneGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_get_one(request):
    """
    Acquires one GPT Model when given the course_id and model_id
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.get_one_gptmodel(data['model_id'], data['course_id'])
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
                err = {"msg": "GPT get one model missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CreateGPTModelRequest,
    responses={
        200: openapi.Response('Success', CreateGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_create(request):
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
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model creation missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=UpdateGPTModelRequest,
    responses={
        200: openapi.Response('Success', UpdateGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
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

@swagger_auto_schema(methods=['post'], request_body=SwitchGPTModelRequest,
    responses={
        200: openapi.Response('Success', SwitchGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_select(request):
    """
    Activates a selected GPTModel
    """
    if request.method == 'POST':
        try:
            data = request.data
            ret = gptmodel_functions.switch_gptmodel(data['course_id'], data['model_id'])
            
            if OPERATION_FAILED:
                raise Exception
            res = { "success": ret } 
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

@swagger_auto_schema(methods=['post'], request_body=GetCourseGPTModelRequest,
    responses={
        200: openapi.Response('Success', GetCourseGPTModelResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_get(request):
    """
    Returns all GPT models related to a course.
    """
    if request.method == 'POST':
        try:
            data = request.data
            gpt_models = gptmodel_functions.get_gptmodels(data['course_id'])
            
            return JsonResponse({"gpt_models": gpt_models})
        except:
            return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['get'],
    responses={
        200: openapi.Response('Success', GetAllCourseGPTModelResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['GET'])
def gptmodel_get_all(request):
    """
    Retrieves all GPT models from all courses.
    """
    if request.method == 'GET':
        try:
            gpt_models = GPTModel.objects.all().values()
            return JsonResponse({ "gpt_models": list(gpt_models)})
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@swagger_auto_schema(methods=['post'], request_body=DeleteGPTModelRequest,
    responses={
        200: openapi.Response('Success'),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_delete(request):
    """
    Deletes a GPT model configuration.
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