from rest_framework import serializers
from ..models import Chatlog, Course, GPTModel, Report
from drf_yasg import openapi

# Get <Weekly/Monthly Statistics> Response
# ======================================================
class GetFilteredStatsRequest(serializers.Serializer):
    course_id = serializers.CharField()
    filter = serializers.CharField()
    timezone = serializers.CharField()

# Research Filter View Serializer
# ======================================================
class ChatlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatlog
        # fields = ['id', 'conversation_id', 'chatlog_id', 'time', 'is_user', 'chatlog', 'delta']
        fields = '__all__'


# Get Average Ratings Response
# ======================================================
class AverageRatingsResponse(serializers.Serializer):
    class Ratings(serializers.Serializer):
        conversation_id = serializers.CharField(max_length=100)
        rating = serializers.FloatField()
        feedback_msg = serializers.CharField(max_length=1000)

    avg_ratings = serializers.CharField(required=False)
    all_ratings = Ratings(many=True)

# Resolve Reported Conversation Request & Response
# ======================================================
class ResolveReportedConvoRequest(serializers.Serializer):
    conversation_id = serializers.CharField()

# Get Reported Conversation List Request & Response
# ======================================================
class GetReportedConvoListResponse(serializers.Serializer):    
    class ReportedConvo(serializers.Serializer):
        conversation_id = serializers.CharField(required=False)
        course_id = serializers.CharField(required=False)
        user_id = serializers.CharField(required=False)
        name = serializers.CharField(required=False)
        utorid = serializers.CharField(required=False)
        time = serializers.CharField(required=False)
        status = serializers.CharField(required=False)
        msg = serializers.CharField(required=False)

    total_reported = serializers.IntegerField(required=False)
    reported_conversations = ReportedConvo(many=True)

# Get Reported Conversation's Chatlog Request & Response
# ======================================================
class GetReportedConvoChatlogsRequest(serializers.Serializer):
    conversation_id = serializers.CharField()
class GetReportedConvoChatlogsResponse(serializers.Serializer):
    class ReportedConvoChatlogs(serializers.Serializer):
        chatlog_id = serializers.CharField(required=False)
        speaker = serializers.CharField(required=False)
        chatlog = serializers.CharField(required=False)
        time = serializers.CharField(required=False)
        delta = serializers.FloatField(required=False)

    total_reported_count = serializers.IntegerField()
    conversations = ReportedConvoChatlogs(many=True)

# Get Average Response Rate Response
# ======================================================
class GetAverageResponseRateResponse(serializers.Serializer):  
    class Deltas(serializers.Serializer):
        delta = serializers.FloatField(required=False)

    avg_response_rate = serializers.CharField(required=False)
    delta = Deltas(many=True)

# Get Most Common Topics Response
# ======================================================
class GetMostCommonTopicsResponse(serializers.Serializer):
    class CommonWords(serializers.Serializer):
        word = serializers.CharField(required=False)
        frequency = serializers.FloatField(required=False)
    
    class Sentences(serializers.Serializer):
        chatlog = serializers.CharField(required=False)

    avg_chatlog_count = serializers.FloatField(required=False)
    total_chatlog_count = serializers.IntegerField(required=False)
    avg_chatlog_length = serializers.FloatField(required=False)
    sentences = Sentences(many=True)
    most_common_words = CommonWords(many=True)

# Get Course Comfortability Response
# ======================================================
class GetCourseComfortabilityResponse(serializers.Serializer):
    class ComfortabilityRating(serializers.Serializer):
        comfortability_ratings = serializers.IntegerField(required=False)
    
    total_conversation = serializers.IntegerField(required=False)
    comfortability_ratings = ComfortabilityRating(many=True)
    avg_comfortability_rating = serializers.FloatField(required=False)

# Get Interaction Frequency Response
# ======================================================
class GetInteractionFrequencyResponse(serializers.Serializer):
    interactions = serializers.IntegerField(required=False)

# Get Course's User List Request & Response
# ======================================================
class GetCourseUserListRequest(serializers.Serializer):
    course_id = serializers.CharField()

class GetCourseUserListResponse(serializers.Serializer):
    class Users(serializers.Serializer):
        user_id = serializers.CharField(required=False)
    
    total_students = serializers.CharField(required=False)
    users = Users(many=True)

# Get One GPT Model Request & Response
# ======================================================
class GetOneGPTModelRequest(serializers.Serializer):
    course_id = serializers.CharField()
    model_id = serializers.CharField()

class GetOneGPTModelResponse(serializers.Serializer):
    model_id = serializers.CharField(max_length=100, required=False)
    model_name = serializers.CharField(max_length=100, required=False)
    course_id = serializers.CharField(max_length=100, required=False)
    status = serializers.BooleanField(required=False)

    model = serializers.CharField(max_length=40, required=False)
    prompt = serializers.CharField(max_length=2000, required=False)
    suffix = serializers.CharField(max_length=100, required=False)
    max_tokens = serializers.IntegerField(required=False)
    temperature = serializers.FloatField(required=False)
    top_p = serializers.FloatField(required=False)
    n = serializers.IntegerField(required=False)
    stream = serializers.BooleanField(required=False)
    logprobs = serializers.IntegerField(required=False)
    presence_penalty = serializers.FloatField(required=False)
    frequency_penalty = serializers.FloatField(required=False)
    best_of = serializers.IntegerField(required=False)

