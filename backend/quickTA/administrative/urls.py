from django.urls import path
from .views import *

app_name = 'administrative_api'

urlpatterns = [
    path('/course', ConversationQueryView.as_view()),
    # path('/list', user_list),
    # path('', UserView.as_view()),
]