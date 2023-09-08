import uuid
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from course.models import Course
from course.serializers import CourseSerializer
from users.models import User
from users.serializers import UserSerializer
from utils.constants import ROLE_MAP, ROLE_MAP_ENUM, COURSE_ROLE_MAP
from utils.handlers import ErrorResponse


# Create your views here.
class CourseView(APIView):

    @swagger_auto_schema(
        operation_summary="Get course details",
        responses={200: CourseSerializer(), 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("students", in_=openapi.IN_QUERY, description="Include students (True/False)", type=openapi.TYPE_BOOLEAN),
        ]
    )
    def get(self, request):
        """
        Acquires the details of a certain course by either:
        
            1. course_id, or
            2. course_code and semester

        Additionally, you can send True/False to the 'students' parameter to get the list of students enrolled in the course.

        """
        params = request.query_params
        course_id = params.get('course_id', '')
        course_code = params.get('course_code', '')
        course_semester = params.get('semester', '')
        students = params.get('students', False)

        if course_id == '' and (course_code == '' or course_semester == ''):
            return JsonResponse({"msg": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if course_id: course = get_object_or_404(Course, course_id=course_id)
        elif course_code and course_semester: course = get_object_or_404(Course, course_code=course_code, semester=course_semester)

        serializer = CourseSerializer(course)
        if students: return JsonResponse(serializer.data)
        serializer.data.pop('students')
        return JsonResponse(serializer.data)
        
    
    @swagger_auto_schema(
        operation_summary="Create a new course",
        request_body=CourseSerializer,
        responses={201: CourseSerializer(), 400: "Bad Request"}
    )
    def post(self, request):
        """
        Creates a new course
        """
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            res = self.create_course(serializer)
            return JsonResponse(res, status=status.HTTP_201_CREATED)
        return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Update course's information",
        manual_parameters=[openapi.Parameter("course_id", openapi.IN_QUERY, description="course_id", type=openapi.TYPE_STRING)],
        request_body=CourseSerializer,
        responses={200: "User updated", 400: "Bad Request", 404: "User not found"}
    )
    def patch(self, request):
        """
        Updates the course's information
        """

        course_id = request.query_params.get('course_id', '')

        course = get_object_or_404(Course, course_id=course_id)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            Course.objects.filter(coruse_id=course_id).update(**serializer.validated_data)
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
        course = get_object_or_404(Course, course_id=course_id)

        if course.students or course.instructors or course.researchers or course.admins:
            return ErrorResponse("Cannot delete course with enrolled users", status.HTTP_405_METHOD_NOT_ALLOWED)
        return JsonResponse({"msg": "Course deleted"})
    
    def create_course(self, serializer):
        if serializer:
            course_id = uuid.uuid4()
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
        serializer = CourseSerializer(courses, many=True)
        return JsonResponse(serializer.data, safe=False)

class CourseEnrollment(APIView):
    @swagger_auto_schema(
        operation_summary="Enroll a student in a course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM)
            ],
        responses={200: "User enrolled", 400: "User already enrolled", 404: "User or course not found"}
    )
    def post(self, request):
        """
        Enrolls a student in a course
        """
        course_id = request.query_params.get('course_id', '')
        user_id = request.query_params.get('user_id', '')
        user_role = request.query_params.get('user_role', '')
        role_field = COURSE_ROLE_MAP.get(user_role, None)

        if not role_field:
            return ErrorResponse("User role is required", status.HTTP_400_BAD_REQUEST)

        course = get_object_or_404(Course, course_id=course_id)
        user = get_object_or_404(User, user_id=user_id)

        # Check if user is already in the course
        if user_id in [str(id) for id in getattr(course, role_field)]:
            return ErrorResponse(f"{ROLE_MAP[user_role].capitalize()} already enrolled", status.HTTP_400_BAD_REQUEST)

        users = getattr(course, role_field)
        users.append(user.user_id)

        courses = user.courses
        courses.append(course.course_id)
        
        Course.objects.filter(course_id=course_id).update(**{role_field: users})
        User.objects.filter(user_id=user_id).update(courses=courses)
        return JsonResponse({"msg": f"{ROLE_MAP[user_role].capitalize()} enrolled"})

    @swagger_auto_schema(
        operation_summary="Unenroll a student from a course",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_role", openapi.IN_QUERY, description="User role", type=openapi.TYPE_STRING, enum=ROLE_MAP_ENUM),
        ],
        responses={200: "User unenrolled", 400: "User is not enrolled", 404: "User or course not found"}
    )
    def delete(self, request):
        """
        Unenrolls a student from a course
        """
        course_id = request.query_params.get('course_id', '')
        user_id = request.query_params.get('user_id', '')
        user_role = request.query_params.get('user_role', '')
        role_field = COURSE_ROLE_MAP.get(user_role, None)

        if not role_field:
            return ErrorResponse("User role is required", status.HTTP_400_BAD_REQUEST)

        course = get_object_or_404(Course, course_id=course_id)
        user = get_object_or_404(User, user_id=user_id)

        if user_id not in [str(id) for id in getattr(course, role_field)]:
            return ErrorResponse(f"{ROLE_MAP[user_role].capitalize()} is not enrolled", status.HTTP_400_BAD_REQUEST)

        users = getattr(course, role_field)
        users.remove(user.user_id)

        courses = user.courses
        courses.remove(course.course_id)

        Course.objects.filter(course_id=course_id).update(**{role_field: users})
        User.objects.filter(user_id=user_id).update(courses=courses)
        return JsonResponse({"msg": "Student unenrolled"})

