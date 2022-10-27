import uuid
from datetime import datetime
from http.client import responses
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.timezone import now
from .models import Chatlog, Conversation, Course, Feedback, User
from .serializers import ConversationSerializer, CourseSerializer, FeedbackSerializer, UserSerializer, ChatlogSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

"""
Serializers 
======================================================================================================
- ensuring data returned is in the right format (JSON)
- allows data from querysets and models to be converted into python datatypes to be rendered into JSON
"""
class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    serializer = UserSerializer(queryset, many=True)
    pass

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    serializer = UserSerializer(queryset)
    pass

class CourseList(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset, many=True)
    pass

class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset)
    pass

class ConversationList(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = CourseSerializer(queryset, many=True)
    pass

class ConversationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = CourseSerializer(queryset)
    pass

class ChatlogList(generics.ListCreateAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class ChatlogDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class FeedbackList(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset)
    pass

class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset, many=True)
    pass

@api_view(['POST'])
def user_detail(request):
    """
    Creates a new user.
    """
    try:
        request.data['user_id'] = str(uuid.uuid4())
        serializer = UserSerializer(data=request.data)
        serializer.is_valid()
        serializer.save()

        return Response(request.data, status=status.HTTP_201_CREATED)
    except:
        error = []
        if 'name' not in request.data.keys():
            error.append("Name")
        if 'utorid' not in request.data.keys():
            error.append("Utor ID")
        if 'user_role' not in request.data.keys():
            error.append("User Role")
        err = {"msg": "User details missing fields:"}

        return Response(err, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def conversation_detail(request):
    """
    Retrieves a request to start a session.
    """
    try:
        request.data['conversation_id'] = str(uuid.uuid4())
        request.data['status'] = 'A'
        serializer = ConversationSerializer(data=request.data)
        serializer.is_valid()
        serializer.save()

        return Response(request.data, status=status.HTTP_201_CREATED)
    except:
        error = []
        if 'user_id' not in request.data.keys():
            error.append("User ID")
        if 'semester' not in request.data.keys():
            error.append("Semester")
        err = {"msg": "Conversation details missing fields: " + ','.join(error) + '.'}

        return Response(err, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def chatlog_detail(request):
    """
    Retrieves a chatlog from the user, posts it and also
    returns a response from the OpenAI model.
    """
    if request.method == 'POST':
        request.data['is_user'] = True
        serializer = ChatlogSerializer(data=request.data)
        try:
            serializer.is_valid()
            serializer.save()

            # Get response from Model
            model_response = "hi"
            response = { "msg": model_response }
            
            # Save message from the Model
            data = request.data
            model_chatlog_id = str(uuid.uuid4())
            model_chatlog_data = {
                "conversation_id": data['conversation_id'],
                "chatlog_id" :  model_chatlog_id,
                "is_user": False,
                "chatlog": model_response
            }
            serializer = ChatlogSerializer(data=model_chatlog_data)
            serializer.is_valid()
            serializer.save()

            return Response(model_chatlog_data, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'chatlog_id' not in request.data.keys():
                error.append("Chatlog ID")
            if 'chatlog' not in request.data.keys():
                error.append("Chatlog message")
            err = {"msg": "Chatlog details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def feedback_detail(request):
    """
    Retrieves and saves a feedback from the user to the database.
    """
    if request.method == 'POST':
        serializer = ChatlogSerializer(data=request.data)
        try:
            serializer.is_valid()
            serializer.save()
            
            return Response(serializer, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'rating' not in request.data.keys():
                error.append("Chatlog ID")
            if 'feedback_msg' not in request.data.keys():
                error.append("Chatlog message")
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def report_detail(request):
    """
    Retrieves the conversation id and returns a copy of the chatlog
    """
    if request.method == 'POST':
        try:
            cid = request.data['conversation_id']
            uid = Conversation.objects.filter(conversation_id=cid)
            user = User.objects.filter(user_id=uid)

            chatlogs = Chatlog.objects.filter(conversation_id=cid)       
            
            convo = { 'msg': [] }
            for chatlog in chatlogs:
                if chatlog.is_user:
                    log = '[' + str(chatlog.time) + '] ' +  str(user.name) + ': ' + str(chatlog.chatlog) + '\n'
                else: 
                    log = '['+ str(chatlog.time) + '] QuickTA: ' + str(chatlog.chatlog) + '\n'
                convo['msg'].append(log)
            
            return Response(convo, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)