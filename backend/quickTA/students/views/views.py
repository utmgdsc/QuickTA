import csv
import uuid
import re
import pytz 
from ..openAI import quick_ta_model as model

from datetime import datetime
from http.client import responses
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone, dateparse
from django.utils.timezone import now

from ..constants import *
from ..functions import user_functions, course_functions
from ..models import Chatlog, Conversation, Course, Feedback, User, Report
from ..serializers.serializers import * 

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(methods=['post'], request_body=GetUserCoursesRequest,
    responses={
        200: openapi.Response('Success', GetUserCoursesResponse),
        400: openapi.Response('Bad Request', ErrorResponse)
    })
@api_view(['POST'])
def get_user_courses(request):
    """
    Acquires the user's list of enrolled courses.

    Returns the list of courses of a particular user given their user ID.
    """
    if request.method == 'POST':
        try:
            courses = user_functions.get_user_courses(request.data['user_id'])
            res = course_functions.get_courses_info(courses)
            response = {
                "courses": res
            }
            return Response(response, status=status.HTTP_200_OK)
        except:
            error = []
            if 'user_id' not in request.data.keys():
                error.append("User ID")
            err = {"msg": "Get user course missing fields:" + ','.join(error)}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CreateCourseRequest,
    responses={
        200: openapi.Response('Success', CreateCourseResponse),
        400: openapi.Response('Bad Request', ErrorResponse)
    })
