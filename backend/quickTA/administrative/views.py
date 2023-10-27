from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from student.models import *
from users.models import User

from django.shortcuts import get_object_or_404
from rest_framework.serializers import *
from rest_framework import serializers
class ConversationSerializer(ModelSerializer):

    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'conversation_name',
            'user_id',
            'course_id',
            'model_id',
            'start_time',
            'end_time',
            'status',
            'reported',
            'comfortability_rating',
            'conversation_log',
            'forced_inactive'
        ]
class ConversationQueryView(APIView):

    @swagger_auto_schema(
        operation_description="Get conversation between two users",
        manual_parameters=[
            openapi.Parameter(
                name="course_id",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="Course ID",
                required=False,
            ),
            openapi.Parameter(
                name="user_id",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="User ID",
                required=False,
            ),
            openapi.Parameter(
                name="utorid",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="Utorid",
                required=False,
            ),
            openapi.Parameter(
                name="query",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="Query",
                required=False,
            )
        ],
        responses={200: ConversationSerializer(many=True)}
    )
    def get(self, request):
        course_id = request.query_params.get("course_id", '')
        user_id = request.query_params.get("user_id", '')
        utorid = request.query_params.get("utorid", '')
        query = request.query_params.get("query", '')

        if utorid: user = get_object_or_404(User, utorid=utorid)
        elif user_id: user = get_object_or_404(User, user_id=user_id)

        # Get all matching conversations
        conversations = Conversation.objects.all()
        if user: conversations.filter(user_id=user.user_id)
        if course_id: conversations.filter(course_id=course_id)

        conversation_ids = [str(conversation.conversation_id) for conversation in conversations]
        chatlogs = Chatlog.objects.filter(conversation_id__in=conversation_ids)
        if query: chatlogs = chatlogs.filter(chatlog__icontains=query)
        
        # Get the conversation ids of these chatlogs
        conversation_ids = [chatlog.conversation_id for chatlog in chatlogs]
        conversations = Conversation.objects.filter(conversation_id__in=conversation_ids)

        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

