from rest_framework.serializers import *
from rest_framework import serializers
from .models import *
from course.models import Course

class UserSerializer(ModelSerializer):
    
    
    USER_ROLE_CHOICES = (
        ('ST', 'Student'),
        ('RS', 'Researcher'),
        ('AM', 'Admin'),
        ('IS', 'Instructor'),
    )

    user_role = serializers.ChoiceField(choices=USER_ROLE_CHOICES)
    courses = serializers.ListField(child=serializers.CharField(max_length=200), required=False)
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'user_id',
            'name',
            'utorid',
            'user_role',
            'courses',
            'model_id',
            'new_user',
            'status'
        ]
    
    def get_courses(self, obj): return [str(course) for course in obj.courses]
    def get_status(self, obj): return [s for s in obj.status]

class UserBatchAddSerializer(ModelSerializer):

    user_role = serializers.CharField(default='ST', required=False)
    class Meta:
        model = User
        fields = [
            'user_id',
            'name',
            'utorid',
            'user_role',
            'courses',
            'model_id',
            'new_user'
        ]

    def __init__(self, *args, **kwargs):
        role = kwargs.pop('role', None)
        super().__init__(*args, **kwargs)
        if role: self.role = role

    def to_internal_value(self, data):
        if 'user_role' not in data: 
            data['user_role'] = self.role
        data['user_id'] = uuid.uuid4()      
        
        courses = data.pop('courses', [])
        data['courses'] = courses

        return super().to_internal_value(data)

