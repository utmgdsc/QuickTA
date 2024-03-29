from django.urls import path
from .views import *

app_name = 'users_api'

urlpatterns = [
    # path('/:id', user_detail),
    # path('/list', user_list),
    path('', UserView.as_view()),
    path('/all', UserListView.as_view()),
    path('/courses', UserCoursesListView.as_view()),
    path('/batch-add', UserBatchAddView.as_view()),
    path('/batch-add/csv', UserBatchAddCsvView.as_view()),
    path('/test', TestView.as_view()),
]