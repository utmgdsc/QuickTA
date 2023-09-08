from rest_framework.serializers import *
from rest_framework import serializers
from .models import *

class ConversationSerializer(ModelSerializer):

    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'user_id',
            'course_id',
            'start_time',
            'end_time',
            'status',
            'reported',
            'comfortability_rating'
        ]

class ChatlogSerializer(ModelSerializer):

    class Meta:
        model = Chatlog
        fields = [
            'conversation_id',
            'chatlog_id',
            'time',
            'is_user',
            'chatlog',
            'delta'
        ]

class FeedbackSerializer(ModelSerializer):

    class Meta:
        model = Feedback
        fields = [
            'conversation_id',
            'rating',
            'feedback_msg'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['rating'].validators.append(MinValueValidator(0))
        self.fields['rating'].validators.append(MaxValueValidator(5))

class ReportSerializer(ModelSerializer):
    
        class Meta:
            model = Report
            fields = [
                'conversation_id',
                'time',
                'status',
                'msg'
            ]

class CourseComfortabilitySerializer(ModelSerializer):

    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'comfortability_rating'
        ]