class CourseUserList(APIView):
    
    @swagger_auto_schema(
    operation_summary="Get students in a course by user roles",
    manual_parameters=[
        openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
        openapi.Parameter("user_roles", openapi.IN_QUERY, description="List of user roles (ST = Student, IS = Instructor, RS = Researcher, AM = Admin)", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
    ],
    responses={200: "Students", 404: "Course not found"}
    )
    def get(self, request):
        """
        Acquires students in a course by user roles
        """
        course_id = request.query_params.get('course_id', '')
        user_roles = request.query_params.get('user_roles', [])
        user_roles = user_roles.split(',')


        course = get_object_or_404(Course, course_id=course_id)
        response = dict()
        for role in user_roles:
            role_field = COURSE_ROLE_MAP.get(role, None)
            if role_field: response[role_field] = getattr(course, role_field) if getattr(course, role_field) else []

        return JsonResponse(response)

class CourseMultipleList(APIView):
    @swagger_auto_schema(
        operation_summary="Get multiple courses",
        manual_parameters=[
            openapi.Parameter("course_ids", openapi.IN_QUERY, description="List of course IDs", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        ],
        responses={200: CourseSerializer(many=True), 404: "Course not found"}
    )
    def get(self, request):
        """
        Gets multiple courses
        """
        course_ids = request.query_params.get('course_ids', [])
        course_ids = course_ids.split(',')
        courses = get_list_or_404(Course, course_id__in=course_ids)
        serializer = CourseSerializer(courses, many=True)
        return JsonResponse(serializer.data)

class CourseUnenrolledUsersList(APIView):

    # Gets all the students, instructors, admins and researchers that are not enrolled in a course
    @swagger_auto_schema(
        operation_summary="Get unenrolled users",
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="List of user roles (ST = Student, IS = Instructor, RS = Researcher, AM = Admin)", type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        ],
        responses={200: "Unenrolled users", 404: "Course not found"}
    )
    def get(self, request):
        """
        Gets unenrolled users
        """
        course_id = request.query_params.get('course_id', '')
        user_roles = request.query_params.get('user_roles', []).split(',')

        course = get_object_or_404(Course, course_id=course_id)
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
    
# TODO: Enroll multiple students in a course
# TODO: Unenroll multiple students in a course