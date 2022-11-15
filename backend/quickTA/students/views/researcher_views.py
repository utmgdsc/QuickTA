from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import User, Chatlog, Conversation, Feedback, Report
from ..serializers.serializers import ConversationSerializer
from ..serializers.researcher_serializers import ResearchersSerializer, ReportedListSerializer, AverageRatingSerializer, ChatlogListSerializer, ResponseRateSerializer, MostCommonWordsSerializer

from drf_yasg.utils import swagger_auto_schema
from ..functions.common_topics import generate_wordcloud
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
            for convo in q1:
                q2 = Feedback.objects.get(conversation_id=convo.conversation_id)
                ratings.append(q2.rating)

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
    try:
        # Retrieve all reported conversations
        reported_convos = Report.objects.filter(
                course_id=request.data['course_id'], 
                status='O'
            ).order_by('-time')
        print(reported_convos)
        response = {}

        for i, report in enumerate(reported_convos):
            response[i] = {
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
        err = {"msg": "Internal Server Error"}
        return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['post'], request_body=ChatlogListSerializer)
@api_view(['POST'])
def get_reported_chatlogs(request):
    """
    Returns all of the chatlogs of a given conversation ID 
    """
    try:
        cid = request.data['conversation_id']
        conversation = Conversation.objects.get(conversation_id=cid)

        if not(conversation):
            raise ConversationNotFoundError
        
        chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        user = User.objects.get(user_id=conversation.user_id)
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
            "total_reported_count": len(conversation),
            "conversations": conversations
        }
        return Response(response, status=status.HTTP_200_OK)

    except ConversationNotFoundError:
        return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_401_UNAUTHORIZED) 
    except:
        err = {"msg": "Internal Server Error"}
        return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['post'], request_body=ResponseRateSerializer)
@api_view(['POST'])
def get_average_response_rate(request):
    if request.method == 'POST':
        try:
            q1 = Conversation.objects.filter(course_id=request.data['course_id'])
            
            deltas = []
            total_delta = 0
            total_chatlogs = 0
            
            for convo in q1:
                print(convo)
                q2 = Chatlog.objects.filter(conversation_id=convo.conversation_id)
                for chatlog in q2:
                    if chatlog.is_user:                    
                        delta = chatlog.delta.total_seconds() 
                        if delta != 0:
                            deltas.append(delta)
                            total_delta += delta
                            total_chatlogs += 1
            avg_response_rate = total_delta / total_chatlogs
            response = {
                "avg_response_rate": avg_response_rate,
                "all_response_rates": deltas
            }
            return Response(response, status=status.HTTP_200_OK)
        except:
            err = {"msg": "Internal Server Error"}
            return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@swagger_auto_schema(methods=['post'], request_body=MostCommonWordsSerializer)
@api_view(['POST'])
def get_most_common_words(request):
    if request.method == 'POST':
        serializer = MostCommonWordsSerializer(data=request.data)
        serializer.is_valid()

        # Gather all user chatlogs
        sentences = []
        convo_count = 0
        chatlog_count = []
        convos = get_courses_convos(request.data['course_id'])
        for convo in convos:
            convo_count += 1
            chatlog_count.append(0)
            chatlogs = get_convo_chatlogs(convo.conversation_id)
            for chatlog in chatlogs:
                chatlog_count[convo_count-1] += 1
                if chatlog.is_user:
                    sentences.append(chatlog.chatlog)
        
        generate_wordcloud(sentences)

        response = {
            "avg_chatlog_count": sum(chatlog_count) / convo_count,
            "total_chatlog_count": sum(chatlog_count),
            "avg_chatlog_length": sum([len(chatlog) for chatlog in sentences]) / sum(chatlog_count),
            "sentences": sentences
        }
        return Response(response, status=status.HTTP_200_OK)

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