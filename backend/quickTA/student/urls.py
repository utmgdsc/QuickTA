from django.urls import path
from .views import *

app_name = 'student_api'

urlpatterns = [
    # Conversation/Chatlog related views
    path('/conversation', ConversationView.as_view(), name='conversation'),
    path('/conversation/all', ConversationListView.as_view(), name='conversation_list'),
    path('/chatlog', ChatlogView.as_view(), name='chatlog'),
    path('/chatlog/all', ChatlogListView.as_view(), name='chatlog_list'),
    path('/feedback', FeedbackView.as_view(), name='feedback'),
    path('/feedback/all', FeedbackListView.as_view(), name='feedback_list'),
    path('/report', ReportView.as_view(), name='report'),
    path('/report/all', ReportListView.as_view(), name='report_list'),
    path('/course-comfortability', CourseComfortabilityView.as_view(), name='course_comfortability'),
    path('/course-comfortability/all', CourseComfortabilityListView.as_view(), name='course_comfortability_list'),

]