# Create GPT Model Request & Response
# ======================================================
class CreateGPTModelRequest(serializers.Serializer):
    model_name = serializers.CharField(max_length=100)
    course_id = serializers.CharField(max_length=100)
    model = serializers.CharField(max_length=40)
    prompt = serializers.CharField(max_length=2000)

    # Optional Fields
    suffix = serializers.CharField(max_length=100, required=False)
    max_tokens = serializers.IntegerField(required=False)
    temperature = serializers.FloatField(required=False)
    top_p = serializers.FloatField(required=False)
    n = serializers.IntegerField(required=False)
    stream = serializers.BooleanField(required=False)
    logprobs = serializers.IntegerField(required=False)
    
    presence_penalty = serializers.FloatField(required=False)
    frequency_penalty = serializers.FloatField(required=False)
    best_of = serializers.IntegerField(required=False)

class CreateGPTModelResponse(serializers.Serializer):
    model_id = serializers.CharField(max_length=100, required=False)
    model_name = serializers.CharField(max_length=100, required=False)
    course_id = serializers.CharField(max_length=100, required=False)
    status = serializers.BooleanField(required=False)

    model = serializers.CharField(max_length=40, required=False)
    prompt = serializers.CharField(max_length=2000, required=False)
    suffix = serializers.CharField(max_length=100, required=False)
    max_tokens = serializers.IntegerField(required=False)
    temperature = serializers.FloatField(required=False)
    top_p = serializers.FloatField(required=False)
    n = serializers.IntegerField(required=False)
    stream = serializers.BooleanField(required=False)
    logprobs = serializers.IntegerField(required=False)
    presence_penalty = serializers.FloatField(required=False)
    frequency_penalty = serializers.FloatField(required=False)
    best_of = serializers.IntegerField(required=False)

# Update GPT Model Request & Response
# ======================================================
class UpdateGPTModelRequest(serializers.Serializer):
    model_id = serializers.CharField(max_length=100)
    course_id = serializers.CharField(max_length=100)
    
    # Optional Fields
    model_name = serializers.CharField(max_length=100, required=False)
    model = serializers.CharField(max_length=40, required=False)
    prompt = serializers.CharField(max_length=2000, required=False)
    suffix = serializers.CharField(max_length=100, required=False)
    max_tokens = serializers.IntegerField(required=False)
    temperature = serializers.FloatField(required=False)
    top_p = serializers.FloatField(required=False)
    n = serializers.IntegerField(required=False)
    stream = serializers.BooleanField(required=False)
    logprobs = serializers.IntegerField(required=False)
    presence_penalty = serializers.FloatField(required=False)
    frequency_penalty = serializers.FloatField(required=False)
    best_of = serializers.IntegerField(required=False)

class UpdateGPTModelResponse(serializers.Serializer):
    model_id = serializers.CharField(max_length=100, required=False)
    model_name = serializers.CharField(max_length=100, required=False)
    course_id = serializers.CharField(max_length=100, required=False)
    status = serializers.BooleanField(required=False)

    model = serializers.CharField(max_length=40, required=False)
    prompt = serializers.CharField(max_length=2000, required=False)
    suffix = serializers.CharField(max_length=100, required=False)
    max_tokens = serializers.IntegerField(required=False)
    temperature = serializers.FloatField(required=False)
    top_p = serializers.FloatField(required=False)
    n = serializers.IntegerField(required=False)
    stream = serializers.BooleanField(required=False)
    logprobs = serializers.IntegerField(required=False)
    
    presence_penalty = serializers.FloatField(required=False)
    frequency_penalty = serializers.FloatField(required=False)
    best_of = serializers.IntegerField(required=False)

# Switch GPT Model Request & Response
# ======================================================
class SwitchGPTModelRequest(serializers.Serializer):
    model_id = serializers.CharField(max_length=100)
    course_id = serializers.CharField(max_length=100)

class SwitchGPTModelResponse(serializers.Serializer):
    success = serializers.BooleanField(required=False)

# Get Course's GPT Model Request & Response
# ======================================================
class GetCourseGPTModelRequest(serializers.Serializer):
    course_id = serializers.CharField(max_length=100)

class GetCourseGPTModelResponse(serializers.Serializer):
    gpt_models = GetOneGPTModelResponse(many=True)

# Get All Courses' GPT Model Response
# ======================================================
class GetAllCourseGPTModelResponse(serializers.Serializer):
    gpt_models = GetOneGPTModelResponse(many=True)

# Get All Courses' GPT Model Response
# ======================================================
class DeleteGPTModelRequest(serializers.Serializer):
    model_id = serializers.CharField(max_length=100)

