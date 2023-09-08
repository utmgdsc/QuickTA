import uuid

from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import render
from .serializers import UserSerializer
from .models import User
from rest_framework import status
from django.http import Http404
from django.shortcuts import get_object_or_404

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


def ErrorResponse(error, status):

    def parse_error(error):
        """
        Rules to parse the error message
        """
        error_message = error.replace('\"', "'")
        return error_message

    if not isinstance(error, dict):
        return JsonResponse({"error": error}, status=status)

    errors = {"error": {}}
    for key, value in error.items():
        if isinstance(value, str):
            error_message = parse_error(value)
        elif isinstance(value, list):
            error_message = [parse_error(item) for item in value]
        else:
            error_message = value

        errors["error"][key] = error_message

    return JsonResponse(errors, status=status)


# Create your views here.
class UserView(APIView):

    @swagger_auto_schema(
        operation_summary="Get user details",
        responses={200: UserSerializer(), 404: "User not found"},
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="UTORID", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Acquires the details of a certain user by either user_id or utorid, or both.
        """
        user_id = request.GET.get('user_id', '')
        utorid = request.GET.get('utorid', '')
        if user_id == '' and utorid == '':
            return JsonResponse({"msg": "User not found found"})
        
        if user_id: user = get_object_or_404(User, user_id=user_id)
        elif utorid: user = get_object_or_404(User, utorid=utorid)

        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)
        
    
    @swagger_auto_schema(
        operation_summary="Create a new user",
        request_body=UserSerializer,
        responses={201: UserSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new user
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            res = self.create_user(serializer)
            return JsonResponse(res, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update user's information",
        manual_parameters=[openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING)],
        request_body=UserSerializer,
        responses={200: "User updated", 400: "Bad Request", 404: "User not found"}
    )
    def patch(self, request):
        """
        Updates the user's information
        """

        user_id = request.query_params.get('user_id', '')
        user = get_object_or_404(User, user_id=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            User.objects.filter(user_id=user_id).update(**serializer.validated_data)
            return JsonResponse({"msg": "User updated"})

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete a user",
        manual_parameters=[openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING)],
        responses={200: "User deleted", 404: "User not found"}
    )
    def delete(self, request):
        """
        Deletes a user
        """
        user_id = request.query_params.get('user_id', '')
        user = get_object_or_404(User, user_id=user_id)
        user.delete()
        return JsonResponse({"msg": "User deleted"})
    
    def create_user(self, serializer):
        if serializer:
            user_id = uuid.uuid4()
            serializer.save(user_id=user_id)
            response = {
                "user_id": user_id,
                **serializer.data
            }
            return response
        return None

