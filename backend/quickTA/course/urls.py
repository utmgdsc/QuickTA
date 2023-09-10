from django.urls import path
from .views import *

app_name = 'analytics_api'

urlpatterns = [
    # path('/:id', user_detail),
    # path('/list', user_list),
    path('', CourseView.as_view()),
    path('/all', CourseList.as_view()),
    path('/list', CourseMultipleList.as_view()),
    path('/enroll', CourseEnrollment.as_view()),
    path('/users', CourseUserList.as_view()),
    path('/unenrolled-users', CourseUnenrolledUsersList.as_view()),
    path('/enroll/multiple', CourseMultipleEnrollment.as_view()),
]