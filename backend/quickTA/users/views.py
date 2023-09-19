import uuid
import csv
from datetime import datetime

from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import action
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

from course.models import Course
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
        # Check for no duplicating utorids
        utorid = request.data.get('utorid', '')
        if utorid != '' and User.objects.filter(utorid=utorid):
            return ErrorResponse("User with the same utorid exists", status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            res = self.create_user(serializer)
            return JsonResponse(res, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update user's information",
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING)
        ],
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
        utorid = request.query_params.get('utorid', '')
        updated_utorid = request.data.get('utorid', '') 

        user = get_object_or_404(User, user_id=user_id) if user_id != "" else get_object_or_404(User, utorid=utorid)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if user_id: User.objects.filter(user_id=user_id).update(**serializer.validated_data)
            elif utorid: 
                if updated_utorid and User.objects.filter(utorid=updated_utorid):
                    return ErrorResponse("User with the same utorid exists", status=status.HTTP_400_BAD_REQUEST)
                User.objects.filter(utorid=utorid).update(**serializer.validated_data)
            return JsonResponse({"msg": "User updated"})

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete a user",
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING)
        ],
        responses={200: "User deleted", 404: "User not found"}
    )
    def delete(self, request):
        """
        Deletes a user
        """
        user_id = request.query_params.get('user_id', '')
        utorid = request.query_params.get('utorid', '')
        if user_id == '' and utorid == '':
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user is enrolled with courses
        if user_id: user = get_object_or_404(User, user_id=user_id)
        elif utorid: user = get_object_or_404(User, utorid=utorid)
        if user.courses:
            return ErrorResponse("User is enrolled with courses", status=status.HTTP_400_BAD_REQUEST)

        if user_id: User.objects.filter(user_id=user_id).delete()
        elif utorid: User.objects.filter(utorid=utorid).delete()

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
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING)
        ],
        responses={200: "User's courses", 400: "Bad request", 404: "User not found"}
    )
    def get(self, request):
        """
        Acquires the courses of a certain user by user_id.
        """
        user_id = request.query_params.get('user_id', '')
        utorid = request.query_params.get('utorid', '')
        
        if user_id: user = get_object_or_404(User, user_id=user_id)
        else: user = get_object_or_404(User, utorid=utorid)

        if user.user_role == 'ST':
            # lst = []
            # for course in user.courses:
            #     c = get_object_or_404(Course, course_id=course)
            #     if c.end_date > datetime.now():
            #         lst.append(course)
            #
            return JsonResponse([course for course in user.courses if get_object_or_404(Course, course_id=course).end_date > datetime.now()], safe=False)
        return JsonResponse(user.courses, safe=False)

# TODO: add a view to get all the courses the user is not in
class UserBatchAddView(APIView):

    @swagger_auto_schema(
        operation_summary="Add multiple users",
        request_body=UserBatchAddSerializer(many=True),
        manual_parameters=[
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM),
        ],
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

class UserBatchAddCsvView(APIView):

    parser_classes = (MultiPartParser,)

    @swagger_auto_schema(
        operation_summary="Add multiple users through csv file",
        manual_parameters=[
            openapi.Parameter(name="files", in_=openapi.IN_FORM, type=openapi.TYPE_FILE, required=True, description="Document"),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
        ],
        responses={201: "Users created", 400: "Bad request"}
    )
    @action(detail=False, methods=['post'])
    def post(self, request):
        """
        Create mutiple users through csv file. Defaults to student role if unspecified.

        Course can be specified by either:
        
            1. course_id or 
            2. course_code and semester.

        Skips rows missing 'utorid' and 'name' column headers.
        Optional column with header 'role' defaults to 'ST' student role.
        """
        csv_file = request.FILES['files']
        if not csv_file: return ErrorResponse("No csv uploaded", status=status.HTTP_400_BAD_REQUEST)

        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        user_role = request.query_params.get('user_role', 'ST')
        
        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        # Handle csv file
        file_data = csv_file.read().decode(encoding='utf-8-sig')
        lines = file_data.split("\n")

        name_idx, utorid_idx, user_role_idx = -1, -1, -1
        for index, key in enumerate(lines[0].split(",")):
            if key == 'name': name_idx = index
            if key == 'utorid': utorid_idx = index
            if key == 'role': user_role_idx = index
        
        if not (name_idx != -1 and utorid_idx != -1):
            return ErrorResponse(f'Fields not present: {"name" if name_idx == -1 else ""} {"utorid" if utorid_idx == -1 else ""}', status=status.HTTP_400_BAD_REQUEST)
        
        successful_users = []
        existing_users = []
        failed_users = []

        for i, line in enumerate(lines[1:]):

            row = line.split(",")
            utorid = row[utorid_idx]
            name = row[name_idx]
            role = row[user_role_idx] if user_role_idx != -1 else user_role

            if not (utorid and name): 
                failed_users.append(f'Row {i+2}: missing utorid or name')
                continue
            
            if User.objects.filter(utorid=utorid):
                user = User.objects.get(utorid=utorid)
                if course_id not in user.courses:
                    user.courses = user.courses + [course_id]
                    User.objects.filter(utorid=utorid).update(courses=user.courses)
                data = { 'utorid': utorid, 'name': name, 'user_role': role, 'courses': [course_id] }
                existing_users.append(data)
                continue

            data = { 'utorid': utorid, 'name': name, 'user_role': role, 'courses': [course_id] }
            successful_users.append(data)
        
        serializer = UserBatchAddSerializer(data=successful_users, many=True)
        if serializer.is_valid():
            serializer.save()

            # Add existing users to course
            all_users = existing_users + successful_users
            for user in all_users:
                user_id = User.objects.get(utorid=user['utorid']).user_id
                if user['user_role'] == 'ST': course.students.append(user_id) if user_id not in course.students else None
                elif user['user_role'] == 'IS': course.instructors.append(user_id) if user_id not in course.instructors else None
                elif user['user_role'] == 'RS': course.researchers.append(user_id) if user_id not in course.researchers else None
                elif user['user_role'] == 'AM': course.admins.append(user_id) if user_id not in course.admins else None

                Course.objects.filter(course_id=course.course_id).update(
                    students=course.students,
                    instructors=course.instructors,
                    researchers=course.researchers,
                    admins=course.admins
                )

            existing_users = [f"{user['utorid']}: {user['name']}" for user in existing_users]
            return JsonResponse({"msg": f"Users created.{' Modified existing users (utorid: name): ' + (', '.join(existing_users) if existing_users else '') + '.'}{' Failed to add users: ' + (', '.join(failed_users) if failed_users else '') + '.'}"}, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestView(APIView):
    def get(self, request):
        return JsonResponse({"msg": "Test message"})