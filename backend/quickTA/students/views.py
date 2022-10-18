from django.shortcuts import render
from django.http import JsonResponse
from .models import User
from .serializers import UserSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from mongoengine import connect
from utils import DB_URI

@api_view(['GET', 'POST'])
def get_users(request):
    connect(host=DB_URI)

    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse({"data": serializer.data})

    if request.method == 'POST':
        user = User()
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)