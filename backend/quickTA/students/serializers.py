from rest_framework import serializers
from .models import User
# from rest_framework_mongoengine.serializers import DocumentSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'utorid', 'us']