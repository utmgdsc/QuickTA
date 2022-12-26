from rest_framework import serializers
from ..models import *

# Generic API Django API views
# ======================================================
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['name', 'utorid', 'user_role']
# class CourseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Course
#         fields = ['course_code', 'semester', 'course_name']
# class ConversationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Conversation
#         fields = ['user_id', 'course_id']
# class ChatlogSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Chatlog
#         fields = ['conversation_id', 'chatlog']

# Get User Request and Response
# ======================================================
class GetUserRequest(serializers.Serializer):
    utorid = serializers.CharField()

class GetUserResponse(serializers.Serializer):
    user_id = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    utorid = serializers.CharField(required=False)
    user_role = serializers.CharField(required=False)

# Create User Request and Response
# ======================================================
class CreateUserRequest(serializers.Serializer):
    name = serializers.CharField()
    utorid = serializers.CharField()
    user_role = serializers.CharField()

class CreateUserResponse(serializers.Serializer):
    user_id = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    utorid = serializers.CharField(required=False)
    user_role = serializers.CharField(required=False)

# Get User's Courses Request and Response
# ======================================================
class GetUserCoursesRequest(serializers.Serializer):
    user_id = serializers.CharField()

class GetUserCoursesResponse(serializers.Serializer):
    course_id = serializers.ListField(required=False)
    courses = serializers.ListField(child=serializers.CharField(label="course_id"), required=False)

# Create Course Request and Response
# ======================================================
class CreateCourseRequest(serializers.Serializer):
    course_name = serializers.CharField()
    course_code = serializers.CharField()
    semester = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()

class CreateCourseResponse(serializers.Serializer):
    course_id = serializers.CharField(required=False)
    course_code = serializers.CharField(required=False)
    semester = serializers.CharField(required=False)
    course_name = serializers.CharField(required=False)
    start_date = serializers.DateField()
    end_date = serializers.DateField()

# Get Course Request and Response
# ======================================================
class GetCourseRequest(serializers.Serializer):
    course_code = serializers.CharField()
    semester = serializers.CharField()
    course_name = serializers.CharField(required=False)

class GetCourseResponse(serializers.Serializer):
    course_id = serializers.CharField(required=False)
    course_code = serializers.CharField(required=False)
    semester = serializers.CharField(required=False)
    course_name = serializers.CharField(required=False)

# Start Conversation Request and Response
# ======================================================
class StartConversationRequest(serializers.Serializer):
    course_id = serializers.CharField()
    user_id = serializers.CharField()

class StartConversationResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    course_id = serializers.CharField(required=False)
    user_id = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    report = serializers.CharField(required=False)

# Get All Courses Response
# ======================================================
class GetAllCoursesResponse(serializers.Serializer):
    course_id = serializers.CharField(max_length=50, required=False)
    semester = serializers.CharField(max_length=10, required=False)
    course_code = serializers.CharField(max_length=9, required=False)
    course_name = serializers.CharField(max_length=1000, required=False)

# Get Chatlog Request and Response
# ======================================================
class GetChatlogRequest(serializers.Serializer):
    conversation_id = serializers.CharField()
    chatlog = serializers.CharField()
    time = serializers.CharField(required=False, min_length=0)

class GetUserChatlogResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    chatlog_id = serializers.CharField(required=False)
    time = serializers.CharField(required=False)
    is_user = serializers.BooleanField(required=False)
    chatlog = serializers.CharField(required=False)
    delta = serializers.FloatField(required=False)

class GetAgentChatlogResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    chatlog_id = serializers.CharField(required=False)
    time = serializers.CharField(required=False)
    is_user = serializers.BooleanField(required=False)
    chatlog = serializers.CharField(required=False)

# Create Feedback Request and Response
# ======================================================
class CreateFeedbackRequest(serializers.Serializer):
    conversation_id = serializers.CharField()
    rating = serializers.IntegerField()
    feedback_msg = serializers.CharField(required=False)

class CreateFeedbackResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    rating = serializers.IntegerField(required=False)
    feedback_msg = serializers.CharField(required=False)
    
# Get Chatlog History Request and Response
# ======================================================
class GetChatlogHistoryRequest(serializers.Serializer):
    conversation_id = serializers.CharField()

# Incorrect Chatlog Request and Response
# ======================================================
class IncorrectChatlogRequest(serializers.Serializer):
    conversation_id = serializers.CharField()
    msg = serializers.CharField()

class IncorrectChatlogResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    course_id = serializers.CharField(required=False)
    user_id = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    utorid = serializers.CharField(required=False)
    time = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    msg = serializers.CharField(required=False)

# Course Comfortability Request and Response
# ======================================================
class CourseComfortabilityRequest(serializers.Serializer):
    conversation_id = serializers.CharField()
    comfortability_rating = serializers.CharField()

class CourseComfortabilityResponse(serializers.Serializer):
    conversation_id = serializers.CharField(required=False)
    comfortability_rating = serializers.CharField(required=False)

# Error Resposne (Status Codes 400, 401, 404, 500)
# ======================================================
class ErrorResponse(serializers.Serializer):
    msg = serializers.CharField(label="Error Message", required=False)
