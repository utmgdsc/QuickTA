from django.urls import path
from .views.views import ChatlogList, ChatlogDetail, UserList, UserDetail, CourseDetail, CourseList, ConversationDetail, ConversationList
from students.views import views, researcher_views, admin_views

app_name = 'student_api'

urlpatterns = [
    path('user/<str:user_id>/', UserDetail.as_view(), name='user-detail'),
    path('conversation/<str:conversation_id>/', ConversationDetail.as_view(), name='conversation-detail'),

    path('user/all', UserList.as_view(), name='user-list'),
    path('conversation/all', ConversationList.as_view(), name='conversation-list'),
    path('chatlog/all', ChatlogList.as_view(), name='chatlog-detail'),

    # Student view
    # ================================================================================================
    path('user', views.user_detail),
    path('user/courses', views.get_user_courses),
    path('get-user',views.get_user),
    path('course', views.course_detail),
    path('get-course', views.course_get),
    path('course/all', views.courses_get_all),
    path('chatlog', views.chatlog_detail),
    path('conversation', views.conversation_detail),
    path('feedback', views.feedback_detail),
    path('report', views.chatlog_history_detail),
    path('incorrect-answer', views.report_conversation),
    path('comfortability-rating', views.course_comfortability),

    # Instructor/Researcher views
    # ================================================================================================
    path('researcher/average-ratings', researcher_views.average_ratings),
    path('researcher/average-ratings-csv', researcher_views.average_ratings_csv),
    
    path('researcher/resolve-reported-conversation', researcher_views.resolve_reported_conversation),
    path('researcher/reported-conversations', researcher_views.list_reported_conversations),
    path('researcher/reported-conversations-csv', researcher_views.list_reported_conversations_csv),
    
    path('researcher/report-chatlogs', researcher_views.get_reported_chatlogs),
    path('researcher/reported-chatlogs-csv', researcher_views.get_reported_chatlogs_csv),
    
    path('researcher/avg-response-rate', researcher_views.get_average_response_rate),
    path('researcher/avg-response-rate-csv', researcher_views.get_average_response_rate_csv),
    
    path('researcher/most-common-words', researcher_views.get_most_common_words),
    
    path('researcher/avg-comfortability-rating', researcher_views.get_course_comfortability),
    path('researcher/avg-comfortability-rating-csv', researcher_views.get_course_comfortability_csv),
    path('researcher/get-filtered-chatlogs', researcher_views.get_filtered_chatlogs),

    path('researcher/interaction-frequency', researcher_views.get_interaction_frequency),

    path('researcher/course-student-list', researcher_views.get_course_users),

    path('researcher/gptmodel-create', researcher_views.gptmodel_create),
    path('researcher/gptmodel-update', researcher_views.gptmodel_update),
    path('researcher/gptmodel-activate', researcher_views.gptmodel_select),
    path('researcher/gptmodel-get', researcher_views.gptmodel_get),
    path('researcher/gptmodel-get-one', researcher_views.gptmodel_get_one),
    path('researcher/gptmodel-get-all', researcher_views.gptmodel_get_all),
    path('researcher/gptmodel-delete', researcher_views.gptmodel_delete),
    # Admin view
    # ================================================================================================
    path('admin/add-user', admin_views.create_user),
    path('admin/add-multiple-user', admin_views.create_multiple_users),

    path('admin/add-user-course', admin_views.add_user_course),
    path('admin/add-multiple-user-course', admin_views.add_multiple_user_course),
    path('admin/remove-user-course', admin_views.remove_user_course),
]
