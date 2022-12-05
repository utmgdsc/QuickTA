from rest_framework import serializers
from ..models import Chatlog, Course, GPTModel, Report

class ResearchersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog']

class AverageRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class ReportedListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']
class ResolveReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['conversation_id']

class ChatlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id']

class ResponseRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']       

class MostCommonWordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id'] 

class CourseComfortabilityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class ChatlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        # fields = ['id', 'conversation_id', 'chatlog_id', 'time', 'is_user', 'chatlog', 'delta']
        fields = '__all__'
class CourseUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class InteractionFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class GPTModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPTModel
        fields = ['model_name', 'course_id', 'model', 'prompt', 'max_tokens', 'top_p', 'presence_penalty', 'frequency_penalty']

class GPTModelSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPTModel
        fields = ['course_id', 'model_id']
