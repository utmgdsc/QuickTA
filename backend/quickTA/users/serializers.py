from rest_framework.serializers import *
from rest_framework import serializers
from .models import *

class UserSerializer(ModelSerializer):
    
    
    USER_ROLE_CHOICES = (
        ('ST', 'Student'),
        ('RS', 'Researcher'),
        ('AM', 'Admin'),
        ('IS', 'Instructor'),
    )

    user_role = serializers.ChoiceField(choices=USER_ROLE_CHOICES)
    courses = serializers.ListField(child=serializers.CharField(max_length=200))

    class Meta:
        model = User
        fields = [
            'user_id',
            'name',
            'utorid',
            'user_role',
            'courses'
        ]
    
    def get_courses(self, obj): return [str(course) for course in obj.courses]