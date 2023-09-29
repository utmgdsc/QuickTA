from django.shortcuts import render

import uuid
import random
from enum import Enum
from django.db import models
import djongo.models as djmodels

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from assessments.models import *
from assessments.serializers import *
from utils.handlers import ErrorResponse

# Create your views here.
class AssessmentQuestionView(APIView):

    @swagger_auto_schema(
        operation_summary="Get assessment question details",
        responses={200: AssessmentQuestionSerializer(), 404: "Assessment Question not found"},
        manual_parameters=[
            openapi.Parameter("assessment_question_id", openapi.IN_QUERY, description="Assessment Question ID", type=openapi.TYPE_STRING)
        ],
    )
    def get(self, request):
        """
        Acquires assessment question details by assessment_question_id.
        """
        asmnt_question_id = request.query_params.get('assessment_question_id', '')
        asmnt_question = get_object_or_404(AssessmentQuestion, assessment_question_id=asmnt_question_id)
        serializer = AssessmentQuestionSerializer(asmnt_question)
        return JsonResponse(serializer.data)
        
    
    @swagger_auto_schema(
        operation_summary="Create an assessment question",
        request_body=AssessmentQuestionSerializer,
        responses={201: AssessmentQuestionSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new assessment question.

        - type: Tech (Technical Question)
        - question: The question text
        - choices: List of choices for assessment questions
            - format:
                - choice: The choice text
                - flavor_text: The flavor text for the choice
        - correct_answer: The correct answer for the question (ie. Choice [A/B/C/D/E])
        - correct_answer_flavor_text: The flavor text for the correct answer
        """
        serializer = AssessmentQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update an assessment question",
        manual_parameters=[
            openapi.Parameter("assessment_question_id", openapi.IN_QUERY, description="Assessment Question ID", type=openapi.TYPE_STRING),
        ],
        request_body=AssessmentQuestionSerializer,
        responses={200: AssessmentQuestionSerializer(), 400: "Bad Request"}
    )
    def patch(self, request):
        asmnt_question_id = request.query_params.get('assessment_question_id', '')
        question = get_object_or_404(AssessmentQuestion, assessment_question_id=asmnt_question_id)
        serializer = AssessmentQuestionSerializer(question, data=request.data, partial=True)

        if serializer.is_valid():
            AssessmentQuestion.objects.filter(assessment_question_id=asmnt_question_id).update(**serializer.validated_data)
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    @swagger_auto_schema(
        operation_summary="Delete a question",
        manual_parameters=[
            openapi.Parameter("assessment_question_id", openapi.IN_QUERY, description="Assessment Question ID", type=openapi.TYPE_STRING)
        ],
        responses={200: "Survey question deleted", 404: "Survey question not found"}
    )
    def delete(self, request):
        """
        Deletes a question 
        """
        asmnt_question_id = request.query_params.get('assessment_question_id', '')

        # Check if question is in any survey
        assessments = Assessment.objects.all()
        for assessment in assessments:
            if asmnt_question_id in assessment.question_bank:
                return ErrorResponse("Question is in an assessment", status=status.HTTP_400_BAD_REQUEST)

        AssessmentQuestion.objects.filter(assessment_question_id=asmnt_question_id).delete()
        return JsonResponse(status=status.HTTP_200_OK)

class AssessmentQuestionListView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get all assessment questions",
        responses={200: AssessmentQuestionSerializer(many=True)}
    )
    def get(self, request):
        """
        Acquires all survey questions
        """
        questions = AssessmentQuestion.objects.all()
        serializer = AssessmentQuestionSerializer(questions, many=True)
        return JsonResponse(serializer.data, safe=False)
    
class AssessmentView(APIView):

    @swagger_auto_schema(
        operation_summary="Get an assessment",
        manual_parameters=[
            openapi.Parameter("assessment_id", openapi.IN_QUERY, description="Assessment ID", type=openapi.TYPE_STRING)
        ],
        responses={200: AssessmentSerializer(many=True), 400: "Bad Request", 404: "Assessment not found"},
    )
    def get(self, request):
        """
        Acquires the details of a survey.
        """
        assessment = get_object_or_404(Assessment, assessment_id=request.query_params.get('assessment_id', ''))
        serializer = AssessmentSerializer(assessment)
        if serializer.is_valid():
            asmnt_questions = AssessmentQuestion.objects.filter(assessment_question_id__in=assessment.question_bank)
            serializer.data['question_bank'] = [question.to_dict(show_answer=True) for question in asmnt_questions]
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Create a new assessment",
        request_body=AssessmentSerializer,
        responses={201: AssessmentSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new survey.
        """
        serializer = AssessmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update an assessment",
        manual_parameters=[
            openapi.Parameter("assessment_id", openapi.IN_QUERY, description="Assessment ID", type=openapi.TYPE_STRING),
        ],
        request_body=AssessmentSerializer,
        responses={200: AssessmentSerializer(), 400: "Bad Request"}
    )
    def patch(self, request):
        assessment_id = request.query_params.get('assessment_id', '')
        assessment = get_object_or_404(Assessment, assessment_id=assessment_id)
        serializer = AssessmentSerializer(assessment, data=request.data, partial=True)

        if serializer.is_valid():
            Assessment.objects.filter(assessment_id=assessment_id).update(**serializer.validated_data)
            return JsonResponse(status=status.HTTP_200_OK)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete an assessment",
        manual_parameters=[
            openapi.Parameter("assessment_id", openapi.IN_QUERY, description="Survey ID", type=openapi.TYPE_STRING)
        ],
        responses={200: "adeleted", 404: "Survey not found"}
    )
    def delete(self, request):
        """
        Deletes a survey
        """
        assessment_id = request.query_params.get('assessment_id', '')
        Assessment.objects.filter(assessment_id=assessment_id).delete()
        return JsonResponse(status=status.HTTP_200_OK)
    
