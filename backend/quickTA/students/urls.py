from django.urls import path
from .views import UserList, UserDetail, CourseDetail, CourseList, ConversationDetail, ConversationList
from students import views

app_name = 'student_api'

urlpatterns = [
    path('user/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('user', UserList.as_view(), name='user-list'),
    path('course/<int:pk>/', CourseDetail.as_view(), name='course-detail'),
    path('course', CourseList.as_view(), name='course-list'),
    path('conversation/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    path('conversation', ConversationList.as_view(), name='conversation-list'),
    path('chatlog', views.chatlog_detail),
]
