import uuid

from django.http import HttpResponse
from ..serializers.admin_serializers import *
from ..serializers.serializers import ErrorResponse
from ..models import *
from ..constants import *

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..functions import user_functions, course_functions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(methods=['post'], request_body=CreateOneUserRequest,
    responses={
        201: openapi.Response('Created', CreateOneUserResponse),
        400: openapi.Response('Bad Request', ErrorResponse)
    })
@api_view(['POST'])
def create_user(request):
    """
    Adds a single user.

    Parameters:
    
        - name: str         User name
        - utorid: str       User's utorid
        - user_role: str    User role ('ST' - Student, 'IS' - Instructor, 'RS' - researcher, 'AM' - admin)
    """
    if request.method == 'POST':
        try:            
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

            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=CreateMultipleUserRequest,
    responses={
        201: openapi.Response('Created', CreateMultipleUserResponse),
        400: openapi.Response('Bad Request', ErrorResponse),
        409: openapi.Response('User Already Exists', ErrorResponse)
    })
@api_view(['POST'])
def create_multiple_users(request):
    """
    Adds multiple users.

    List of Parameters:
    
        - users: List           Users array containing the following information for each user:
    
            - name: str         User name
            - utorid: str       User's utorid
            - user_role: str    User role ('ST' - Student, 'IS' - Instructor, 'RS' - researcher, 'AM' - admin)
    """
    if request.method == 'POST':
        try:
            response = { "added": [] }

            for user in request.data['users']:
                ret = user_functions.create_user(user)
                if ret == OPERATION_FAILED:
                    raise UserAlreadyExistsError
                response['users'].append(ret)

            return Response(ret, status=status.HTTP_201_CREATED)
        except UserAlreadyExistsError:
            return Response({"msg": "User already exists."}, status=status.HTTP_409_CONFLICT)
        except:
            error = []
            if 'name' not in request.data.keys():
                error.append("Name")
            if 'utorid' not in request.data.keys():
                error.append("Utor ID")
            if 'user_role' not in request.data.keys():
                error.append("User Role")
            err = {"msg": "User details missing fields:" + ','.join(error)}

            return Response(err, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=AddUserToCourseRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def add_user_course(request):
    """
    Links a user to a course.

    List of Parameters:
    
        - user_id: str              User ID
        - course_id: str            Course ID
        - type: str                 User Type ("student" or "instructor")
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

@swagger_auto_schema(methods=['post'], request_body=AddMultipleUserToCourseRequest,
    responses={
        200: openapi.Response('Success'),
        200: openapi.Response('Success'),
    })
@api_view(['POST'])
def add_multiple_user_course(request):
    """
    Links multiple user to a course.

    List of Parameters:

        - users: List[str]  list of student user uuids
        - course_id: str    course uuid
        - type: str         "student" or "instructor"
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
            return Response({"msg": "Failed to add course to users."}, status=status.HTTP_404_BAD_REQUEST)
        except:
            return Response({"msg": "Bad Request."},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=RemoveUserFromCourseRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def remove_user_course(request):
    """
    Removes a user from a course.
    
    List of Parameters:
    
        - user_id: str      User UUID
        - course_id: str    Course UUID
        - type: str         User type ("student" or "instructor")
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
            return Response({"success": op}, status=status.HTTP_200_OK)
            
        except RemoveUserFromCourseFailedError:
            return Response({"msg": "Failed to remove user from course."}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"msg": "Bad Request."}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(methods=['post'], request_body=ImportAllStudentsFromCsvRequest,
    responses={
        200: openapi.Response('Success'),
        201: openapi.Response('Created'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def import_all_students_from_csv(request):
    """
    Adds the list of students in the CSV file passed it into a specific course.

    List of Parameters:

        - file: CSV file        CSV file
        - course_id: str        Course UUID

    The CSV format is given by the following corresponding fields (in exact order):
    Acad_act, Section_cd, Prime TM,Prime SNR,0th TM1,0th SNR1,0th TM2,0th SNR2,Person ID,Surname,Given Name,Preferred Name,Email,Current_sts,UTORid

    The fields extracted are the Surname, Given Name, Preferred Name and UTORid
    """
    if request.method == 'POST':
        try:
            # Deletes all current students from the course
            course_id = request.data['course_id']
            students = course_functions.get_all_course_users(course_id)

            # Remove course from student's course list
            if students:
                for sid in students:
                    user_functions.remove_user_from_course(sid, course_id)
                    course_functions.remove_course_students_list(course_id, sid)

            # Acquires csv file from HTTP body
            csv_file = request.FILES['file']
            if not csv_file.name.endswith(".csv"):
                return Response({"msg": "Wrong File Type"}, status=status.HTTP_404_NOT_FOUND)

            # Clean csv file formatting
            file_data = csv_file.read().decode("utf-8")
            data = file_data.split("\n")
            
            # Ensure data is populated
            if len(data) == 1: 
                raise Response({"msg": ""}, status=status.HTTP_400_BAD_REQUEST)
            data = data[1:]
            
            # Parse through fields for e ach user
            for row in data:
                fields = row.split(",")
                # student_id = fields[8] - Unused field
                name = fields[9] + " " + fields[10]
                if fields[11] != "":
                    name += " " + fields[11]
                utorid = fields[14]

                # Acquires matching utorids
                user = User.objects.filter(utorid=utorid)
                
                # Creates user if user does not exist
                if not user:
                    data_dict = {
                        "name": name,
                        "utorid": utorid,
                        "user_role": "ST"
                    }
                    user_functions.create_user(data_dict)
                
                user_id = User.objects.get(utorid=utorid).user_id
                ret = user_functions.add_user_to_course(user_id=user_id, course_id=request.data['course_id'])
                if not(ret):
                    raise FailedToAddUserToCourseError
                ret = course_functions.update_course_students_list(course_id=course_id, user_id=user_id)
            return Response(status=status.HTTP_201_CREATED)
        
        except FailedToAddUserToCourseError:
            return Response({"msg": "Cannot add user to course."}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"msg": "Bad Request."},status=status.HTTP_400_BAD_REQUEST)

class FailedToAddUserToCourseError(Exception): pass
class UserAlreadyExistsError(Exception): pass
class AddUserToCourseFailedError(Exception): pass
class RemoveUserFromCourseFailedError(Exception): pass