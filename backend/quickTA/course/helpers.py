from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status


from course.models import Course

def get_course(params):
    course_id = params.get('course_id', '')
    course_code = params.get('course_code', '')
    course_semester = params.get('semester', '')
    
    if course_id: course = get_object_or_404(Course, course_id=course_id)
    else: course = get_object_or_404(Course, course_code=course_code, semester=course_semester)
    return course