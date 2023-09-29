from rest_framework.serializers import *
from rest_framework import serializers
from assessments.models import *
from survey.models import *
from users.models import User
from student.models import Conversation
from datetime import datetime

class AssessmentQuestionSerializer(ModelSerializer):
    
    choices = serializers.ListField(child=serializers.JSONField(), required=False)

    class Meta:
        model = AssessmentQuestion
        fields = [
            "assessment_question_id",
            "type",
            "language",
            "question",
            "choices",
            "correct_answer",
            "correct_answer_flavor_text",
        ]

class AssessmentSerializer(ModelSerializer):

    question_bank = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Assessment
        fields = [
            "assessment_id",
            "assessment_name",
            "status",
            "question_bank"
        ]

class AnswerAssessmentQuestionSerializer(serializers.Serializer):
    utorid = serializers.CharField(required=False)
    user_id = serializers.CharField(required=False)
    conversation_id = serializers.CharField()
    assessment_id = serializers.CharField()
    assessment_question_id = serializers.CharField()
    answer = serializers.CharField()

    def create(self, validated_data):
        utorid = validated_data.get('utorid')
        user_id = validated_data.get('user_id')
        conversation_id = validated_data.get('conversation_id')
        assessment_id = validated_data.get('assessment_id')
        assessment_question_id = validated_data.get('assessment_question_id')
        answer = validated_data.get('answer')

        try:
            if user_id: user = User.objects.get(user_id=user_id)
            elif utorid: user = User.objects.get(utorid=utorid)
            else: raise serializers.ValidationError(f"User does not exist")
        except:
            raise serializers.ValidationError(f"User does not exist")
        
        try:
            Conversation.objects.get(conversation_id=conversation_id)
        except:
            raise serializers.ValidationError(f"Conversation does not exist")
        
        # try:
        asmnt_question = AssessmentQuestion.objects.get(assessment_question_id=assessment_question_id)
        asmnt = Assessment.objects.get(assessment_id=assessment_id)
        # except:
        #     raise serializers.ValidationError(f"Assessment question does not exist")

        AssessmentResponse(
            assessment_id=asmnt.assessment_id,
            assessment_question_id=assessment_question_id,
            user_id=user.user_id,
            conversation_id=conversation_id,
            answer=answer,
            correct=(answer == asmnt_question.correct_answer)
        ).save()
        return asmnt_question