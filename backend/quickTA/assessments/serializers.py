from rest_framework.serializers import *
from rest_framework import serializers
from assessments.models import *
from survey.models import *
from users.models import User

class AssessmentQuestionSerializer(ModelSerializer):
    
    choices = serializers.ListField(child=serializers.JSONField(), required=False)

    class Meta:
        model = SurveyQuestion
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