import uuid

from django.http import HttpResponse
from ..serializers.admin_serializers import CreateUserSerializer, AddUserCourseSerializer
from ..models import *
from ..constants import *

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..functions import user_functions, course_functions
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(methods=['post'], request_body=CreateUserSerializer)
@api_view(['POST'])
def create_user(request):
    """
    Adds a single user.

    Parameters:
    - user_id: str      User ID
    - name: str         User name
    - utorid: str       User's utorid
    - user_role: str    User role ('ST' - Student, 'IS' - Instructor
                        'RS' - researcher, 'AM' - admin)
    """
    if request.method == 'POST':
        try:
            # Response validation
            serializer = CreateUserSerializer(data=request.data)
            serializer.is_valid()
            
            ret = user_functions.create_user(request.data)
            if ret == OPERATION_FAILED:
                raise UserAlreadyExistsError

            return Response(ret, status=status.HTTP_201_CREATED)
        except UserAlreadyExistsError:
            return Response({"msg": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            if 'name' not in request.data.keys():
                error.append("Name")
            if 'utorid' not in request.data.keys():
                error.append("Utor ID")
            if 'user_role' not in request.data.keys():
                error.append("User Role")
            err = {"msg": "User details missing fields:" + ','.join(error)}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(methods=['post'], request_body=CreateUserSerializer)
@api_view(['POST'])
def create_multiple_users(request):
    """
    Adds multiple users.

    Parameters:
    - users: List  Users array containing the following information for each user:
    
        - user_id: str      User ID
        - name: str         User name
        - utorid: str       User's utorid
        - user_role: str    User role ('ST' - Student, 'IS' - Instructor
                            'RS' - researcher, 'AM' - admin)
    """
    if request.method == 'POST':
        try:
            response = { "users": [] }

            for user in request.data['users']:
                ret = user_functions.create_user(user)
                if ret == OPERATION_FAILED:
                    raise UserAlreadyExistsError
                response['users'].append(ret)

            return Response(ret, status=status.HTTP_201_CREATED)
        except UserAlreadyExistsError:
            return Response({"msg": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            error = []
            if 'name' not in request.data.keys():
                error.append("Name")
            if 'utorid' not in request.data.keys():
                error.append("Utor ID")
            if 'user_role' not in request.data.keys():
                error.append("User Role")
            err = {"msg": "User details missing fields:" + ','.join(error)}

            return Response(err, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(methods=['post'], request_body=AddUserCourseSerializer)
@api_view(['POST'])
def add_user_course(request):
    """
    Links a student to a course

    Parameters:
    - user_id
    - course_id
    - type: "student" or "instructor"
    """
    if request.method == 'POST':
        try:
            add_user = user_functions.add_user_to_course(request.data['user_id'], request.data['course_id'])
            if (add_user):
                if request.data["type"] == "student": 
                    op = course_functions.update_course_students_list(request.data['course_id'], request.data['user_id'])
                if request.data["type"] == "instructor":  
                    op = course_functions.update_course_instructors_list(request.data['course_id'], request.data['user_id'])
                if not(op): raise AddUserToCourseFailedError
            else:
                raise AddUserToCourseFailedError

            return Response(status=status.HTTP_200_OK)
        except AddUserToCourseFailedError:
            return Response({"msg": "Failed to add course to user."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=AddUserCourseSerializer)
@api_view(['POST'])
def add_multiple_user_course(request):
    """
    Links a user to a course

    Parameters:
    - users: List[str]  list of student user uuids
    - course_id: str    course uuid
    - type: "student" or "instructor"
    """
    if request.method == 'POST':
        try:
            for user in request.data['users']:
                add_user = user_functions.add_user_to_course(user, request.data['course_id'])
                if (add_user):
                    if request.data["type"] == "student": op = course_functions.update_course_students_list(request.data['course_id'], request.data['user_id'])
                    if request.data["type"] == "instructor":  op = course_functions.update_course_instructors_list(request.data['course_id'], request.data['user_id'])
                    if not(op): raise AddUserToCourseFailedError
                else:
                    raise AddUserToCourseFailedError

                return Response(status=status.HTTP_200_OK)
        except AddUserToCourseFailedError:
            return Response({"msg": "Failed to add course to users."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=AddUserCourseSerializer)
@api_view(['POST'])
def remove_user_course(request):
    """
    Removes a user from a course.
    
    Parameters:
    - user_id
    - course_id
    - type: "student" or "instructor"
    """
    if request.method == 'POST':
        try:
            data = request.data
            remove_user = user_functions.remove_user_from_course(data['user_id'], data['course_id'])
            if (remove_user):
                if request.data["type"] == "student": op = course_functions.remove_student_from_course(request.data['course_id'], request.data['user_id'])
                if request.data["type"] == "instructor":  op = course_functions.remove_instructors_from(request.data['course_id'], request.data['user_id'])
                op = course_functions.remove_student_from_course(data['course_id'], data['user_id'])
                if not(op): raise RemoveUserFromCourseFailedError
            else:
                raise RemoveUserFromCourseFailedError
        except RemoveUserFromCourseFailedError:
            return Response({"msg": "Failed to remove user from course."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserAlreadyExistsError(Exception): pass
class AddUserToCourseFailedError(Exception): pass
class RemoveUserFromCourseFailedError(Exception): pass