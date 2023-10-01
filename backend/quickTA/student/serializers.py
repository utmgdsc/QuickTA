import pytz
from rest_framework.serializers import *
from rest_framework import serializers
from .models import *

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
            'comfortability_rating'
        ]

class ConversationHistorySerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'conversation_name',
            'model_id',
            'status',
            'start_time',
            'end_time',
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

   


class ConversationChatlogSerializer(ModelSerializer):
    
    class Chatlogs(ModelSerializer):
        time = serializers.SerializerMethodField()
        class Meta:
            model = Chatlog
            fields = [
               'conversation_id',
                'chatlog_id',
                'time',
                'is_user',
                'chatlog',
            ]
        
        def get_time(self, obj):
            location = 'America/Toronto'
            return obj.time.astimezone(pytz.timezone(location)).isoformat() + "[" + location + "]"

    def __init__(self, *args, **kwargs):
        self.conversation_id = kwargs.pop('conversation_id', "")
        super().__init__(*args, **kwargs)

    chatlogs = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'chatlogs'
        ]
        
    def get_chatlogs(self, obj):
        chatlogs = Chatlog.objects.filter(conversation_id=self.conversation_id).order_by('time')
        serializer = self.Chatlogs(chatlogs, many=True)
        return serializer.data
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