class AssessmentListView(APIView):

    @swagger_auto_schema(
        operation_summary="Get all assessment",
        responses={200: AssessmentSerializer(many=True), 404: "Assessment not found"},
    )
    def get(self, request):
        """
        Acquires all assessments
        """
        surveys = Survey.objects.all()
        serializer = AssessmentSerializer(surveys, many=True)
        return JsonResponse(serializer.data, safe=False)

class AnswerAsessmentQuestionView(APIView):
    @swagger_auto_schema(
        operation_summary="Answer an assessment question",
        request_body=AnswerAssessmentQuestionSerializer,
        responses={200: "Answered assessment question", 400: "Bad Request"}
    )
    def post(self, request):
        """
        Answer an assessment question
        """
        serializer = AnswerAssessmentQuestionSerializer(data=request.data)
        if serializer.is_valid():
            asmnt_question = serializer.create(validated_data=serializer.validated_data)
            
            # Send back the correct response
            response = {
                "assessment_question_id": asmnt_question.assessment_question_id,
                "correct_answer": asmnt_question.correct_answer,
                "correct_answer_flavor_text": asmnt_question.correct_answer_flavor_text,
                "correct": request.data['answer'] == asmnt_question.correct_answer
            }

            return JsonResponse(response, status=status.HTTP_200_OK)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RandomAssessmentQuestionView(APIView):
    @swagger_auto_schema(
        operation_summary="Get a random assessment question",
        manual_parameters=[
            openapi.Parameter("assessment_id", openapi.IN_QUERY, description="Assessment ID", type=openapi.TYPE_STRING),
        ],
        responses={200: AssessmentQuestionSerializer(), 404: "Assessment Question not found"},
    )
    def get(self, request):
        """
        Acquires a random assessment question from the assessment question bank.
        """
        assessment_id = request.query_params.get('assessment_id', '')
        assessment = get_object_or_404(Assessment, assessment_id=assessment_id)
        question_bank = assessment.question_bank
        if len(question_bank) == 0:
            return ErrorResponse("Assessment question bank is empty", status=status.HTTP_400_BAD_REQUEST)
        question_id = random.choice(question_bank)
        question = get_object_or_404(AssessmentQuestion, assessment_question_id=question_id)
        serializer = AssessmentQuestionSerializer(question).data
        
        response = {
            "assessment_question_id": serializer["assessment_question_id"],
            "type": serializer["type"],
            "language": serializer["language"],
            "question": serializer["question"],
            "choices": serializer["choices"]   
        }

        return JsonResponse(response)