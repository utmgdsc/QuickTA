from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import Chatlog, Conversation, Feedback
from ..serializers.serializers import ConversationSerializer
from ..serializers.researcher_serializers import ResearchersSerializer, ReportedListSerializer, AverageRatingSerializer, ChatlogListSerializer

from drf_yasg.utils import swagger_auto_schema

# Create your views here.
class ResearchersView(generics.CreateAPIView):
    queryset = Chatlog.objects.all()
    serializer_class = ResearchersSerializer


@swagger_auto_schema(methods=['post'], request_body=AverageRatingSerializer)
@api_view(['POST'])
def average_ratings(request):
    """
    Finds the average rating of a particular course given the course id
    """
    if request.method == 'POST':
        try:
            # Retrieve all convesrations from the course
            q1 = Conversation.objects.filter(course_id=request.data['course_id'])
            
            # Retrieve all feedback from the conversations
            ratings = []
            for conversation in q1:
                q2 = Feedback.objects.get(conversation_id=conversation['conversation_id'])
                ratings.append(q2['rating'])

            # Find average of all the ratings of that particular course
            response = { 
                'avg_ratings': sum(ratings) / len(ratings),  
                'all_ratings': ratings
            }

            return Response(response, status=status.HTTP_200_OK)
        except:
            error = []
            if 'course_id' not in request.data.keys():
                error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "Average Ratings missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(methods=['post'], request_body=ReportedListSerializer)
@api_view(['POST'])
def list_reported_conversations(request):
    """
    Returns all reported conversations of a given course.
    """
    # try:
        # Retrieve all reported conversations
    reported_convos = Conversation.objects.filter(
            course_id=request.data['course_code'], 
        )
    
    response = {}

    for i in range(len(reported_convos)):
        curr = reported_convos[i]
        response[curr.conversation_id] = {
            'user_id': curr.user_id,
            'course_id': curr.course_id,
            'report': curr.report,
            'semester': curr.semester,
            'start_time': curr.start_time,
            'end_time': curr.end_time
        }
    return Response(response, status=status.HTTP_200_OK)  
    # except:
    #     err = {"msg": "Internal Server Error"}
    #     return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['post'], request_body=ChatlogListSerializer)
@api_view(['POST'])
def get_reported_chatlogs(request):
    """
    Returns all of the chatlogs of a given conversation ID 
    """
    # try:
    cid = request.data['conversation_id']
    conversation = Conversation.objects.get(conversation_id=cid)

    if not(conversation):
        raise ConversationNotFoundError
    
    chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')

    response = {}
    for (i, chatlog) in enumerate(chatlogs):
        if chatlog.is_user:
            speaker = 'Test User 3'
        else:
            speaker = 'Agent'
        response[str(i)] = {
            'chatlog_id': chatlog.chatlog_id,
            'speaker': speaker,
            'chatlog': chatlog.chatlog,
            'time': chatlog.time
        }
    
    return Response(response, status=status.HTTP_200_OK)

    # except ConversationNotFoundError:
    #     return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_401_UNAUTHORIZED) 
    # except:
    #     err = {"msg": "Internal Server Error"}
    #     return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema()
@api_view()

# Exceptions
class CourseNotFoundError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass