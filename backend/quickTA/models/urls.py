from django.urls import path
from .views import *

app_name = 'models_api'

urlpatterns = [
    # path('/:id', user_detail),
    # path('/list', user_list),
    # path('', UserView.as_view()),
    path('/gpt', GPTModelView.as_view()),
    path('/gpt/all', GPTModelListView.as_view()),
    path('/gpt/activate', ActivateGPTModelView.as_view()),
]