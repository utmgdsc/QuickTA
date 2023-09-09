import uuid
from django.shortcuts import render
from models.models import GPTModel
# from models.serializers import GPTModelSerializer
import students.functions as gptmodel_functions
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
        responses={ 200: GPTModelSerializer(), 400: ErrorResponse, 500: ErrorResponse},
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, type=openapi.TYPE_STRING)
        ]
    )
    def get(self, request):
        """
        Returns a GPT model given the model_id and course_id.
        """
        course_id = request.query_params.get('course_id', '')
        model_id = request.query_params.get('model_id', '')
        gpt_model = get_object_or_404(GPTModel, course_id=course_id, model_id=model_id)
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
                'suffix': openapi.Schema(type=openapi.TYPE_STRING),
                'max_tokens': openapi.Schema(type=openapi.TYPE_INTEGER),
                'temperature': openapi.Schema(type=openapi.TYPE_NUMBER),
                'top_p': openapi.Schema(type=openapi.TYPE_NUMBER),
                'n': openapi.Schema(type=openapi.TYPE_INTEGER),
                'stream': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'logprobs': openapi.Schema(type=openapi.TYPE_INTEGER),
                'presence_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'frequency_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'best_of': openapi.Schema(type=openapi.TYPE_INTEGER)
            }
        ),
        responses={ 200: GPTModelSerializer(), 400: ErrorResponse}
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
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'model_id': openapi.Schema(type=openapi.TYPE_STRING),
                'model_name': openapi.Schema(type=openapi.TYPE_STRING),
                'course_id': openapi.Schema(type=openapi.TYPE_STRING),
                'status': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'prompt': openapi.Schema(type=openapi.TYPE_STRING),
                'suffix': openapi.Schema(type=openapi.TYPE_STRING),
                'max_tokens': openapi.Schema(type=openapi.TYPE_INTEGER),
                'temperature': openapi.Schema(type=openapi.TYPE_NUMBER),
                'top_p': openapi.Schema(type=openapi.TYPE_NUMBER),
                'n': openapi.Schema(type=openapi.TYPE_INTEGER),
                'stream': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'logprobs': openapi.Schema(type=openapi.TYPE_INTEGER),
                'presence_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'frequency_penalty': openapi.Schema(type=openapi.TYPE_NUMBER),
                'best_of': openapi.Schema(type=openapi.TYPE_INTEGER)
            }
        ),
        responses={ 200: GPTModelSerializer(), 400: ErrorResponse}
    )
    def put(self, request):
        """
        Updates a GPT Model given the parameter specifications.
        """
        data = request.data
        serializer = self.update_gptmodel(data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return ErrorResponse(serializer.errors)
    
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
    
    def update_gptmodel(self,data):
        """
        Updates a GPT Model given the parameter specifications.
        """
        model_id = data['model_id']
        gpt_model = GPTModel.objects.filter(model_id=model_id).update(**data)
        serializer = GPTModelSerializer(gpt_model)
        return serializer
                   
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
        responses={ 200: GPTModelSerializer(many=True), 400: ErrorResponse, 500: ErrorResponse}
    )
    def get(self, request, format=None):
        """
        Returns all GPT models in the system.
        """
        gpt_models = GPTModel.objects.all()
        serializer = GPTModelSerializer(gpt_models, many=True)
        return JsonResponse(serializer.data)

class ActivateGPTModelView(APIView):

    @swagger_auto_schema(
        operation_description="Activates a selected GPTModel",
        manual_parameters=[
            openapi.Parameter("model_id", openapi.IN_QUERY, type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, type=openapi.TYPE_STRING)
        ],
        responses={ 200: GPTModelSerializer(), 400: ErrorResponse, 404: "Model not found"}
    )
    def get(self, request):
        """
        Activates a selected GPTModel.
        """
        course_id = request.query_params.get('course_id', '')
        model_id = request.query_params.get('model_id', '')
        self.deactivate_current_gptmodel(course_id)
        current_model = self.activate_gptmodel(course_id, model_id)
        serializer = GPTModelSerializer(current_model)
        return JsonResponse(serializer.data)

    def deactivate_current_gptmodel(self, course_id):
        GPTModel.objects.filter(course_id=course_id).update(status=False)

    def activate_gptmodel(self, course_id, model_id):
        GPTModel.objects.filter(course_id=course_id, model_id=model_id).update(status=True)
        return get_object_or_404(GPTModel, course_id=course_id, model_id=model_id)