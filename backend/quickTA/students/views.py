from django.shortcuts import render
from django.http import JsonResponse
from .models import Chatlog, Conversation, Course, Feedback, User
from .serializers import ConversationSerializer, CourseSerializer, FeedbackSerializer, UserSerializer, ChatlogSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

"""
Serializers 
======================================
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

class ConversationDetail(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = CourseSerializer(queryset)
    pass

class ChatlogList(generics.ListCreateAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class ChatlogDetail(generics.ListCreateAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class FeedbackList(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset)
    pass

class FeedbackDetail(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset, many=True)
    pass

