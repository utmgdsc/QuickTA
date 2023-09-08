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

    class Meta:
        model = User
        fields = [
            'user_id',
            'name',
            'utorid',
            'user_role',
        ]