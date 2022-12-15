from rest_framework import serializers
from ..models import User

# Create User Request
# ===========================================================
class CreateOneUserRequest(serializers.Serializer):
    name = serializers.CharField()
    utorid = serializers.CharField()
    user_role = serializers.CharField()

class CreateOneUserResponse(serializers.Serializer):
    user_id = serializers.CharField()
    name = serializers.CharField()
    utorid = serializers.CharField()
    user_role = serializers.CharField()

# Create Multiple Users Request
# ===========================================================
class CreateMultipleUserRequest(serializers.Serializer):
    users = CreateOneUserRequest(many=True)

class CreateMultipleUserResponse(serializers.Serializer):
    added = CreateOneUserResponse(many=True)

# Add User to Course Request
# ===========================================================
class AddUserToCourseRequest(serializers.Serializer):
    user_id = serializers.CharField()
    course_id = serializers.CharField()
    type = serializers.CharField()

# Add Multiple Users to Course Request
# ===========================================================
class AddMultipleUserToCourseRequest(serializers.Serializer):
    
    class UsersToCourse(serializers.Serializer):
        user_id = serializers.CharField()

    users = UsersToCourse(many=True)
    course_id = serializers.CharField()
    type = serializers.CharField()

# Remove User from Course Request
# ===========================================================
class RemoveUserFromCourseRequest(serializers.Serializer):
    user_id = serializers.CharField()
    course_id = serializers.CharField()
    type = serializers.CharField()
