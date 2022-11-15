import csv
import uuid
from datetime import datetime
from http.client import responses
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
from django.utils.timezone import now
from ..models import Chatlog, Conversation, Course, Feedback, User, Report
from ..serializers.serializers import ConversationSerializer, CourseSerializer, FeedbackSerializer, IncorrectChatlogSerializer, UserSerializer, ChatlogSerializer, ReportSerializer, ChatlogDetailSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

from drf_yasg.utils import swagger_auto_schema
"""
Serializers 
======================================================================================================
- ensuring data returned is in the right format (JSON)
- allows data from querysets and models to be converted into python datatypes to be rendered into JSON
"""


class UserList(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    serializer = UserSerializer(queryset, many=True)
    pass


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    serializer = UserSerializer(queryset)
    pass


class CourseList(generics.ListAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset, many=True)
    pass


class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset)
    pass


class ConversationList(generics.ListAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = ConversationSerializer(queryset, many=True)
    pass


class ConversationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = ConversationSerializer(queryset)
    pass


class ChatlogList(generics.ListAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass


class ChatlogDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatlogDetailSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogDetailSerializer(queryset)
    pass


class FeedbackList(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset)
    pass


class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset, many=True)
    pass


@swagger_auto_schema(methods=['post'], request_body=UserSerializer)
@api_view(['POST'])
def user_detail(request):
    """
    Creates a new user.

    A User can be of the following roles:
        
        - ST: student
        - IS: instructor
        - RS: researcher
        - AM: admin

    API endpoint: /api/user
    Supported operations: /POST

    Request:
    {
        name: str,
        utorid: str,
        user_role: str
    }
    Response: {
        user_id: str
    }
    """

    if request.method == 'POST':
        try:
            # Response validation
            serializer = UserSerializer(data=request.data)
            serializer.is_valid()
            
            request.data['user_id'] = str(uuid.uuid4())
            
            utorid = User.objects.filter(utorid=request.data['utorid'])
            if (len(utorid) != 0):
                raise UserAlreadyExistsError

            # Save newly created user
            data = request.data
            user = User(
                user_id=data['user_id'],
                name=data['name'],
                utorid=data['utorid'],
                user_role=data['user_role']                
            )
            user.save()

            response = {
                "user_id": user.user_id,
                "name": user.name,
                "utorid": user.utorid,
                "user_role": user.user_role
            }
            return Response(response, status=status.HTTP_201_CREATED)
        except UserAlreadyExistsError:
            return Response({"msg": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            if 'name' not in request.data.keys():
                error.append("Name")
            if 'utorid' not in request.data.keys():
                error.append("Utor ID")
            if 'user_role' not in request.data.keys():
                error.append("User Role")
            err = {"msg": "User details missing fields:" + ','.join(error)}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED)


@swagger_auto_schema(methods=['post'], request_body=CourseSerializer)
@api_view(['POST'])
def course_detail(request):
    """
    Creates a new course.

    API endpoint: /api/course
    Supported operations: /POST

    Request:
    {
        course_code: str,
        semester: str
    }
    Response: {
        course_id: str,
        course_code: str,
        semester: str
    }
    """
    if request.method == 'POST':
        try:
            # Response Validation
            serializer = CourseSerializer(data=request.data)
            serializer.is_valid()

            # Check for duplicated courses
            course_code = Course.objects.filter(
                course_code=request.data['course_code'],
                semester=request.data['semester']
            )

            if (len(course_code) != 0):
                raise CourseAlreadyExistsError

            # Save new course
            course_id = str(uuid.uuid4())

            course = Course(
                course_id=course_id,
                course_code=request.data['course_code'],
                semester=request.data['semester']
            )
            course.save()

            response = {
                "course_id": course_id,
                "course_code": request.data['course_code'],
                "semester": request.data['semester']
            }

            return Response(response, status=status.HTTP_201_CREATED)

        except CourseAlreadyExistsError:
            return Response({"msg": "Course already exists."}, status=status.HTTP_403_FORBIDDEN)
        except:
            error = []
            if 'course_code' not in request.data.keys():
                error.append("Course Code")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Course missing fields:" + ','.join(error)}
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)


@swagger_auto_schema(methods=['post'], request_body=ConversationSerializer)
@api_view(['POST'])
def conversation_detail(request):
    """
    Retrieves a request to start a session.

    API endpoint: /api/conversation
    Supported operations: /POST

    Request: 
    {
        user_id: str,
        course_id: str,
        semester: str
    }

    Response: {
        conversation_id
    }
    """

    if request.method == 'POST':
        try:
            serializer = ConversationSerializer(data=request.data)
            serializer.is_valid()

            course = Course.objects.filter(course_id=request.data['course_id'])
            if len(course) == 0:
                raise CourseNotFoundError
            course = course[0]

            convo_id = str(uuid.uuid4())

            data = request.data
            convo = Conversation(
                conversation_id=convo_id,
                course_id=data['course_id'],
                user_id=data['user_id'],
                status='A',
                report=False
            )
            convo.save()

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
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)
        except:
            error = []
            if 'user_id' not in request.data.keys():
                error.append("User ID")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Conversation details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED)


