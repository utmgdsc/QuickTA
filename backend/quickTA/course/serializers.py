from rest_framework.serializers import *
from rest_framework import serializers
from .models import *
import users.serializers as user_serializers

class CourseSerializer(ModelSerializer):
    
    students = serializers.SerializerMethodField()
    instructors = serializers.SerializerMethodField()
    researchers = serializers.SerializerMethodField()
    admins = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'course_id',
            'course_code',
            'semester',
            'course_name',
            'start_date',
            'end_date',
            'students',
            'instructors',
            'researchers',
            'admins'
        ]

    def get_students(self, obj): return [str(student) for student in obj.students] if obj.students else []
    def get_instructors(self, obj): return [str(instructor) for instructor in obj.instructors] if obj.instructors else []
    def get_researchers(self, obj): return [str(researcher) for researcher in obj.researchers] if obj.researchers else []
    def get_admins(self, obj): return [str(admin) for admin in obj.admins] if obj.admins else []