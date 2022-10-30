from django.urls import path
from .views import ChatlogList, ChatlogDetail, UserList, UserDetail, CourseDetail, CourseList, ConversationDetail, ConversationList, report_incorrect_answers
from students import views

app_name = 'student_api'

urlpatterns = [
    # path('user/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    # path('user/all', UserList.as_view(), name='user-list'),
    # path('course/<int:pk>/', CourseDetail.as_view(), name='course-detail'),
    # path('course', CourseList.as_view(), name='course-list'),
    # path('conversation/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    # path('conversation/all', ConversationList.as_view(), name='conversation-list'),
    # path('chatlog/all', ChatlogList.as_view(), name='chatlog-detail'),
    
    path('user', views.user_detail),
    path('chatlog', views.chatlog_detail),
    path('conversation', views.conversation_detail),
    path('feedback', views.feedback_detail),
    path('report', views.report_detail),
    path('incorrect-answer', views.report_incorrect_answers),
]
