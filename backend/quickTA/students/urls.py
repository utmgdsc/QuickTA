from django.urls import path
from .views import ChatlogList, ChatlogDetail, UserList, UserDetail, CourseDetail, CourseList, ConversationDetail, ConversationList, report_incorrect_answers
from students import views

app_name = 'student_api'

urlpatterns = [
    path('user/<str:user_id>/', UserDetail.as_view(), name='user-detail'),
    path('course/<str:course_id>/', CourseDetail.as_view(), name='course-detail'),
    path('conversation/<str:conversation_id>/', ConversationDetail.as_view(), name='conversation-detail'),

    path('user/all', UserList.as_view(), name='user-list'),
    path('course/all', CourseList.as_view(), name='course-list'),
    path('conversation/all', ConversationList.as_view(), name='conversation-list'),
    path('chatlog/all', ChatlogList.as_view(), name='chatlog-detail'),

    path('user', views.user_detail),
    path('course', views.course_detail),
    path('chatlog', views.chatlog_detail),
    path('conversation', views.conversation_detail),
    path('feedback', views.feedback_detail),
    path('report', views.report_detail),
    path('incorrect-answer', views.report_incorrect_answers),
]
