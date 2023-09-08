import time
import csv
from io import BytesIO
from datetime import datetime, date
from ..constants import * 

from ..functions import user_functions, course_functions, report_functions, conversation_functions,  time_utils, gptmodel_functions
from ..functions.common_topics import generate_wordcloud, get_wordcloud_image

from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
from django.utils.timezone import now

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import *
from ..serializers.serializers import *
from ..serializers.researcher_serializers import *
from ..serializers import researcher_serializers as rs
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q


# GPT Model Related Endpoints
# ====================================================================================
@swagger_auto_schema(methods=['post'], request_body=GetOneGPTModelRequest,
    responses={
        200: openapi.Response('Success', GetOneGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_get_one(request):
    """
    Acquires one GPT Model when given the course_id and model_id
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.get_one_gptmodel(data['model_id'], data['course_id'])
            return Response(res, status=status.HTTP_200_OK)
        except:
            error = []
            keys = request.data.keys()
            if 'model_id' not in keys: error.append("Model ID")
            if 'course_id' not in keys: error.append("Course ID")

            if (not(error)):
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT get one model missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CreateGPTModelRequest,
    responses={
        200: openapi.Response('Success', CreateGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_create(request):
    """
    Creates a GPT Model given the parameter specifications.
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.create_gptmodel(data)
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_name' not in keys: error.append("Model Name")
            if 'course_id' not in keys: error.append("Course ID")
            if 'model' not in keys: error.append("Model")
            if 'prompt' not in keys: error.append("Prompt")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model creation missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=UpdateGPTModelRequest,
    responses={
        200: openapi.Response('Success', UpdateGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_update(request):
    """
    Updates a particular GPT model
    """
    if request.method == 'POST':
        try:
            data = request.data
            res = gptmodel_functions.update_gptmodel(data)
            
            if OPERATION_FAILED:
                raise Exception
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_name' not in keys: error.append("Model Name")
            if 'course_id' not in keys: error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model update missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)                

@swagger_auto_schema(methods=['post'], request_body=SwitchGPTModelRequest,
    responses={
        200: openapi.Response('Success', SwitchGPTModelResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_select(request):
    """
    Activates a selected GPTModel
    """
    if request.method == 'POST':
        try:
            data = request.data
            ret = gptmodel_functions.switch_gptmodel(data['course_id'], data['model_id'])
            
            if OPERATION_FAILED:
                raise Exception
            res = { "success": ret } 
            return Response(res, status=status.HTTP_200_OK)
        
        except:
            error = []
            keys = request.data.keys()
            if 'model_id' not in keys: error.append("Model ID")
            if 'course_id' not in keys: error.append("Course ID")
            
            if (not(error)): 
                err = {"msg": "Internal Server Error"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                err = {"msg": "GPT Model creation missing fields: " + ','.join(error) + '.'}
                return Response(err, status=status.HTTP_400_BAD_REQUEST)                

@swagger_auto_schema(methods=['post'], request_body=GetCourseGPTModelRequest,
    responses={
        200: openapi.Response('Success', GetCourseGPTModelResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_get(request):
    """
    Returns all GPT models related to a course.
    """
    if request.method == 'POST':
        try:
            data = request.data
            gpt_models = gptmodel_functions.get_gptmodels(data['course_id'])
            
            return JsonResponse({"gpt_models": gpt_models})
        except:
            return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(methods=['get'],
    responses={
        200: openapi.Response('Success', GetAllCourseGPTModelResponse),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['GET'])
def gptmodel_get_all(request):
    """
    Retrieves all GPT models from all courses.
    """
    if request.method == 'GET':
        try:
            gpt_models = GPTModel.objects.all().values()
            return JsonResponse({ "gpt_models": list(gpt_models)})
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@swagger_auto_schema(methods=['post'], request_body=DeleteGPTModelRequest,
    responses={
        200: openapi.Response('Success'),
        500: openapi.Response('Internal Server Error', ErrorResponse)
    })
@api_view(['POST'])
def gptmodel_delete(request):
    """
    Deletes a GPT model configuration.
    """
    if request.method == 'POST':
        try:
            data = request.data
            ret = gptmodel_functions.delete_gptmodels(data['model_id'])
            if not(ret):
                raise Exception
            return Response(status=status.HTTP_200_OK)
        except:
            return Response("Internal server error.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Helper functions
def get_courses_convos(course_id):
    return Conversation.objects.filter(course_id=course_id)

def get_convo_chatlogs(cid):
    return Chatlog.objects.filter(conversation_id=cid)

# Exceptions
class CourseNotFoundError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass