import uuid
from uuid import uuid1
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from course.models import Course
from course.serializers import *
from course.helpers import get_course 
from models.serializers import GPTModelSerializer
from users.models import User
from users.serializers import UserSerializer
from utils.constants import ROLE_MAP, ROLE_MAP_ENUM, COURSE_ROLE_MAP, USER_SELECTION_TYPE
from utils.handlers import ErrorResponse
from django.views.decorators.cache import cache_page
from django.views.decorators.cache import cache_page as django_cache_page
from django.core.cache import cache
# Create your views here.
class CourseView(APIView):

    @swagger_auto_schema(
        operation_summary="Get course details",
        responses={200: CourseSerializer(), 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("show_users", in_=openapi.IN_QUERY, description="Include user lists [True/False]", type=openapi.TYPE_BOOLEAN),
        ]
    )
    def get(self, request):
        """
        Acquires the details of a certain course by either:
        
            1. course_id, or
            2. course_code and semester

        Additionally, you can send True/False to the 'show_users' parameter to get the list of students enrolled in the course.
        """
        params = request.query_params
        course_id = params.get('course_id', '')
        course_code = params.get('course_code', '')
        course_semester = params.get('semester', '')
        show_users = params.get('show_users', False)

        if course_id == '' and (course_code == '' or course_semester == ''):
            return JsonResponse({"msg": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if course_id: course = get_object_or_404(Course, course_id=course_id)
        elif course_code and course_semester: course = get_object_or_404(Course, course_code=course_code, semester=course_semester)

        serializer = CourseSerializer(course, show_users=show_users, show_active_deployments=True)
        if show_users.lower() == 'true': 
            return JsonResponse(serializer.data)
        
        res = {**serializer.data}
        res.pop('students')
        res.pop('instructors')
        res.pop('researchers')
        res.pop('admins')
        return JsonResponse(res)
        
    
    @swagger_auto_schema(
        operation_summary="Create a new course",
        request_body=CourseSerializer,
        responses={201: CourseSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new course
        """
        # Check for course uniqueness
        course_code = request.data.get('course_code', '')
        semester = request.data.get('semester', '')
        if course_code == '' or semester == '':
            return ErrorResponse("Bad request", status.HTTP_400_BAD_REQUEST)
        
        if Course.objects.filter(course_code=course_code, semester=semester):
            return ErrorResponse("Course already exists", status.HTTP_400_BAD_REQUEST)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            res = self.create_course(serializer)
            return JsonResponse(res, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update course's information",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="course_id", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="course_code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="semester", type=openapi.TYPE_STRING)
        ],
        request_body=CourseSerializer,
        responses={200: "User updated", 400: "Bad Request", 403: "Course already exists", 404: "User not found"}
    )
    def patch(self, request):
        """
        Updates the course's information
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')

        new_course_code = request.data.get('course_code', '')
        new_semester = request.data.get('semester', '')
        
        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            if (new_course_code == '' or new_semester == '') and Course.objects.filter(course_code=new_course_code, semester=new_semester): 
                return ErrorResponse("Course already exists", status.HTTP_403_FORBIDDEN)
            Course.objects.filter(course_id=course.course_id).update(**serializer.validated_data)
            return JsonResponse({"msg": "Course updated"})

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete a course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING)
            ],
        responses={200: "Course deleted", 404: "Course not found", 405: "Cannot delete course with enrolled users"}
    )
    def delete(self, request):
        """
        Deletes a course

        TODO: delete all other relevant data as well - students, chatlogs, etc.
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        if course.students or course.instructors or course.researchers or course.admins:
            return ErrorResponse("Cannot delete course with enrolled users", status.HTTP_405_METHOD_NOT_ALLOWED)
        return JsonResponse({"msg": "Course deleted"})
    
    def create_course(self, serializer):
        if serializer:
            course_id = str(uuid.uuid4())
            serializer.save(course_id=course_id)
            response = {
                "course_id": course_id,
                **serializer.data
            }
            return response
        return None

class CourseList(APIView):
    """
    Gets all courses
    """ 
    @swagger_auto_schema(
        operation_summary="Get all courses",
        responses={200: CourseSerializer(many=True)}
    )
    def get(self, request):
        """
        Gets all courses
        """
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True, show_users=True)

        for i, course in enumerate(serializer.data):
            for role in COURSE_ROLE_MAP:
                serializer.data[i][COURSE_ROLE_MAP[role]] = UserSerializer(User.objects.filter(user_id__in=course[COURSE_ROLE_MAP[role]]), many=True).data
        return JsonResponse(serializer.data, safe=False)

class CourseEnrollment(APIView):
    @swagger_auto_schema(
        operation_summary="Enroll a student in a course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course Code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING),
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User Role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM)
        ],
        responses={200: "User enrolled", 400: "User already enrolled", 404: "User or course not found"}
    )
    def post(self, request):
        """
        Enrolls a student in a course
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        user_id = request.query_params.get('user_id', '')
        utorid = request.query_params.get('utorid', '')
        user_role = request.query_params.get('user_role', '')

        role_field = COURSE_ROLE_MAP.get(user_role, None)

        if not role_field:
            return ErrorResponse("User role is required", status.HTTP_400_BAD_REQUEST)

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)
        
        if user_id: user = get_object_or_404(User, user_id=user_id)
        else: user = get_object_or_404(User, utorid=utorid)

        # Check if user is already in the course
        if user.user_id in [str(id) for id in getattr(course, role_field)]:
            return ErrorResponse(f"{ROLE_MAP[user_role].capitalize()} already enrolled", status.HTTP_400_BAD_REQUEST)

        users = getattr(course, role_field)
        users.append(user.user_id)

        courses = user.courses
        courses.append(course.course_id)

        Course.objects.filter(course_id=course.course_id).update(**{role_field: users})
        User.objects.filter(user_id=user.user_id).update(courses=courses)
        return JsonResponse({"msg": f"{ROLE_MAP[user_role].capitalize()} enrolled"})

    @swagger_auto_schema(
        operation_summary="Unenroll a student from a course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course Code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("utorid", openapi.IN_QUERY, description="Utorid", type=openapi.TYPE_STRING),
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM),
        ],
        responses={200: "User unenrolled", 400: "User is not enrolled", 404: "User or course not found"}
    )
    def delete(self, request):
        """
        Unenrolls a student from a course.

        A course can be specified by:
        
            1. course_id, or
            2. course_code and semester

        A user can be specified by: 

            1. user_id, or
            2. utorid
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        user_id = request.query_params.get('user_id', '')
        utorid = request.query_params.get('utorid', '')
        user_role = request.query_params.get('user_role', '')
        role_field = COURSE_ROLE_MAP.get(user_role, None)

        if not role_field:
            return ErrorResponse("User role is required", status.HTTP_400_BAD_REQUEST)

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        if user_id: user = get_object_or_404(User, user_id=user_id)
        else: user = get_object_or_404(User, utorid=utorid)

        if str(user.user_id) not in [str(id) for id in getattr(course, role_field)]:
            return ErrorResponse(f"{ROLE_MAP[user_role].capitalize()} is not enrolled", status.HTTP_400_BAD_REQUEST)

        users = getattr(course, role_field)
        users.remove(user.user_id)

        courses = user.courses
        courses.remove(course.course_id)

        Course.objects.filter(course_id=course.course_id).update(**{role_field: users})
        User.objects.filter(user_id=user.user_id).update(courses=courses)
        return JsonResponse({"msg": "Student unenrolled"})

class CourseUserList(APIView):
    
    @swagger_auto_schema(
    operation_summary="Get students in a course by user roles",
    manual_parameters=[
        openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
        openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
        openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
        openapi.Parameter("user_roles", openapi.IN_QUERY, description="List of user roles (ST = Student, IS = Instructor, RS = Researcher, AM = Admin)", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
    ],
    responses={200: "Students", 404: "Course not found"}
    )
    def get(self, request):
        """
        Acquires students in a course by user roles.
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')

        user_roles = request.query_params.get('user_roles', [])
        if user_roles: user_roles = user_roles.split(',')
        else: return ErrorResponse("Please provide a list of user roles", status.HTTP_400_BAD_REQUEST)

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)
        
        response = dict()
        for role in user_roles:
            role_field = COURSE_ROLE_MAP.get(role, None)
            if role_field: 
                response[role_field] = getattr(course, role_field) if getattr(course, role_field) else []
                response[role_field] = UserSerializer(User.objects.filter(user_id__in=response[role_field]), many=True).data

        return JsonResponse(response)

class CourseMultipleList(APIView):
    @swagger_auto_schema(
        operation_summary="Get multiple courses",
        manual_parameters=[
            openapi.Parameter("course_ids", openapi.IN_QUERY, description="List of course IDs", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        ],
        responses={200: CourseMultipleSerializer(many=True), 404: "Course not found"}
    )
    def get(self, request):
        """
        Gets multiple courses by their course ids.
        """
        course_ids = request.query_params.get('course_ids', [])
        if not course_ids: return JsonResponse({"courses": []})

        cache_key = 'courses_multiple_list_' + course_ids
        courses = cache.get(cache_key)
        
        if not courses:
            course_ids = course_ids.split(',')
            courses = get_list_or_404(Course, course_id__in=course_ids)
        cache.set(cache_key, courses, 60*60*24*7)

        serializer = CourseMultipleSerializer(courses, many=True)
        return JsonResponse({"courses": serializer.data})
    
class CourseModelList(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get all models from the given course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course Code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("show_all", openapi.IN_QUERY, description="Show all models [True/False]", type=openapi.TYPE_BOOLEAN),
        ],
        responses={200: GPTModelSerializer(many=True), 404: "Course Not found"}
    )
    def get(self, request):
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        show_all = request.query_params.get('show_all', False)

        cache_key = f'course_model_list_{course_id}_{course_code}_{semester}'
        models = cache.get(cache_key)

        if not models:
            if course_id: course = get_object_or_404(Course, course_id=course_id)
            else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

            models = GPTModel.objects.filter(course_id=course.course_id)
            models = [model.to_student_dict() for model in models if model.status or show_all]
        cache.set(cache_key, models, 60*60*24*7)

        return JsonResponse({'models': models})

    

class CourseUnenrolledUsersList(APIView):

    # Gets all the students, instructors, admins and researchers that are not enrolled in a course
    @swagger_auto_schema(
        operation_summary="Get unenrolled users",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="List of user roles (ST = Student, IS = Instructor, RS = Researcher, AM = Admin)", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        ],
        responses={200: "Unenrolled users", 404: "Course not found"}
    )
    def get(self, request):
        """
        Gets unenrolled users
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        user_roles = request.query_params.get('user_roles', [])
        
        if user_roles: user_roles = user_roles.split(',')
        else: return ErrorResponse("Please provide a list of user roles", status.HTTP_400_BAD_REQUEST)

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)
        unenrolled_users = {role: [] for role in user_roles}
        
        users_query = Q(user_role__in=user_roles) & (
            ~Q(user_id__in=course.students) |
            ~Q(user_id__in=course.instructors) |
            ~Q(user_id__in=course.researchers) |
            ~Q(user_id__in=course.admins)
        )
        users = User.objects.filter(users_query)

        unenrolled_users = {
            COURSE_ROLE_MAP[role]: [user for user in users if user.user_role == role and user.user_id not in getattr(course, COURSE_ROLE_MAP[role])]
            for role in user_roles
        }
        response = {role: UserSerializer(users, many=True).data for role, users in unenrolled_users.items()}
        return JsonResponse(response)

class CourseMultipleEnrollment(APIView):
    @swagger_auto_schema(
        operation_summary="Enroll multiple students in a course",
        request_body=CourseMultipleEnrollmentUserSerializer(many=True),
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM),
        ],
        responses={200: "Students enrolled", 404: "Course not found"}
    )
    def post(self, request):
        """
        Enrolls multiple students in a course. Acquires either a list of user_ids or utorids.
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')
        students = request.data
        
        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        # Validate user_role
        user_role = request.query_params.get('user_role', '')
        if user_role not in ROLE_MAP.keys():
            return ErrorResponse("Please provide an accepted user role [ST/IS/RS/AM].", status.HTTP_400_BAD_REQUEST)

        already_enrolled = []
        for student in students:

            user_id = student.get('user_id', '')
            utorid = student.get('utorid', '')

            print("Adding " + utorid + "...")

            if user_id: user = get_object_or_404(User, user_id=user_id)
            else: user = get_object_or_404(User, utorid=utorid)

            if str(user.user_id) in [str(id) for id in getattr(course, COURSE_ROLE_MAP[user.user_role])]:
                already_enrolled.append(f"[{user.utorid}] {user.name}")
                continue
            
            courses = user.courses
            courses.append(str(course.course_id))

            getattr(course, COURSE_ROLE_MAP[user.user_role]).append(str(user.user_id))
            User.objects.filter(user_id=user.user_id).update(courses=courses)

        Course.objects.filter(course_id=course.course_id).update(students=course.students, instructors=course.instructors, researchers=course.researchers, admins=course.admins)
        return JsonResponse({"msg": f"Students enrolled.", "Already enrolled": already_enrolled})

    
    @swagger_auto_schema(
        operation_summary="Unenroll multiple students from a course",
        request_body=CourseMultipleEnrollmentUserSerializer(many=True),
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
        ],
        responses={200: "Students unenrolled", 404: "Course not found"}
    )
    def delete(self, request):
        """
        Unenrolls multiple students from a course.
        """
        course_id = request.query_params.get('course_id', '')
        course_code = request.query_params.get('course_code', '')
        semester = request.query_params.get('semester', '')

        if course_id: course = get_object_or_404(Course, course_id=course_id)
        else: course = get_object_or_404(Course, course_code=course_code, semester=semester)

        failed_unenroll = []
        students = request.data
        for student in students:

            user_id = student.get('user_id', '')
            utorid = student.get('utorid', '')
            if not(user_id or utorid): failed_unenroll.append(student)

            if user_id: user = get_object_or_404(User, user_id=user_id)
            else: user = get_object_or_404(User, utorid=utorid)

            # Remove user from course list, and course from user list
            user_role = user.user_role
            getattr(course, COURSE_ROLE_MAP[user_role]).remove(str(user.user_id))
            user.courses.remove(course.course_id)

            User.objects.filter(user_id=user.user_id).update(courses=user.courses)
        
        Course.objects.filter(course_id=course.course_id).update(students=course.students, instructors=course.instructors, researchers=course.researchers, admins=course.admins)
        return JsonResponse({"msg": "Students unenrolled", "Failed to unenroll": failed_unenroll})

class CourseDeploymentView(APIView):

    @swagger_auto_schema(
        operation_summary="Get course deployment(s)",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course Code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="List of deployment IDs (Comma-Separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("show_details", openapi.IN_QUERY, description="Show deployment details [True/False]", type=openapi.TYPE_BOOLEAN),
        ],
    )
    def get(self, request):
        """
        Acquires course deployment(s). Defaults to get all deployments.
        Specify deployment IDs to get specific deployments.
        Specify course ID / course code and semester to get all deployments for a course.
        
        - deployment_ids: List of deployment IDs (Comma separated)
        - course_id: Course ID
        - course_code: Course code
        - semester: Semester
        """
        deployment_id = request.query_params.get('deployment_ids', [])
        show_details = request.query_params.get('show_details', False)
        query_params = request.query_params
        course = get_course(query_params)

        # Get all deployments for a course
        if course: 
            deployment_ids = CourseDeployment.objects.filter(course_id=str(course.course_id))
            return JsonResponse({ "deployments": [deployment.to_dict() for deployment in deployment_ids]})
        
        if deployment_id: deployment_ids = deployment_id.split(',')

        if deployment_id: deployments = CourseDeployment.objects.filter(deployment_id__in=deployment_ids)
        else: deployments = CourseDeployment.objects.all()
        return JsonResponse({ "deployments": [deployment.to_dict(add_details=show_details) for deployment in deployments ]})

    @swagger_auto_schema(
        operation_summary="Create a course deployment",
        request_body=CourseDeploymentSerializer,
        responses={201: "Course deployment created", 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a course deployment
        """
        serializer = CourseDeploymentSerializer(data=request.data)
        if serializer.is_valid():
            deployment_id = str(uuid.uuid4())
            serializer.save(deployment_id=deployment_id)
            return JsonResponse({"msg": "Course deployment created"}, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update a course deployment",
        manual_parameters=[
            openapi.Parameter("deployment_id", openapi.IN_QUERY, description="Deployment ID", type=openapi.TYPE_STRING),
        ],
        request_body=CourseDeploymentSerializer,
        responses={200: "Course deployment updated", 400: "Bad Request", 404: "Course deployment not found"}
    )
    def patch(self, request):
        """
        Updates a course deployment
        """
        deployment_id = request.query_params.get('deployment_id', '')
        deployment = get_object_or_404(CourseDeployment, deployment_id=deployment_id)
        serializer = CourseDeploymentSerializer(deployment, data=request.data, partial=True)
        if serializer.is_valid():
            CourseDeployment.objects.filter(deployment_id=deployment.deployment_id).update(**serializer.validated_data)
            return JsonResponse({"msg": "Course deployment updated"})
        return ErrorResponse(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Delete a course deployment",
        manual_parameters=[
            openapi.Parameter("deployment_id", openapi.IN_QUERY, description="Deployment ID", type=openapi.TYPE_STRING),
        ],
        responses={200: "Course deployment deleted", 404: "Course deployment not found"}
    )
    def delete(self, request):
        """
        Deletes a course deployment
        """
        deployment_id = request.query_params.get('deployment_id', '')
        deployment = get_object_or_404(CourseDeployment, deployment_id=deployment_id)
        deployment.delete()
        return JsonResponse({"msg": "Course deployment deleted"})