from rest_framework.serializers import *
from rest_framework import serializers
from .models import *
import users.serializers as user_serializers

class CourseSerializer(ModelSerializer):
    
    students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'course_id',
            'course_code',
            'semester',
            'course_name',
            'start_date',
            'end_date',
            'students'
        ]

    def get_students(self, obj):
        return [str(student) for student in obj.students]