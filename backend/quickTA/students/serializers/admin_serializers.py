from rest_framework import serializers
from ..models import User

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'utorid', 'user_role']
    
class AddUserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id']