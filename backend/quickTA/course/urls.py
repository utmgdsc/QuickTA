from django.urls import path
from .views import *

app_name = 'analytics_api'

urlpatterns = [
    # path('/:id', user_detail),
    # path('/list', user_list),
    path('', CourseView.as_view()),
    path('/all', CourseList.as_view()),
    path('/enrollment', CourseEnrollment.as_view())
]