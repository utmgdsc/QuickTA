from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.core.cache import cache
from django.shortcuts import get_object_or_404

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from survey.models import *
from survey.serializers import *

from utils.handlers import ErrorResponse

# Create your views here.
class SurveyQuestionView(APIView):

    @swagger_auto_schema(
        operation_summary="Get survery question details",
        responses={200: SurveyQuestionSerializer(), 404: "User not found"},
            manual_parameters=[
            openapi.Parameter("question_id", openapi.IN_QUERY, description="Question ID", type=openapi.TYPE_STRING),    
        ],
    )
    def get(self, request):
        """
        Acquires survey question details by question_id.
        """
        question_id = request.query_params.get('question_id', '')
        question = get_object_or_404(SurveyQuestion, question_id=question_id)
        serializer = SurveyQuestionSerializer(question)
        return JsonResponse(serializer.data)
        
    
    @swagger_auto_schema(
        operation_summary="Create a survey question",
        request_body=SurveyQuestionSerializer,
        responses={201: SurveyQuestionSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new survey question.

        - type: Pre (Pre-survey) or Post (Post-survey)
        - question: The question text
        - question_type: Scale (SCALE) or MultipleChoice (MULTIPLE_CHOICE)
        - answers: List of answers for MultipleChoice questions
        - numeric_answer: Answer for Scale questions
        """
        serializer = SurveyQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(question_id=str(uuid.uuid4()))
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update a survey question",
        manual_parameters=[
            openapi.Parameter("question_id", openapi.IN_QUERY, description="Question ID", type=openapi.TYPE_STRING),
        ],
        request_body=SurveyQuestionSerializer,
        responses={200: SurveyQuestionSerializer(), 400: "Bad Request"}
    )
    def patch(self, request):
        question_id = request.query_params.get('question_id', '')
        question = get_object_or_404(SurveyQuestion, question_id=question_id)
        serializer = SurveyQuestionSerializer(question, data=request.data, partial=True)

        if serializer.is_valid():
            SurveyQuestion.objects.filter(question_id=question_id).update(**serializer.validated_data)
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    @swagger_auto_schema(
        operation_summary="Delete a question",
        manual_parameters=[
            openapi.Parameter("question_id", openapi.IN_QUERY, description="Question ID", type=openapi.TYPE_STRING)
        ],
        responses={200: "Survey question deleted", 404: "Survey question not found"}
    )
    def delete(self, request):
        """
        Deletes a question 
        """
        question_id = request.query_params.get('question_id', '')

        # Check if question is in any survey
        surveys = Survey.objects.all()
        for survey in surveys:
            if question_id in survey.ordering:
                return ErrorResponse("Question is in a survey", status=status.HTTP_400_BAD_REQUEST)

        SurveyQuestion.objects.filter(question_id=question_id).delete()
        return JsonResponse(status=status.HTTP_200_OK)

class SurveyQuestionListView(APIView):

    @swagger_auto_schema(
        operation_summary="Get all survey questions",
        responses={200: SurveyQuestionSerializer(many=True), 404: "Survey question not found"},
    )
    def get(self, request):
        """
        Acquires all survey questions
        """
        questions = SurveyQuestion.objects.all()
        serializer = SurveyQuestionSerializer(questions, many=True)
        return JsonResponse(serializer.data, safe=False)

class SurveyView(APIView):

    @swagger_auto_schema(
        operation_summary="Get all survey questions",
        manual_parameters=[
            openapi.Parameter("survey_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING)
        ],
        responses={200: SurveySerializer(many=True), 404: "User not found"},
    )
    def get(self, request):
        """
        Acquires the details of a survey.
        """
        questions = get_object_or_404(Survey, survey_id=request.query_params.get('survey_id', ''))
        serializer = SurveySerializer(questions)
        return JsonResponse(serializer.data, safe=False)

    @swagger_auto_schema(
        operation_summary="Create a new survey",
        request_body=SurveySerializer,
        responses={201: SurveySerializer(), 400: "Bad Request"}
    )
    def post(self, reqeust):
        """
        Creates a new survey.
        """
        serializer = SurveySerializer(data=reqeust.data)
        if serializer.is_valid():
            serializer.save(survey_id=str(uuid.uuid4()))
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update a survey",
        manual_parameters=[
            openapi.Parameter("survey_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING),
        ],
        request_body=SurveySerializer,
        responses={200: SurveySerializer(), 400: "Bad Request"}
    )
    def patch(self, request):
        survey_id = request.query_params.get('survey_id', '')
        survey = get_object_or_404(Survey, survey_id=survey_id)
        serializer = SurveySerializer(survey, data=request.data, partial=True)

        if serializer.is_valid():
            Survey.objects.filter(survey_id=survey_id).update(**serializer.validated_data)
            return JsonResponse(status=status.HTTP_200_OK)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete a survey",
        manual_parameters=[
            openapi.Parameter("survey_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING)
        ],
        responses={200: "Survey deleted", 404: "Survey not found"}
    )
    def delete(self, request):
        """
        Deletes a survey
        """
        survey_id = request.query_params.get('survey_id', '')
        Survey.objects.filter(survey_id=survey_id).delete()
        return JsonResponse(status=status.HTTP_200_OK)
    
class SurveryListView(APIView):

    @swagger_auto_schema(
        operation_summary="Get all surveys",
        responses={200: SurveySerializer(many=True), 404: "User not found"},
    )
    def get(self, request):
        """
        Acquires the details of a certain user by either user_id or utorid, or both.
        """
        surveys = Survey.objects.all()
        serializer = SurveySerializer(surveys, many=True)
        return JsonResponse(serializer.data, safe=False)

class SurveyAllQuestionsView(APIView):
    @swagger_auto_schema(
        operation_summary="Get all survey questions",
        manual_parameters=[
            openapi.Parameter("survey_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING)
        ],
        responses={200: SurveyQuestionSerializer(many=True), 404: "User not found"},
    )
    def get(self, request):
        """
        Acquires all questions of a survey, in order.
        """
        survey_id = request.query_params.get('survey_id', '')
        
        cache_key = f"survey-{survey_id}"
        response = cache.get(cache_key)
        if response is None:
            survey = get_object_or_404(Survey, survey_id=survey_id)
            questions = SurveyQuestion.objects.filter(question_id__in=survey.ordering)
            serializer = SurveyQuestionSerializer(questions, many=True)
            response = {
                "survey_id": survey_id,
                "type": survey.type,
                "questions": serializer.data
            }
            cache.set(cache_key, response, 60*60*24)
        return JsonResponse(response)

class ActiveSurveyView(APIView):
    @swagger_auto_schema(
        operation_summary="Get active survey",
        responses={200: SurveySerializer(), 404: "User not found"},
    )
    def get(self, request):
        """
        Acquires the active survey
        """
        survey = get_object_or_404(Survey, active="True")
        return JsonResponse(survey.to_dict())

class ActivateSurveyView(APIView):
    @swagger_auto_schema(
        operation_summary="Activate a survey",
        manual_parameters=[
            openapi.Parameter("survey_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING)
        ],
        responses={200: "Survey activated", 404: "Survey not found"}
    )
    def post(self, request):
        """
        Activates a survey
        """
        survey_id = request.query_params.get('survey_id', '')
        Survey.objects.filter(active="True").update(active="False")
        Survey.objects.filter(survey_id=survey_id).update(active="True")
        return JsonResponse(data={}, status=status.HTTP_200_OK)

class AnswerQuestionView(APIView):

    @swagger_auto_schema(
        operation_summary="Answer a survey question",
        request_body=AnswerQuestionSerializer(many=True),
        responses={200: "Answered question", 400: "Bad Request"}
    )
    def post(self, request):
        """
        Answer a survey question

        - user_id/utorid - user id or utorid
        - survey_id - survey id
        - question_id - question id 
        - conversation_id - conversation id (only applicable to 'Post' questions)
        - answer - answer to the question
        - survey_type - Pre/Post (Pre-survey/Post-survey)
        """
        serializer = AnswerQuestionSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.create(validated_data=serializer.validated_data)
            return JsonResponse(data={"msg": "Answered question"},status=status.HTTP_200_OK)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)