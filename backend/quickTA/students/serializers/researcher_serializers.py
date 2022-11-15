from rest_framework import serializers
from ..models import Chatlog, Course

class ResearchersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id', 'chatlog']

class AverageRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_code']

class ReportedListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id']

class ChatlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        fields = ['conversation_id']
