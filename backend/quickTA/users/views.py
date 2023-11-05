import os
import uuid
# from datetime import datetime
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import render
from .serializers import UserSerializer, UserBatchAddSerializer
from users.models import User, UserStatistic
from rest_framework import status
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from course.models import Course
from utils.handlers import ErrorResponse
from utils.constants import ROLE_MAP_ENUM, ROLE_MAP

from datetime import datetime
from django.db.models import Q
from course.serializers import CourseSerializer 


# Create your views here.
class LoginView(APIView):
    @swagger_auto_schema(
        operation_summary="Login",
        responses={200: UserSerializer(), 404: "User not found"},
        manual_parameters=[
            openapi.Parameter("utorid", openapi.IN_QUERY, description="UTORID", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Login with utorid
        """
        utorid = request.query_params.get('utorid', '')
        if not(utorid): utorid = request.headers['Utorid']
        if utorid == '':
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, utorid=utorid)
        # UserStatistic.objects.create(user_id=user.user_id, operation="login")
        serializer = UserSerializer(user)

        return JsonResponse(serializer.data)
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
        if not(utorid): utorid = request.headers['Utorid']
        
        cache_key = f"{utorid}"
        if user_id == '' and utorid == '':
            return JsonResponse({"msg": "User not found found"})
        
        user = cache.get(cache_key)
        if user is None:
            if user_id: user = get_object_or_404(User, user_id=user_id)
            else: user = get_object_or_404(User, utorid=utorid)
        cache.set(cache_key, user, 60*60*24*7)

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
        Optional column with header 'model_id' to assign a default model ID to 'ST' student role.
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

        name_idx, utorid_idx, user_role_idx, model_id_idx = -1, -1, -1, -1
        print(lines[0].split(","))
        for index, key in enumerate(lines[0].split(",")):
            if key == 'name': name_idx = index
            if key == 'utorid': utorid_idx = index
            if key == 'role': user_role_idx = index
            if key == 'model_id': model_id_idx = index

        print(name_idx, utorid_idx, user_role_idx, model_id_idx)
        
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
            model_id = row[model_id_idx] if model_id_idx != -1 else ""

            

            if not (utorid and name): 
                failed_users.append(f'Row {i+2}: missing utorid or name')
                continue
            
            if User.objects.filter(utorid=utorid):
                user = User.objects.get(utorid=utorid)
                if course_id not in user.courses:
                    user.courses = user.courses + [str(course_id)]
                    User.objects.filter(utorid=utorid).update(courses=user.courses, model_id=model_id)
                data = { 'utorid': utorid, 'name': name, 'user_role': role, 'courses': [course_id], 'model_id': model_id }
                existing_users.append(data)
                continue

            data = { 'utorid': utorid, 'name': name, 'user_role': role, 'courses': [course_id], 'model_id': model_id }
            successful_users.append(data)
        
        serializer = UserBatchAddSerializer(data=successful_users, many=True)
        if serializer.is_valid():
            serializer.save()

            # Add existing users to course
            all_users = existing_users + successful_users
            for user in all_users:
                user_id = str(User.objects.get(utorid=user['utorid']).user_id)
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

class UserRolesView(APIView):
    
    @swagger_auto_schema(operation_summary="Get list of user roles",)
    def get(self, request):

        response = { "roles": [] }
        for role in ROLE_MAP.keys():
            response["roles"].append({ "id": role, "name": ROLE_MAP[role].capitalize() })
        return JsonResponse(response)

class UserUnenrolledCoursesView(APIView): 
     
    @swagger_auto_schema(
        operation_summary="Get unenrolled courses",
        manual_parameters=[
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING),
        ],
    )
    def get(self, request):
        """
        Gets unenrolled courses
        """
        user_id = request.query_params.get('user_id', '')
        utorid = request.query_params.get('utorid', '')

        if user_id: user = get_object_or_404(User, user_id=user_id)
        else: user = get_object_or_404(User, utorid=utorid)

        courses = Course.objects.filter(~Q(course_id__in=user.courses))
        serializer = CourseSerializer(courses, many=True)
        return JsonResponse(serializer.data, safe=False)

class MarkNewUserView(APIView):
    @swagger_auto_schema(
        operation_summary="Unmark new user",
        manual_parameters=[
            openapi.Parameter("utorid", openapi.IN_QUERY, description="UTORID", type=openapi.TYPE_STRING),
            openapi.Parameter("deployment_id", openapi.IN_QUERY, description="Deployment ID", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Unmark new user
        """
        utorid = request.query_params.get('utorid', '')
        deployment_id = request.query_params.get('deployment_id', '')

        if utorid == '':
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, utorid=utorid)

        updated_deployments = []
        for deployment in user.status:
            if deployment['deployment_id'] == deployment_id:
                deployment['new_user'] = False
            updated_deployments.append(deployment)

        User.objects.filter(user_id=user.user_id).update(status=updated_deployments)
        UserStatistic(
            user_id=user.user_id,
            operation="lab_8_survey_complete",
        ).save()
        return JsonResponse({"msg": "User updated"})

class UserStatisticView(APIView):

    @swagger_auto_schema(
        operation_summary="Get user statistics",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_STRING),
                'utorid': openapi.Schema(type=openapi.TYPE_STRING),
                'operation': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        """
        Get user statistics
        """
        user_id = request.data.get('user_id', '')
        utorid = request.data.get('utorid', '')
        operation = request.data.get('operation', '')

        if user_id == '' and utorid == '':
            return ErrorResponse("Bad request", status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, user_id=user_id) if user_id != "" else get_object_or_404(User, utorid=utorid)

        UserStatistic(
            user_id=user.user_id,
            operation=operation,
        ).save()
        return JsonResponse({"msg": "OK"})
class TestView(APIView):
    def get(self, request):

        # from models.models import GPTModel

        # GPTModel.objects.filter(temperature=0).update(deployment_id="7ffb83cd-3dbe-453f-96fc-b93c626c821b")
        all_users = User.objects.all()

        models = [
            "62d28ee3-45cf-4687-b83e-b49a9504c65b", # Con 1
            "61290a38-93e5-479a-84d5-a7bc62e5dfd5", # Con 2
            "2089d332-ef43-4b17-bf4e-141a87eef92e" # Con 3
        ]
        index = 0
        for user in all_users:
            model_id = user.model_id
            User.objects.filter(user_id=user.user_id).update(status=[
                {"deployment_id": "7ffb83cd-3dbe-453f-96fc-b93c626c821b", "new_user": user.new_user, "model_id": "", "active": False},
                {"deployment_id": "bda97806-2847-4bf0-a841-461f8665607c", "new_user": False, "model_id": model_id, "active": False}, # new_user needs to be changed
                {"deployment_id": "fd582a39-2eed-42ee-b6fd-1b3c430e30cd", "new_user": True, "model_id": models[index], "active": True},
            ])
            index += 1
            if index == 3: index = 0

        ## Migrate model ids
        # all_users = User.objects.all()
        # for user in all_users:
        #     if user.utorid == 'choiman3':
        #         old_model_id = user.model_id
        #         User.objects.filter(user_id=user.user_id).update(
        #             {"deployment_id": "", "model_id": },
        #             {"deployment_id": "", "model_id": },
        #         )




        return JsonResponse({"msg": "Test message"})
