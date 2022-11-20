import uuid

from django.http import HttpResponse
from ..serializers.admin_serializers import CreateUserSerializer, AddUserCourseSerializer
from ..models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..functions import user_functions, course_functions
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(methods=['post'], request_body=CreateUserSerializer)
@api_view(['POST'])
def create_user(request):
      if request.method == 'POST':
        try:
            # Response validation
            serializer = CreateUserSerializer(data=request.data)
            serializer.is_valid()
            
            request.data['user_id'] = str(uuid.uuid4())
            
            utorid = User.objects.filter(utorid=request.data['utorid'])
            if (len(utorid) != 0):
                raise UserAlreadyExistsError

            # Save newly created user
            data = request.data
            user = User(
                user_id=data['user_id'],
                name=data['name'],
                utorid=data['utorid'],
                user_role=data['user_role']                
            )
            user.save()

            response = {
                "user_id": user.user_id,
                "name": user.name,
                "utorid": user.utorid,
                "user_role": user.user_role
            }
            return Response(response, status=status.HTTP_201_CREATED)
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
    if request.method == 'POST':
        try:
            add_user = user_functions.add_user_to_course(request.data['user_id'], request.data['course_id'])
            if (add_user):
                op = course_functions.update_course_students_list(request.data['course_id'], request.data['user_id'])
                if not(op): raise AddUserToCourseFailedError
            else:
                raise AddUserToCourseFailedError

            return Response(status=status.HTTP_200_OK)
        except AddUserToCourseFailedError:
            return Response({"msg": "Failed to add course to user."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserAlreadyExistsError(Exception): pass
class AddUserToCourseFailedError(Exception): pass