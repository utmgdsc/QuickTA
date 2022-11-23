from rest_framework import serializers
from ..models import Chatlog, Course

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

class CourseUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class InteractionFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']