@swagger_auto_schema(methods=['post'], request_body=ChatlogSerializer)
@api_view(['POST'])
def chatlog_detail(request):
    """
    Retrieves a chatlog from the user, posts it and also
    returns a response from the OpenAI model.

    API endpoint: /api/chatlog
    Supported operations: /POST

    Request: 
    {
        conversation_id: str
        chatlog: str
    }

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

        try:
            current_time = timezone.now()
            if 'time' not in request.data.keys():
                request.data['time'] = current_time
            serializer = ChatlogSerializer(data=request.data)
            serializer.is_valid()

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
            model_response = "hi"
            
            # Save message from the Model
            model_chatlog_id = str(uuid.uuid4())
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
                    "time": user_chatlog_datetime.time,
                    "is_user": True,
                    "chatlog": data['chatlog'],
                    "delta": delta
                }
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'chatlog' not in request.data.keys():
                error.append("Chatlog message")
            err = {"msg": "Chatlog details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(methods=['post'], request_body=FeedbackSerializer)
@api_view(['POST'])
def feedback_detail(request):
    """
    Retrieves and saves a feedback from the user to the database.
    Logs the conversation as inactive (I) afterwards.

    Rating is an integer from 1 to 5.

    API Endpoint: /api/feedback
    Supported operations: /POST

    Request:
    {
        conversation_id: str,
        rating: int,
        feedback_msg: str
    }

    Response: 
        HTTP status code 201: CREATED
    """
    if request.method == 'POST':
        try:
            serializer = FeedbackSerializer(data=request.data)
            serializer.is_valid()
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
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)
        
        except ConversationNotFoundError:
            err = {"msg": "Conversation does not exist."}
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)
        
        except FeedbackExistsError:
            err = {"msg": "Feedback already exists."}
            return Response(err, status=status.HTTP_401_UNAUTHORIZED)
        
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

@swagger_auto_schema(methods=['post'], request_body=ReportSerializer)
@api_view(['POST'])
def chatlog_history_detail(request):
    """
    Retrieves the conversation id and returns a copy of the chatlog.

    API Endpoint: /api/report
    Supported operations: /POST

    Request:
    {
        conversation_id: str
    }

    Response: 
        CSV file containing all the chatlogs
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
            
            report = Report(conversation_id=cid)
            report.save()

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
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED) 

@swagger_auto_schema(methods=['post'], request_body=IncorrectChatlogSerializer)
@api_view(['POST'])
def report_conversation(request):
    """
    Flags the given answer of a particular conversation as wrong.

    The corresponding field, chatlog.status:
        'I' - stands for incorrect
        'C' - stands for correct

    API Endpoint: /api/incorrect-answer
    Supported operations: /POST

    Request:
    {
        conversation_id: str
        chatlog_id: str
    }

    Response: 
        HTTP status code 200: OK
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
            return Response(response, status=status.HTTP_200_OK)
        
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
            return Response(err, status=status.HTTP_404_NOT_FOUND)

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
