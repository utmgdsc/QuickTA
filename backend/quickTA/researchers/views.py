from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics

from .models import Chatlog
from .serializers import ResearchersSerializer


# Create your views here.
class ResearchersView(generics.CreateAPIView):
    queryset = Chatlog.objects.all()
    serializer_class = ResearchersSerializer

