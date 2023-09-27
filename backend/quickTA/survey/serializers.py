from rest_framework.serializers import *
from rest_framework import serializers
from survey.models import *
from users.models import User

class SurveyQuestionSerializer(ModelSerializer):
    
    answers = serializers.ListField(child=serializers.JSONField(), required=False)

    class Meta:
        model = SurveyQuestion
        fields = [
            "question_id",
            "type",
            "question",
            "question_type",
            "answers",
            "numeric_answer",
        ]

class SurveySerializer(ModelSerializer):

    ordering = serializers.ListField(child=serializers.CharField(), required=False)
   
    class Meta:
        model = Survey
        fields = [
            "survey_id",
            "survey_name",
            "type",
            "ordering"
        ]

class AnswerQuestionSerializer(serializers.Serializer):
    utorid = serializers.CharField(required=False)
    user_id = serializers.CharField(required=False)
    question_id = serializers.CharField()
    answer = serializers.CharField()
    survey_type = serializers.ChoiceField(choices=[('Pre', 'Pre'), ('Post', 'Post')])

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        utorid = validated_data.get('utorid')
        question_id = validated_data.get('question_id')
        answer = validated_data.get('answer')
        survey_type = validated_data.get('survey_type')


        try:
            if user_id: user = User.objects.get(user_id=user_id)
            elif utorid: user = User.objects.get(utorid=utorid)
        except:
            raise serializers.ValidationError(f"User with ID {user_id} does not exist")

        # Depending on the survey_type, update either pre_survey or post_survey
        if survey_type == 'Pre':
            if not user.pre_survey: user.pre_survey = []
            user.pre_survey.append({'question_id': question_id, 'answer': answer})
            User.objects.filter(user_id=user.user_id).update(pre_survey=user.pre_survey, new_user=False)
        elif survey_type == 'Post':
            if not user.post_survey: user.post_survey = []
            user.post_survey.append({'question_id': question_id, 'answer': answer})
            User.objects.filter(user_id=user.user_id).update(post_survey=user.post_survey, new_user=False)
        else:
            raise serializers.ValidationError("Invalid survey_type. Must be 'pre' or 'post'")
        
        # You can return any response data here if needed
        return validated_data