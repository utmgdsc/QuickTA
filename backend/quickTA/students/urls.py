from django.urls import path
from .views.views import ChatlogList, ChatlogDetail, UserList, UserDetail, CourseDetail, CourseList, ConversationDetail, ConversationList
from students.views import views, researcher_views

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
    path('report', views.chatlog_history_detail),
    path('incorrect-answer', views.report_conversation),

    path('researcher/average-ratings', researcher_views.average_ratings),
    path('researcher/reported-conversations', researcher_views.list_reported_conversations),
    path('researcher/report-chatlogs', researcher_views.get_reported_chatlogs)
]
