import csv
import uuid
import re
import pytz 
from ..openAI import quick_ta_model as model

from datetime import datetime
from http.client import responses
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone, dateparse
from django.utils.timezone import now

from ..constants import *
from ..functions import user_functions, course_functions
from ..models import Chatlog, Conversation, Course, Feedback, User, Report
from ..serializers.serializers import * 

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema



@swagger_auto_schema(methods=['post'], request_body=GetChatlogHistoryRequest,
    responses={
        200: openapi.Response('Success'),
        400: openapi.Response('Bad Request', ErrorResponse),
        404: openapi.Response('Not Found', ErrorResponse)
    })
@api_view(['POST'])
def chatlog_history_detail(request):
    """
    Retrieves the conversation id and returns a copy of the chatlog.

    Returns a CSV file including the contents of a particular conversation.
    The CSV file contains all of the chatlogs pertaining to the specific conversation, formatted as follows:

        [Time], Speaker, Chatlog
    """
    if request.method == 'POST':
        # try:
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id=cid)

            # Checks if conversation is found
            if (len(conversation) > 0):
                uid = conversation[0].user_id
            else:
                raise ConversationNotFoundError

            # Checks if user is found
            print(uid)
            user = User.objects.filter(user_id=uid)
            if (len(user) > 0):
                user = user[0]
            else:
                raise UserNotFoundError

            chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        
            response = HttpResponse(
                content_type='text/csv',
                headers={'Content-Disposition': 'attachement; filename="convo-report.csv"'}
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"

            writer = csv.writer(response)
            
            for chatlog in chatlogs:
                chatlog.time = chatlog.time.strftime("%m/%d/%Y %H:%M:%S")
                if chatlog.is_user:
                    writer.writerow(['[' + str(chatlog.time) + ']', str(user.name), str(chatlog.chatlog)])
                else: 
                    writer.writerow(['[' + str(chatlog.time) + ']', 'QuickTA', str(chatlog.chatlog)])

            return response

        # except ConversationNotFoundError:
        #     return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_404_NOT_FOUND) 
        # except UserNotFoundError:
        #     return Response({"msg": "Error: User not Found."}, status=status.HTTP_404_NOT_FOUND) 
        # except:
        #     # Error handling
        #     error = []
        #     if 'conversation_id' not in request.data.keys():
        #         error.append("Conversation ID")
        #     err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}
        #     return Response(err, status=status.HTTP_400_BAD_REQUEST) 

# Exceptions
class UserAlreadyExistsError(Exception): pass
class CourseAlreadyExistsError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass
class OverRatingLimitError(Exception): pass
class FeedbackExistsError(Exception): pass
class MissingReportMessageError(Exception): pass
class ModelDoesNotExistsError(Exception): pass