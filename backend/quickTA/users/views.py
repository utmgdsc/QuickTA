import uuid

from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import render
from .serializers import UserSerializer, UserBatchAddSerializer
from .models import User
from rest_framework import status
from django.http import Http404
from django.shortcuts import get_object_or_404

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from utils.handlers import ErrorResponse

from utils.constants import ROLE_MAP_ENUM, ROLE_MAP

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
        Creates a new user.

        A User can be of the following roles:
        
        - ST: student
        - IS: instructor
        - RS: researcher
        - AM: admin
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

        A User can be of the following roles:
        
        - ST: student
        - IS: instructor
        - RS: researcher
        - AM: admin
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

class UserListView(APIView):
        
        @swagger_auto_schema(
            operation_summary="Get all users",
            responses={200: UserSerializer(many=True), 404: "No users found"}
        )
        def get(self, request):
            """
            Acquires all users.
            """
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return JsonResponse(serializer.data, safe=False)

class UserCoursesListView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get user's courses",
        manual_parameters=[openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING)],
        responses={200: "User's courses", 400: "Bad request", 404: "User not found"}
    )
    def get(self, request):
        """
        Acquires the courses of a certain user by user_id.
        """
        user_id = request.GET.get('user_id', '')
        utorid = request.query_params.get('utorid', '')
        if user_id == '' and utorid == '': 
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, user_id=user_id)
        return JsonResponse(user.courses, safe=False)

# TODO: add a view to get all the courses the user is not in
class UserBatchAddView(APIView):

    @swagger_auto_schema(
        operation_summary="Add multiple users",
        request_body=UserBatchAddSerializer(many=True),
        manual_parameters=[openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM)],
        responses={201: "Users created", 400: "Bad request"}
    )
    def post(self, request):
        """
        Creates multiple users. Defaults to student role if unspecified.

        TODO: Check for duplicating users (based on utorid)
        """
        user_role = request.query_params.get('user_role', 'ST')
        if user_role not in ROLE_MAP.keys():
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)

        serializer = UserBatchAddSerializer(data=request.data, role=user_role, many=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"msg": "Users created"}, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)