from rest_framework import serializers
from .models import Chatlog, Conversation, Feedback, User, Course, Model
# from rest_framework_mongoengine.serializers import DocumentSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'utorid', 'user_role']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'semester', 'course_code']

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ['model_id', 'course_id']

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['user_id', 'start_time', 'end_time', 'status', 'semester']
    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['conversation_id', 'rating', 'feedback_msg']

class ChatlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog_id', 'time', 'is_user', 'chatlog']


