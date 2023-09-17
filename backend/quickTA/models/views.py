import uuid
from django.shortcuts import render
from models.models import GPTModel
from rest_framework import status
# from models.serializers import GPTModelSerializer
import researchers.functions as gptmodel_functions
from django.http import JsonResponse
from utils.handlers import ErrorResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from models.serializers import GPTModelSerializer
from django.shortcuts import get_object_or_404


# Create your views here.

class GPTModelView(APIView):

    @swagger_auto_schema(
        operation_description="Returns a GPT model given the model_id and course_id.",
        responses={ 200: GPTModelSerializer(), 400: "Bad Request", 404: "Model not found"},
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Returns a GPT model given the model_id and course_id.
        """
        model_id = request.query_params.get('model_id', '')
        gpt_model = get_object_or_404(GPTModel, model_id=model_id)
        serializer = GPTModelSerializer(gpt_model)
        return JsonResponse(serializer.data)

    @swagger_auto_schema(
        operation_description="Creates a GPT Model given the parameter specifications.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'model_name': openapi.Schema(type=openapi.TYPE_STRING),
                'course_id': openapi.Schema(type=openapi.TYPE_STRING),
                'status': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'prompt': openapi.Schema(type=openapi.TYPE_STRING),
                'max_tokens': openapi.Schema(type=openapi.TYPE_INTEGER),
                'temperature': openapi.Schema(type=openapi.TYPE_NUMBER),
                'top_p': openapi.Schema(type=openapi.TYPE_NUMBER),
                'n': openapi.Schema(type=openapi.TYPE_INTEGER),
                'stream': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'presence_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'frequency_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
            }
        ),
        responses={ 200: GPTModelSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a GPT Model given the parameter specifications.
        """
        data = request.data
        serializer = self.create_gptmodel(data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors)
    
    @swagger_auto_schema(
        operation_description="Updates a GPT Model given the parameter specifications.",
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'model_name': openapi.Schema(type=openapi.TYPE_STRING),
                'course_id': openapi.Schema(type=openapi.TYPE_STRING),
                'status': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'prompt': openapi.Schema(type=openapi.TYPE_STRING),
                'max_tokens': openapi.Schema(type=openapi.TYPE_INTEGER),
                'temperature': openapi.Schema(type=openapi.TYPE_NUMBER),
                'top_p': openapi.Schema(type=openapi.TYPE_NUMBER),
                'n': openapi.Schema(type=openapi.TYPE_INTEGER),
                'stream': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'presence_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'frequency_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
            }
        ),
        responses={ 200: GPTModelSerializer(), 400: "Bad Request"}
    )
    def patch(self, request):
        """
        Updates a GPT Model given the parameter specifications.
        """
        model_id = request.query_params.get('model_id', '')
        data = request.data
        serializer = self.update_gptmodel(data, model_id)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Deletes a GPT Model given the model_id and course_id.",
        responses={ 200: GPTModelSerializer(), 404: "Model not found" },
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, type=openapi.TYPE_STRING)
        ]
    )
    def delete(self, request):
        """
        Deletes a GPT Model given the model_id and course_id.
        """
        course_id = request.query_params.get('course_id', '')
        model_id = request.query_params.get('model_id', '')
        gpt_model = get_object_or_404(GPTModel, course_id=course_id, model_id=model_id)
        gpt_model.delete()
        return JsonResponse({'msg': 'GPT Model deleted successfully.'})

    def create_gptmodel(self, data):
        """
        Creates a GPT Model given the parameter specifications.
        """
        model_id = uuid.uuid4()
        data['model_id'] = model_id
        serializer = GPTModelSerializer(data=data)
        return serializer
    
    def update_gptmodel(self, data, model_id):
        """
        Updates a GPT Model given the parameter specifications.
        """
        GPTModel.objects.filter(model_id=model_id).update(**data)
        data['model_id'] = model_id
        serializer = GPTModelSerializer(data=data)
        return serializer

class GPTModelCourseListView(APIView):
    """
    Get all models in a course given course id

    """
    def get(self, request):
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')

        if course_id:
            course = get_object_or_404(Course, course_id=course_id)
        else:
            course = get_object_or_404(Course, course_code=course_code, semester=semester)

        models = GPTModel.objects.filter(course_id=course.course_id)

        models = [model.to_dict() for model in models]

        return JsonResponse({'models': models})

class GPTModelListView(APIView):
    """
    View to list all GPT models in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """
    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]


    @swagger_auto_schema(
        operation_description="Returns all GPT models in the system.",
        responses={ 200: GPTModelSerializer(many=True) }
    )
    def get(self, request, format=None):
        """
        Returns all GPT models in the system.
        """
        gpt_models = GPTModel.objects.all()
        serializer = GPTModelSerializer(gpt_models, many=True)
        return JsonResponse({"models": serializer.data}) 

class ActivateGPTModelView(APIView):

    @swagger_auto_schema(
        operation_description="Activates a selected GPTModel",
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ],
        responses={ 200: 'Model activated', 400: "Bad Request", 404: "Model not found"}
    )
    def get(self, request):
        """
        Activates a selected GPTModel.
        """
        model_id = request.query_params.get('model_id', '')

        get_object_or_404(GPTModel, model_id=model_id)
        GPTModel.objects.filter(model_id=model_id).update(status=True)
        return JsonResponse({'msg': 'Model activated successfully.'})

    def deactivate_current_gptmodel(self, course_id):
        GPTModel.objects.filter(course_id=course_id).update(status=False)

    def activate_gptmodel(self, course_id, model_id):
        GPTModel.objects.filter(course_id=course_id, model_id=model_id).update(status=True)
        return get_object_or_404(GPTModel, course_id=course_id, model_id=model_id)
    
class DeactivateGPTModelView(APIView):

    @swagger_auto_schema(
        operation_description="Deactivates a selected GPTModel",
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ],
        responses={ 200: "Model deactivated", 400: "Bad Request", 404: "Model not found"}
    )
    def get(self, request):
        """
        Deactivates a selected GPTModel.
        """
        model_id = request.query_params.get('model_id', '')
        get_object_or_404(GPTModel, model_id=model_id)
        GPTModel.objects.filter(model_id=model_id).update(status=False)
        return JsonResponse({'msg': 'Model deactivated successfully.'})