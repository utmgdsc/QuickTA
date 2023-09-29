from rest_framework.serializers import *
from rest_framework import serializers
from survey.models import *
from users.models import User
from student.models import Conversation
from datetime import datetime

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
    conversation_id = serializers.CharField(required=False)
    survey_id = serializers.CharField()
    question_id = serializers.CharField()
    question_type = serializers.ChoiceField(choices=[(tag.name, tag.value) for tag in QuestionType])
    answer = serializers.IntegerField(required=False)
    open_ended_answer = serializers.CharField(required=False)
    survey_type = serializers.ChoiceField(choices=[('Pre', 'Pre'), ('Post', 'Post')])

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        utorid = validated_data.get('utorid')
        conversation_id = validated_data.get('conversation_id')
        survey_id = validated_data.get('survey_id')
        question_id = validated_data.get('question_id')
        question_type = validated_data.get('question_type')
        survey_id = validated_data.get('survey_id')
        survey_type = validated_data.get('survey_type')
        answer = validated_data.get('answer')
        open_ended_answer = validated_data.get('open_ended_answer')

        try:
            if user_id: user = User.objects.get(user_id=user_id)
            elif utorid: user = User.objects.get(utorid=utorid)
        except:
            raise serializers.ValidationError(f"User with ID {user_id} does not exist")

        # Depending on the survey_type, update either pre_survey or post_survey
        if survey_type == 'Pre':
            if not user.pre_survey: user.pre_survey = []
            user.pre_survey.append({'survey_id': survey_id, 'question_id': question_id, 'answer': answer, 'date': datetime.now()})
            User.objects.filter(user_id=user.user_id).update(pre_survey=user.pre_survey, new_user=False)

        elif survey_type == 'Post':
            if not user.post_survey: user.post_survey = []
            try: 
                Conversation.objects.get(conversation_id=conversation_id)
            except:
                raise serializers.ValidationError(f"Conversation with ID [{conversation_id}] does not exist")
            
            if question_type == 'OPEN_ENDED':
                answer = open_ended_answer

            SurveyResponse(
                survey_id=survey_id,
                type=survey_type,
                question_id=question_id,
                user_id=user.user_id,
                conversation_id=conversation_id,
                answer=answer
            ).save()
            User.objects.filter(user_id=user.user_id).update(new_user=False)
        else:
            raise serializers.ValidationError("Invalid survey_type. Must be 'pre' or 'post'")
        
        # You can return any response data here if needed
        return validated_data