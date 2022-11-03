from rest_framework import serializers
from .models import Chatlog, Conversation, Feedback, Report, User, Course, Model
# from rest_framework_mongoengine.serializers import DocumentSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'utorid', 'user_role']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_code', 'semester']

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ['model_id', 'course_id']

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['user_id', 'semester']
    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['conversation_id', 'rating', 'feedback_msg']

class ChatlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog_id', 'chatlog', 'time', 'is_user', 'status']

class ChatlogDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog_id', 'time', 'is_user', 'chatlog', 'status']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['conversation_id']

class IncorrectChatlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog_id']