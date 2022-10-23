from django.urls import path
from .views import UserList, UserDetail

app_name = 'student_api'

urlpatterns = [
    path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('', UserList.as_view(), name='user-list'),
]