@api_view(['POST'])
def course_detail(request):
    """
    Creates a new course.

    Acquires the course_code and semester.
    Returns the initialized course created with its course id, course name, course code and semester.
    """
    if request.method == 'POST':
        # try:
            # Check for duplicated courses
            course_code = Course.objects.filter(
                course_code=request.data['course_code'],
                semester=request.data['semester']
            )

            if (len(course_code) != 0):
                raise CourseAlreadyExistsError

            # Save new course
            course_id = str(uuid.uuid4())

            # Date Parsing Start Date
            start_date = request.data['start_date']
            end_date = request.data['end_date']
            
            course = Course(
                course_id=course_id,
                course_code=request.data['course_code'],
                semester=request.data['semester'],
                course_name=request.data['course_name'],
                start_date=start_date,
                end_date=end_date
            )
            course.save()
        
            response = {
                "course_id": course_id,
                "course_code": request.data['course_code'],
                "semester": request.data['semester'],
                "course_name": request.data['course_name'],
                "start_date": start_date,
                "end_date": end_date
            }

            return Response(response, status=status.HTTP_201_CREATED)

        # except CourseAlreadyExistsError:
        #     return Response({"msg": "Course already exists."}, status=status.HTTP_403_FORBIDDEN)
        # except:
        #     error = []
        #     if 'course_code' not in request.data.keys():
        #         error.append("Course Code")
        #     if 'semester' not in request.data.keys():
        #         error.append("Semester")
        #     err = {"msg": "Course missing fields:" + ','.join(error)}
        #     return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=GetCourseRequest,
    responses={
        200: openapi.Response('Success', GetCourseResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def course_get(request):
    """
    Retrieves a current course's information.

    Acquires the course_code, semester and course_name.
    Returns the initialized course created with its course id, course name, course code and semester.
    """
    if request.method == 'POST':
        try:
            # Check for duplicated courses
            course_code = Course.objects.filter(
                course_code=request.data['course_code'],
                semester=request.data['semester'],
                course_name=request.data['course_name']
            )

            if (len(course_code) == 0):
                raise CourseAlreadyExistsError

            course_id = 0
            course_name = ""
            for course in course_code:
                if course.semester == request.data['semester']:
                    course_id = course.course_id
                    course_name = course.course_name

            if course_id == 0: 
                raise CourseAlreadyExistsError

            response = {
                "course_id": course_id,
                "course_code": request.data['course_code'],
                "semester": request.data['semester'],
                "course_name": course_name
            }

            return Response(response, status=status.HTTP_201_CREATED)
        
        except CourseAlreadyExistsError:
            return Response({"msg": "Course does not exists."}, status=status.HTTP_404_NOT_FOUND)
        except:
            error = []
            if 'course_code' not in request.data.keys():
                error.append("Course Code")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Course missing fields:" + ','.join(error)}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=StartConversationRequest,
    responses={
        201: openapi.Response('Created', StartConversationResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def conversation_detail(request):
    """
    Retrieves a request to start a session.

    Acquires the course id and starts a new course session.
    TODO: Checks if a course id by the same user has an active conversation. 
    If the user does, then flag the old conversation as inactive.
    """
    if request.method == 'POST':
        try:
            # Acquire course
            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError
            course = course[0]

            # Initialize conversation ID
            convo_id = str(uuid.uuid4())

            # Save conversation record
            data = request.data
            convo = Conversation(
                conversation_id=convo_id,
                course_id=data['course_id'],
                user_id=data['user_id'],
                status='A',
                report=False
            )
            convo.save()

            # Response formatting
            response = {
                "conversation_id": convo_id,
                "course_id": data['course_id'],
                "user_id": data['user_id'],
                "status": 'A',
                "report": "False",
            }
            return Response(response, status=status.HTTP_201_CREATED)

        except CourseNotFoundError:
            err = {'msg': 'Course not found.'}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        except:
            error = []
            if 'user_id' not in request.data.keys():
                error.append("User ID")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Conversation details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['get'],
    responses={
        200: openapi.Response('Success', GetAllCoursesResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['GET'])
def courses_get_all(request):
    """
    Retrieves all courses.

    Returns all relevant information of all courses.
    Each course's information includes the course ID, semester, code and name.
    """
    if request.method == 'GET':
        try:
            courses = Course.objects.all().values()
            return JsonResponse({"courses": list(courses)})
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['post'], request_body=GetChatlogRequest,
    responses={

        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def chatlog_detail(request):
    """
    Retrieves and posts a chatlog from the user, then returns a response from the OpenAI model.
    
    Also fix the prompt structure with the delimiters from openAI's functions.
    Response:
    {
        'agent': {
            conversation_id: str
            chatlog_id: str
            is_user: boolean
            chatlog: str
            status: str
        },
        'user': {
            conversation_id: str
            chatlog_id: str
            is_user: boolean
            chatlog: str
            status: C [Correct]
        }
    }
    """
    if request.method == 'POST':
        # try:
            # Set current chatlog's time if not provided
            current_time = timezone.now()
            location = 'America/Toronto'
            if 'time' not in request.data.keys() or request.data['time'] == '.':
                request.data['time'] = current_time
            # Parse given chatlog time
            else: 
                time = request.data['time']
                index = time.find('[')
                location = re.search(r"\[(.*?)\]", time).group()[1:-1]
                tz = dateparse.parse_datetime(time[:index])
                request.data['time'] = tz
                current_time = tz

            # Check if conversation exists
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id=cid)

            if len(conversation) == 0:
                raise ConversationNotFoundError          
            
            # Get last message's time from this conversation from the user
            convo_chatlogs = Chatlog.objects.filter(
                conversation_id=cid,
            ).order_by('-time')
            
            last_chatlog_time = ''
            for chatlog in convo_chatlogs:
                if not(chatlog.is_user):
                    last_chatlog_time = chatlog.time
                    break
            
            # Difference in time from last agent response and current user response
            if (last_chatlog_time):
                delta = current_time - last_chatlog_time
            else:
                # First message of the conversation
                delta = current_time - current_time

            # Saves user chatlog 
            user_chatlog_id = str(uuid.uuid4())
            
            data = request.data
            user_chatlog = Chatlog(
                conversation_id=cid,
                chatlog_id=user_chatlog_id,
                time=data['time'],
                is_user=True,
                chatlog=data['chatlog'],
                delta=delta
            )
            user_chatlog.save()


            # Get response from Model
            model_chatlog_id = str(uuid.uuid4())
            course_id = conversation[0].course_id            
            model_response = model.enquire_model(cid, data['chatlog'], course_id)
            if model_response == OPERATION_FAILED:
                raise ModelDoesNotExistsError
            
            # Save message from the Model
            model_time = timezone.now()
            model_chatlog = Chatlog(
                conversation_id=cid,
                chatlog_id=model_chatlog_id,
                time=model_time,
                is_user=False,
                chatlog=model_response,
            )
            model_chatlog.save()
            
            user_chatlog_datetime = Chatlog.objects.get(chatlog_id=user_chatlog_id)

            # Formatting date
            model_time = model_time.astimezone(pytz.timezone(location)).isoformat() + '[' + location + ']'
            user_time = user_chatlog_datetime.time.astimezone(pytz.timezone(location)).isoformat() + '[' + location + ']'

            # Formatting response
            response = {
                "agent": {
                    "conversation_id": data['conversation_id'],
                    "chatlog_id" :  model_chatlog_id,
                    "time": model_time,
                    "is_user": False,
                    "chatlog": model_response,
                },
                "user": {
                    "conversation_id": data['conversation_id'],
                    "chatlog_id": user_chatlog_id,
                    "time": user_time,
                    "is_user": True,
                    "chatlog": data['chatlog'],
                    "delta": delta
                }
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        # except ConversationNotFoundError:
        #     return Response({"msg": "Conversation does not exist."}, status=status.HTTP_404_NOT_FOUND)
        # except ModelDoesNotExistsError:
        #     return Response({"msg": "Model does not exist."}, status=status.HTTP_404_NOT_FOUND)
        # except:
        #     # Error handling
        #     error = []
        #     if 'conversation_id' not in request.data.keys():
        #         error.append("Conversation ID")
        #     if 'chatlog' not in request.data.keys():
        #         error.append("Chatlog message")
        #     err = {"msg": "Chatlog details missing fields: " + ','.join(error) + '.'}

        #     return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CreateFeedbackRequest,
    responses={
        201: openapi.Response('Created', CreateFeedbackResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def feedback_detail(request):
    """
    Retrieves and saves a feedback from the user to the database.
    Logs the conversation as inactive (I) afterwards.

    Rating is an integer from 1 to 5.
    """
    if request.method == 'POST':
        try:
            if request.data['rating'] > 5:
                raise OverRatingLimitError
            
            # Flags the conversation as inactive
            convo = Conversation.objects.filter(conversation_id=request.data['conversation_id'])
            if len(convo) == 0:
                raise ConversationNotFoundError
            
            convo = convo[0]
            if convo.status == 'I':
                raise FeedbackExistsError

            Conversation.objects.filter(
                conversation_id=request.data['conversation_id']
            ).update(
                status="I",
                end_time=timezone.now()
            )

            # Save Feedback
            data = request.data
            feedback = Feedback(
                conversation_id=data['conversation_id'],
                rating=data['rating'],
                feedback_msg=data['feedback_msg']
            )
            feedback.save()

            response = {
                'conversation_id': data['conversation_id'],
                'rating': data['rating'],
                'feedback_msg': data['feedback_msg']
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        except OverRatingLimitError:
            err = {"msg": "Rating exceeded limit of 5."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        
        except ConversationNotFoundError:
            err = {"msg": "Conversation does not exist."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        
        except FeedbackExistsError:
            err = {"msg": "Feedback already exists."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'rating' not in request.data.keys():
                error.append("Rating")
            if 'feedback_msg' not in request.data.keys():
                error.append("Feedback Message")
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=GetChatlogHistoryRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def chatlog_history_detail(request):
    """
    Retrieves the conversation id and returns a copy of the chatlog.

    Returns a CSV file including the contents of a particular conversation.
    The CSV file contains all of the chatlogs pertaining to the specific conversation, formatted as follows:

        [Time], Speaker, Chatlog
    """
    if request.method == 'POST':
        # try:
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id=cid)

            # Checks if conversation is found
            if (len(conversation) > 0):
                uid = conversation[0].user_id
            else:
                raise ConversationNotFoundError

            # Checks if user is found
            print(uid)
            user = User.objects.filter(user_id=uid)
            if (len(user) > 0):
                user = user[0]
            else:
                raise UserNotFoundError

            chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        
            response = HttpResponse(
                content_type='text/csv',
                headers={'Content-Disposition': 'attachement; filename="convo-report.csv"'}
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

        # except ConversationNotFoundError:
        #     return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_404_NOT_FOUND) 
        # except UserNotFoundError:
        #     return Response({"msg": "Error: User not Found."}, status=status.HTTP_404_NOT_FOUND) 
        # except:
        #     # Error handling
        #     error = []
        #     if 'conversation_id' not in request.data.keys():
        #         error.append("Conversation ID")
        #     err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}
        #     return Response(err, status=status.HTTP_400_BAD_REQUEST) 

@swagger_auto_schema(methods=['post'], request_body=IncorrectChatlogRequest,
    responses={
        201: openapi.Response('Created', IncorrectChatlogResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def report_conversation(request):
    """
    Flags the given answer of a particular conversation as wrong.

    The corresponding field, chatlog.status:
        'I' - stands for incorrect
        'C' - stands for correct
    """
    if request.method == 'POST':
        try:
            if not(request.data['msg']):
                raise MissingReportMessageError

            convo_id = request.data["conversation_id"]
            convo = Conversation.objects.filter(conversation_id=convo_id)
            
            if len(convo) == 0:
                raise ConversationNotFoundError
            convo = convo[0]

            Conversation.objects.filter(conversation_id=convo_id).update(report=True)
            user = User.objects.filter(user_id=convo.user_id)

            if len(user) == 0:
                raise UserNotFoundError
            user = user[0]

            # Save this report 
            report = Report.objects.filter(conversation_id=convo_id)
            report_time = timezone.now()
            if len(report) != 0:
                Report.objects.filter(conversation_id=convo_id).update(
                    conversation_id= convo.conversation_id,
                    course_id=convo.course_id,
                    user_id=user.user_id,
                    name=user.name,
                    utorid=user.utorid,
                    time=report_time,
                    status='O',
                    msg=request.data['msg']
                )
            else:
                report = Report(
                    conversation_id= convo.conversation_id,
                    course_id=convo.course_id,
                    user_id=user.user_id,
                    name=user.name,
                    utorid=user.utorid,
                    time=report_time,
                    status='O',
                    msg=request.data['msg']
                )
                report.save()

            response = {
                'conversation_id': convo.conversation_id,
                'course_id': convo.course_id,
                'user_id': convo.user_id,
                'name': user.name,
                'utorid': user.utorid,
                'time': report_time,
                'status': 'O',
                'msg': request.data['msg']
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        except MissingReportMessageError:
            err = {"msg": "Please enter a report message."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        except ConversationNotFoundError:
            err = {"msg": "Conversation not found."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        except UserNotFoundError:
            err = {"msg": "User not found."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        except:
            error=[]
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Report incorrect answers: " + ','.join(error) +  '.'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CourseComfortabilityRequest,
    responses={
        201: openapi.Response('Created', CourseComfortabilityResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def course_comfortability(request):
    """
    Adds a course comfortability rating to the corresponding conversation.

    Finds the conversation given the conversation id and updates its comfortability rating.
    """
    if request.method == 'POST':
        try: 
            convo = Conversation.objects.filter(conversation_id=request.data['conversation_id'])
            if (len(convo) == 0):
                raise ConversationNotFoundError

            convo = Conversation.objects.filter(conversation_id=request.data['conversation_id']).update(comfortability_rating=request.data['comfortability_rating'])
            data = request.data
            response = {
                "conversation_id": data['conversation_id'],
                "comfortability_rating": data['comfortability_rating']
            }
            return Response(response, status=status.HTTP_201_CREATED)
        except ConversationNotFoundError: 
            err = {"msg": "Conversation not found."}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
        except:
            error=[]
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Report incorrect answers: " + ','.join(error) +  '.'}
            return Response(err, status=status.HTTP_400_BAD_REQUEST)

# Exceptions
class UserAlreadyExistsError(Exception): pass
class CourseAlreadyExistsError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass
class OverRatingLimitError(Exception): pass
class FeedbackExistsError(Exception): pass
class MissingReportMessageError(Exception): pass
class ModelDoesNotExistsError(Exception): pass