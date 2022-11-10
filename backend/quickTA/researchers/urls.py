from django.urls import path
from .views import ResearchersView


urlpatterns = [
    path('', ResearchersView.as_view())
]