from rest_framework.serializers import *
from rest_framework import serializers
from .models import *
import users.serializers as user_serializers

class CourseSerializer(ModelSerializer):

    def __init__(self, *args, **kwargs):
        self.show_users = kwargs.pop('show_users', False)
        super().__init__(*args, **kwargs)
    
    students = serializers.SerializerMethodField()
    instructors = serializers.SerializerMethodField()
    researchers = serializers.SerializerMethodField()
    admins = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [ 'course_id', 'course_code', 'semester', 'course_name', 'start_date', 'end_date', 'students', 'instructors', 'researchers', 'admins' ]

    def get_students(self, obj): return [str(student) for student in obj.students] if obj.students and self.show_users else []
    def get_instructors(self, obj): return [str(instructor) for instructor in obj.instructors] if obj.instructors and self.show_users else []
    def get_researchers(self, obj): return [str(researcher) for researcher in obj.researchers] if obj.researchers and self.show_users else []
    def get_admins(self, obj): return [str(admin) for admin in obj.admins] if obj.admins and self.show_users else []

class CourseMultipleEnrollmentUserSerializer(ModelSerializer):
    
    user_id = serializers.CharField(max_length=200, required=False)
    utorid = serializers.CharField(max_length=200, required=False)
    user_role = serializers.CharField(max_length=200, default='ST', required=False)
    class Meta:
        model = User
        fields = [ 'user_id', 'utorid', 'user_role' ]
    
    # Check if either user_id or utorid is provided
    def validate(self, data):
        if 'user_id' not in data and 'utorid' not in data:
            raise serializers.ValidationError("Either user_id or utorid must be provided")
        return data