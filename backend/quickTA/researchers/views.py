import uuid
import csv
import datetime as dt

from io import BytesIO
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from users.models import User
from course.models import Course
from course.serializers import CourseSerializer
from course.helpers import get_course 
from student.models import Conversation, Chatlog, Feedback, Report
from utils.handlers import ErrorResponse
from researchers.helpers import *
from researchers.functions.time_utils import *
from researchers.functions.common_topics import generate_wordcloud, get_wordcloud_image

import pymongo
from researchers.queries import *
from utils.time_utils import *
from survey.models import *
from models.models import * 
from survey.models import *
from assessments.models import *
from utils.query_helpers import *

# import uri from settings
from django.conf import settings
MONGO_URI = settings.DATABASES['default']['CLIENT']['host']
client = pymongo.MongoClient(MONGO_URI)
db = client['quickTA']


# Create your views here.
class AverageRatingsView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get average ratings for a course",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the average ratings for a course by either:
        
            1. course_id, or
            2. course_code and semester
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        
        # Acquire all of the ratings of a course given the conversations
        conversation_ids = [convo.conversation_id for convo in conversations]
        ratings = Feedback.objects.filter(conversation_id__in=conversation_ids)
        avg_ratings = ratings.aggregate(avg_rating=Avg('rating'))['avg_rating'] 
        response = { "avg_rating": avg_ratings, "all_ratings": [fb.rating for fb in ratings] }
        return JsonResponse(response)

class FeedbackCsvView(APIView):
        
        @swagger_auto_schema(
            operation_summary="Get average ratings from feedbacks for a course in CSV format",
            responses={200: "Success", 404: "Course not found"},
            manual_parameters=[
                openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
                openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
                openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
                openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
            ]
        )
        def post(self, request):
            """
            Acquires the average ratings for a course by either:
            
                1. course_id, or
                2. course_code and semester
            """
            params = request.query_params
            course = get_course(params)
            filter = params.get('filter', '')
            conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
            
            # Acquire all of the ratings of a course given the conversations
            conversation_ids = [convo.conversation_id for convo in conversations]
            ratings = Feedback.objects.filter(conversation_id__in=conversation_ids)
            avg_ratings = ratings.aggregate(avg_rating=Avg('rating'))['avg_rating'] 
            
            # Create the csv 
            response = HttpResponse(
                content_type='text/csv',
                headers={'Content-Disposition': 'attachment; filename="ratings.csv"'}
            )
            response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
            

            writer = csv.writer(response)
            writer.writerow([ 'Course ID', 'Conversation ID', 'User Name', 'Utorid', 'Rating', 'Feedback Message' ])

            for convo in ratings:
                conversation_id = convo.conversation_id
                rating = get_object_or_404(Feedback, conversation_id=conversation_id)
                conversation = get_object_or_404(Conversation, conversation_id=conversation_id)
                user = get_object_or_404(User, user_id=conversation.user_id)
                writer.writerow([ conversation.course_id, convo.conversation_id, user.name, user.utorid, rating.rating])

            return response

class ResolveReportedConversationView(APIView):
        
    @swagger_auto_schema(
        operation_summary="Resolve a reported conversation",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("conversation_id", openapi.IN_QUERY, description="Conversation ID", type=openapi.TYPE_STRING),
        ]
    )
    def patch(self, request):
        """
        Resolves a reported conversation
        """
        conversation_id = request.query_params.get('conversation_id', '')
        convo = get_object_or_404(Conversation, conversation_id=conversation_id)
        report = Report.objects.filter(conversation_id=conversation_id).update(status='C')
        return JsonResponse({"msg": "Conversation resolved"})

class ReportedConversationsListView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get all reported conversations",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires all reported conversations for a course by either:
        
            1. course_id, or
            2. course_code and semester

        Information returned includes:
        - Conversation ID
        - Course ID
        - User ID
        - User name
        - User utorid
        - Report time
        - Report status ('O' - opened, 'C' - closed)
        - Report message
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        conversation_ids = [convo.conversation_id for convo in conversations]
        reports = Report.objects.filter(conversation_id__in=conversation_ids)
        response = { 
            "total_reported": len(reports),
            "reports": [ report.to_dict() for report in reports ]  
        } 
        return JsonResponse(response)

class ReportedConversationsCsvView(APIView):
                
    @swagger_auto_schema(
        operation_summary="Get all reported conversations in CSV format",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires all reported conversations for a course by either:
        
            1. course_id, or
            2. course_code and semester

        Information returned includes:
        - Conversation ID
        - Course ID
        - User ID
        - User name
        - User utorid
        - Report time
        - Report status ('O' - opened, 'C' - closed)
        - Report message
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        conversation_ids = [convo.conversation_id for convo in conversations]
        reports = Report.objects.filter(conversation_id__in=conversation_ids)
        
        # Create the csv 
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="reports.csv"'
        response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
        writer = csv.writer(response)
        writer.writerow([ 'Course ID', 'Conversation ID', 'User Name', 'Utorid', 'Report Time', 'Report Status', 'Report Message' ])
        
        for report in reports:
            convo = get_object_or_404(Conversation, conversation_id=report.conversation_id)
            user = get_object_or_404(User, user_id=convo.user_id)
            writer.writerow([ convo.course_id, convo.conversation_id, user.name, user.utorid, report.time, report.status, report.msg ])

        return response

class ReportedChatlogsView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get all chatlogs from a reported conversation",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("conversation_id", openapi.IN_QUERY, description="Conversation ID", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Returns all of the chatlogs of a reported conversation given its ID.

        Acquires the conversation ID of the reported conversation and returns the corresponding chatlogs.
        """
        conversation_id = request.query_params.get('conversation_id', '')
        conversation = get_object_or_404(Conversation, conversation_id=conversation_id)
        chatlogs = Chatlog.objects.filter(conversation_id=conversation_id)
        conversation = [chatlog.to_dict(show_alias=True) for chatlog in chatlogs]
        response = { "total_reported_count": len(chatlogs), "conversation": conversation}
        return JsonResponse(response)
        
class ReportedChatlogsCsvView(APIView):

    @swagger_auto_schema(
        operation_summary="Get all chatlogs from a reported conversation in CSV format",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("conversation_id", openapi.IN_QUERY, description="Conversation ID", type=openapi.TYPE_STRING),
        ]
    )
    def post(self, request):
        """
        Returns all of the chatlogs of a reported conversation given its ID.

        Acquires the conversation ID of the reported conversation and returns the corresponding chatlogs.
        """
        conversation_id = request.query_params.get('conversation_id', '')
        conversation = get_object_or_404(Conversation, conversation_id=conversation_id)
        course_id = conversation.course_id
        chatlogs = Chatlog.objects.filter(conversation_id=conversation_id)
        
        # Create the csv 
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="chatlogs.csv"'
        response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
        writer = csv.writer(response)
        writer.writerow([ 'Course ID', 'Conversation ID', 'Time', 'Speaker', 'Chatlog', 'Delta' ])

        for chatlog in chatlogs:
            chat = chatlog.to_dict(show_alias=True)
            writer.writerow([ course_id, chatlog.conversation_id, chatlog.time, chat['speaker'], chatlog.chatlog, chat['delta'] ])

        return response    

class AverageResponseRateView(APIView):
        
        @swagger_auto_schema(
            operation_summary="Get average response rate for a course",
            responses={200: "Success", 404: "Course not found"},
            manual_parameters=[
                openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
                openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
                openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
                openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
            ]
        )
        def get(self, request):
            """
            Acquires the average response rate for a course by either:
            
                1. course_id, or
                2. course_code and semester
            """
            params = request.query_params
            course = get_course(params)
            filter = params.get('filter', '')
            conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
            
            conversation_ids = [convo.conversation_id for convo in conversations]
            chatlogs = Chatlog.objects.filter(conversation_id__in=conversation_ids)
            avg_response_rate, deltas = self.get_average_response_rate(chatlogs)
            
            response = { "avg_response_rate": avg_response_rate, "all_response_rates": deltas }
            return JsonResponse(response)
        
        def get_average_response_rate(self, chatlogs):
            """
            Acquires the average response rate for a course given its chatlogs.
            """
            deltas = [chatlog.delta for chatlog in chatlogs if chatlog.is_user]
            average_delta = str(sum(deltas, dt.timedelta()) / len(deltas))
            deltas = [str(delta) for delta in deltas]
            return average_delta, deltas

class ResponseRateCsvView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get average response rate for a course in CSV format",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the response rate for a course by either:
        
            1. course_id, or
            2. course_code and semester

        Retrieves the response rates given a course id and returns a copy of
        all the relevant chatlog response rates of a course.
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        
        conversation_ids = [convo.conversation_id for convo in conversations]
        chatlogs = Chatlog.objects.filter(conversation_id__in=conversation_ids)
        
        # Create the csv 
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="response_rate.csv"'
        response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
        writer = csv.writer(response)
        writer.writerow([ 'Course ID', 'Conversation ID', 'User Name', 'Utorid', 'Delta' ])

        for chatlog in chatlogs:
            convo = get_object_or_404(Conversation, conversation_id=chatlog.conversation_id)
            user = get_object_or_404(User, user_id=convo.user_id)
            writer.writerow([ course.course_id, chatlog.conversation_id, user.name, user.utorid, chatlog.delta ])

        return response 

    def get_average_response_rate(self, chatlogs):
        """
        Acquires the average response rate for a course given its chatlogs.
        """
        deltas = [chatlog.delta for chatlog in chatlogs if chatlog.is_user]
        average_delta = str(sum(deltas, dt.timedelta()) / len(deltas))
        deltas = [str(delta) for delta in deltas]
        return average_delta, deltas


class MostCommonWordsView(APIView):
        
        @swagger_auto_schema(
            operation_summary="Get most common words for a course",
            responses={200: "Success", 404: "Course not found"},
            manual_parameters=[
                openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
                openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
                openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
                openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True),
                openapi.Parameter("num_words", openapi.IN_QUERY, description="Number of words", type=openapi.TYPE_STRING),
                openapi.Parameter("max_ngram_size", openapi.IN_QUERY, description="Maximum ngram size", type=openapi.TYPE_STRING)
            ]
        )
        def get(self, request):
            """
            Acquires the most common words from user responses for a course by either:
            
                1. course_id, or
                2. course_code and semester

            Retrieves the most common topics through the use of YAKE (Yet Another Keyword Extractor).
            Returns 3-gram topics keywords with their associated frequency. 
            """
            params = request.query_params
            course = get_course(params)
            filter = params.get('filter', '')
            num_words = params.get('num_words', 30)
            max_ngram_size = params.get('max_ngram_size', 3)
            conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
            
            conversation_ids = [convo.conversation_id for convo in conversations]
            sentences = [chatlog.chatlog for chatlog in Chatlog.objects.filter(conversation_id__in=conversation_ids) if chatlog.is_user]
            most_common_words = generate_wordcloud(sentences, int(num_words), int(max_ngram_size))

            response = { "most_common_words": most_common_words }
            return JsonResponse(response)
        
class MostCommonWordsWordcloudView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get most common words for a course in wordcloud format",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the most common words from user responses for a course by either:
        
            1. course_id, or
            2. course_code and semester

        Retrieves the most common topics through the use of YAKE (Yet Another Keyword Extractor).
        Returns 3-gram topics keywords with their associated frequency. 
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        
        conversation_ids = [convo.conversation_id for convo in conversations]
        sentences = [chatlog.chatlog for chatlog in Chatlog.objects.filter(conversation_id__in=conversation_ids) if chatlog.is_user]
        wordcloud = get_wordcloud_image(sentences)

        image = BytesIO()
        wordcloud.save(image, format='PNG')
        image.seek(0)

        response = HttpResponse(image, content_type="image/png", headers={'Content-Disposition': 'attachment; filename="wordcloud.png"'})
        response["Access-Control-Allow-Origin"] = "Content-Type, Content-Disposition"

        return response

class AverageCourseComfortabilityView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get average comfortability rating for a course",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the average comfortability rating for a course by either:
        
            1. course_id, or
            2. course_code and semester
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        
        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        comfortability_ratings = [convo.comfortability_rating for convo in conversations]

        adjusted_ratings = [num for num in comfortability_ratings if isinstance(num, int)]
        print(adjusted_ratings)
        total = sum(adjusted_ratings)
        avg = total / len(comfortability_ratings)
        adjusted_avg = total / len(adjusted_ratings)
        
        response = { "adjusted_avg_comfortability_rating": adjusted_avg, "avg_comfortability_rating": avg, "all_comfortability_ratings": comfortability_ratings }
        return JsonResponse(response)

class CourseComfortabilityCsvView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get average comfortability rating for a course in CSV format",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the average comfortability rating for a course by either:
        
            1. course_id, or
            2. course_code and semester
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')

        conversations = get_filtered_convos(course.course_id, filter, timezone='America/Toronto')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="comfortability_ratings.csv"'
        response["Access-Control-Expose-Headers"] = "Content-Type, Content-Disposition"
        writer = csv.writer(response)
        writer.writerow([ 'Course ID', 'Conversation ID', 'User Name', 'Utorid', 'Comfortability Rating' ])

        for convo in conversations:
            user = get_object_or_404(User, user_id=convo.user_id)
            writer.writerow([ convo.course_id, convo.conversation_id, user.name, user.utorid, convo.comfortability_rating ])

        return response

class InteractionFrequencyView(APIView):
            
    @swagger_auto_schema(
        operation_summary="Get interaction frequency for a course",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester", type=openapi.TYPE_STRING),
            openapi.Parameter("filter", openapi.IN_QUERY, description="Filter view", type=openapi.TYPE_STRING, required=True)
        ]
    )
    def get(self, request):
        """
        Acquires the interaction frequency for a course by either:
        
            1. course_id, or
            2. course_code and semester
        """
        params = request.query_params
        course = get_course(params)
        filter = params.get('filter', '')
        dates = get_all_dates(course.course_id, filter, timezone='America/Toronto')
        interactions = get_filtered_interactions(course.course_id, dates, timezone='America/Toronto')
        response = { "interactions": interactions }
        return JsonResponse(response)

class FilteredChatlogsView(APIView):
                
    @swagger_auto_schema(
        operation_summary="Get all chatlogs for a course given a filter",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING, required=True),
        ]
    )
    def get(self, request):
        """
        Acquires all chatlogs for a course given a filter.
        """
        conversations_list = []
        conversations = Conversation.objects.filter()
        for convo in conversations:
            conversation_id = convo.conversation_id
            convo_dict = convo.to_dict()
            
            try: feedback = Feedback.objects.get(conversation_id=conversation_id)
            except: feedback = None

            if (feedback):
                convo_dict['rating'] = feedback.rating 
                convo_dict['msg'] = feedback.feedback_msg
            
            conversations_list.append(convo_dict)

        return JsonResponse({"conversations": conversations_list})   

class DailyInteractions(APIView):
                
    @swagger_auto_schema(
        operation_summary="Get daily interactions for a course",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester ", type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("start_date", openapi.IN_QUERY, description="Start date", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("end_date", openapi.IN_QUERY, description="End date", type=openapi.TYPE_STRING, required=True),
        ]
    )
    def get(self, request):
        """
        Acquires the daily interactions for a course.
        """
        params = request.query_params
        course = get_course(params)
        start_date = params.get('start_date', '')
        end_date = params.get('end_date', '')
        if (start_date == '' or end_date == ''):
            return JsonResponse({"msg": "Please provide a start date and end date."}, status=status.HTTP_400_BAD_REQUEST)
              
        start_date, end_date = convert_start_end_date(start_date, end_date)
        collection = db["student_conversation"]
        query = daily_interactions_query_pipeline(str(course.course_id), start_date, end_date)
        result = list(collection.aggregate(query))

        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

        for date in date_range:
            date = date.strftime("%Y-%m-%d")
            if (date not in [item['day'] for item in result]):
                result.append({ "day": date, "count": 0 })
        result = sorted(result, key=lambda k: k['day'])
    
        response = { "interactions": result }
        return JsonResponse(response)
    
class UniqueUsersView(APIView):

    @swagger_auto_schema(
        operation_summary="Get unique amount of users logins for a course [Defaulted to Students (ST) only]",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester ", type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Acquires the unique users for a course.
        """
        params = request.query_params
        course = get_course(params)
        user_roles = params.get('user_roles', 'ST,IS,RS,AM')
        user_roles = user_roles.split(',')
        user_roles = GET_COURSE_USER_ROLES(user_roles)
        
        user_ids = []
        for role in user_roles:
            user_ids.extend(getattr(course, role))

        collection = db["users_user"]
        query = unique_users_query_pipeline(user_ids)
        result = list(collection.find(query))
        unique_users = len(result)
        total_users = len(user_ids)
        
        response = {
            "unique_users": unique_users,
            "unique_users_percentage": round((unique_users / total_users) * 100, 2),
            "total_users": total_users,
        }

        return JsonResponse(response)

class SurveyQuestionDistributionView(APIView):

    @swagger_auto_schema(
        operation_summary="Get survey questions for a course",
        responses={200: "Success", 404: "Course not found"},
        manual_parameters=[
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester ", type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("question_id", openapi.IN_QUERY, description="Question ID", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Acquires the survey questions for a course.
        """
        params = request.query_params
        question_id = params.get('question_id', '')
        question = get_object_or_404(SurveyQuestion, question_id=question_id)

        if question.type == 'Pre':
            collection = db["users_user"]
            query = pre_survey_distribution_query_pipeline(question_id, "ST")
            result = list(collection.aggregate(query))

            # Get survey question answer flavor text labels
            answers = {} 
            for ans in question.answers:
                answers[ans["value"]] = ans["text"]
            for ans in result:
                ans['label'] = answers.get(int(ans['answer']), '')

            response = { "question": question.question, "type": question.question_type, "distribution": result }
            return JsonResponse(response)
        
        return JsonResponse({})
    
class AverageConversationResponseRateView(APIView):

    @swagger_auto_schema(
        operation_summary="Get average response rate for a course's conversation",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester ", type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
             openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles", type=openapi.TYPE_STRING),
             openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        """
        Acquires the average response rate for a course's conversation.
        """
        params = request.query_params
        # course = get_course(params)
        user_roles = params.get('user_roles', 'ST,IS,RS,AM')
        user_roles = user_roles.split(',')

        deployment_ids = params.get('deployment_ids', '')
        deployment_ids = deployment_ids.split(',')

        # Find all users with more than one conversation
        # conversations_db = db["users_user"]
        # query = users_with_multiple_query_pipeline()
        # user_ids = [ user['_id'] for user in list(conversations_db.aggregate(query))]

        # Find all students from this list of user_ids
        users = User.objects.filter(user_role__in=user_roles)
        user_ids = [user.user_id for user in users]



        # matching models for deployments
        if deployment_ids: models = GPTModel.objects.filter(deployment_id__in=deployment_ids)
        else: models = GPTModel.objects.all()
        model_ids = [model.model_id for model in models]

        # # Find all conversations from these students
        conversations = Conversation.objects.filter(user_id__in=user_ids, model_id__in=model_ids)

        # # Create buckets for each user_id with their conversations
        buckets = {}
        for convo in conversations:
            if convo.user_id not in buckets:
                buckets[convo.user_id] = []
            buckets[convo.user_id].append(convo)

        # # Sort each bucket by start_time
        for user_id in buckets:
            buckets[user_id] = sorted(buckets[user_id], key=lambda k: k.start_time)

        deltas = []

        # # Find the deltas between every two successive conversations, where first conversation has status 'I'. The delta is the time between the second conversation's start_time and first conversation's end_time
        for user_id in buckets:
            for i in range(len(buckets[user_id]) - 1):
                try:
                    if buckets[user_id][i].status == 'I':
                        delta = buckets[user_id][i + 1].start_time - buckets[user_id][i].end_time
                        if buckets[user_id][i + 1].start_time > buckets[user_id][i].end_time : deltas.append(delta)
                except: pass
        
        # # Find the average delta
        average_delta = sum(deltas, dt.timedelta()) / len(deltas) if len(deltas) > 0 else 0
        result = str(average_delta)

        response = { "average_response_rate": result, "distribution": deltas }
        return JsonResponse(response)

class ConversationPerUserDistributionView(APIView):

    @swagger_auto_schema(
        operation_summary="Get conversation per user distribution for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("course_code", openapi.IN_QUERY, description="Course code", type=openapi.TYPE_STRING),
            openapi.Parameter("semester", openapi.IN_QUERY, description="Semester ", type=openapi.TYPE_STRING),
            openapi.Parameter("course_id", openapi.IN_QUERY, description="Course ID", type=openapi.TYPE_STRING),
            openapi.Parameter("start_date", openapi.IN_QUERY, description="Start date", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("end_date", openapi.IN_QUERY, description="End date", type=openapi.TYPE_STRING, required=True),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        course = get_course(query_params)
        start_date = query_params.get('start_date', '')
        end_date = query_params.get('end_date', '')
        start_date, end_date = convert_start_end_date(start_date, end_date)

        conversations_db = db["student_conversation"]
        query = conversations_per_user_query_pipeline(str(course.course_id), start_date, end_date)
        result = list(conversations_db.aggregate(query))

        if result:
            # Get Min and Max conversation_count
            min_conversation_count = min([item['conversation_count'] for item in result])
            max_conversation_count = max([item['conversation_count'] for item in result])

            # Fill in missing conversation counts
            for i in range(min_conversation_count, max_conversation_count + 1):
                if i not in [item['conversation_count'] for item in result]:
                    result.append({ "conversation_count": i, "user_count": 0 })
        
            # Sort by conversation_count
            result = sorted(result, key=lambda k: k['conversation_count'])

        response = { "distribution": result }
        return JsonResponse(response)

class TotalConversationCountView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', 'ST,IS,RS,AM')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        conversations_db = db["student_conversation"]
        query = total_conversation_count(deployment_ids, user_roles)
        result = list(conversations_db.aggregate(query))
        if (result): result = result[0]['total_conversation_count']
        else: result = 0 

        response = { "total_conversation_count": result}
        return JsonResponse(response)

class TotalChatlogCountView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', 'ST,IS,RS,AM')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        conversations_db = db["student_conversation"]
        query = total_chatlog_count(deployment_ids, user_roles)
        result = list(conversations_db.aggregate(query))
        if (result): result = result[0]['total_user_chatlog_count']
        else: result = 0 
        response = { "total_chatlog_count": result}
        return JsonResponse(response)

class TotalPostSurveyResponseView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', 'ST,IS,RS,AM')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        count = 0

        conversations_db = db["student_conversation"]
        query = total_post_survey_response_count(deployment_ids, user_roles)
        result = list(conversations_db.aggregate(query))
        if result: count = result[0]['total_post_survey_response_count']
        
        response = { "total_responses": count }
        return JsonResponse(response)

class MinMaxChatlogCountView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', 'ST,IS,RS,AM')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        conversations_db = db["student_conversation"]
        query = min_max_chatlog_count(deployment_ids, user_roles)
        result = list(conversations_db.aggregate(query))
        if (result): max, min = result[0]['max'], result[0]['min']
        else: max, min = 0, 0
        response = { "min_chatlog_count": min, "max_chatlog_count": max}
        return JsonResponse(response)

    
# Average amount of chatlogs 
class AverageChatlogCountView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
            ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', '')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        if deployment_ids == ['']: models = GPTModel.objects.all()
        else: models = GPTModel.objects.filter(deployment_id__in=deployment_ids)
        model_ids = [str(model.model_id) for model in models]

        if user_roles == ['']: users = User.objects.all()
        else: users = User.objects.filter(user_role__in=user_roles)
        user_user_ids = [str(user.user_id) for user in users]

        conversations = Conversation.objects.filter(model_id__in=model_ids, user_id__in=user_user_ids)
        
        sum_chatlog = 0
        sum_conversation = len(conversations)
        for c in conversations:
            sum_chatlog += len(c.conversation_log) // 2


        response = { "avg_chatlog_count": round(sum_chatlog / sum_conversation, 2) }
        return JsonResponse(response)
    
class DistinctUserPostSurveyQuestionCountView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', '')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        if deployment_ids == ['']: models = GPTModel.objects.all()
        else: models = GPTModel.objects.filter(deployment_id__in=deployment_ids)
        model_ids = [str(model.model_id) for model in models]

        if user_roles == ['']: users = User.objects.all()
        else: users = User.objects.filter(user_role__in=user_roles)
        user_user_ids = [str(user.user_id) for user in users]

        conversations = Conversation.objects.filter(model_id__in=model_ids, user_id__in=user_user_ids)
        conversation_ids = [str(convo.conversation_id) for convo in conversations]
        
        survey_response = SurveyResponse.objects.filter(conversation_id__in=conversation_ids)
        
        count = 0
        user_ids = []
        for s in survey_response:
            if s.user_id not in user_ids:
                count += 1
                user_ids.append(s.user_id)


        response = { "total": count }
        return JsonResponse(response)
class CorrectAssessmentCountView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', '')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        if deployment_ids == ['']: models = GPTModel.objects.all()
        else: models = GPTModel.objects.filter(deployment_id__in=deployment_ids)
        model_ids = [str(model.model_id) for model in models]

        if user_roles == ['']: users = User.objects.all()
        else: users = User.objects.filter(user_role__in=user_roles)
        user_user_ids = [str(user.user_id) for user in users]

        conversations = Conversation.objects.filter(model_id__in=model_ids, user_id__in=user_user_ids)
        conversation_ids = [str(convo.conversation_id) for convo in conversations]
        
        assessment_responses = AssessmentResponse.objects.filter(conversation_id__in=conversation_ids)
        
        total = len(assessment_responses)
        count = 0
        for s in assessment_responses:
            if s.correct:
                count += 1

        response = { "total": total, "count": count, "percentage": round((count / total) * 100, 2) }
        return JsonResponse(response)

class ChatlogLengthView(APIView):
    
    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
            openapi.Parameter("user_roles", openapi.IN_QUERY, description="User roles (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        user_roles = query_params.get('user_roles', '')
        deployment_ids = deployment_ids.split(',')
        user_roles = user_roles.split(',')

        if deployment_ids == ['']: models = GPTModel.objects.all()
        else: models = GPTModel.objects.filter(deployment_id__in=deployment_ids)
        model_ids = [str(model.model_id) for model in models]

        if user_roles == ['']: users = User.objects.all()
        else: users = User.objects.filter(user_role__in=user_roles)
        user_user_ids = [str(user.user_id) for user in users]

        conversations = Conversation.objects.filter(model_id__in=model_ids, user_id__in=user_user_ids)
        conversation_ids = [str(convo.conversation_id) for convo in conversations]
        
        chatlog = Chatlog.objects.filter(conversation_id__in=conversation_ids)
        
        min, max = 0, 0
        total_chatlogs = 0 
        total_length = 0
        for c in chatlog:
            if c.is_user:
                chatlog_count = len(c.chatlog)
                if chatlog_count < min: min = chatlog_count
                if chatlog_count > max: max = chatlog_count
                total_chatlogs += 1
                total_length += chatlog_count

        response = { "min": min, "max": max, "avg": round(total_length / total_chatlogs, 2), "total": total_length }
        return JsonResponse(response)

class GetSpecificDataView(APIView):
    
    def get(self, request):

        # Update all user ids to strings
        # all_users = list(User.objects.all())
        # for user in all_users:
        #     print(f"Updating {user.utorid} user_id: " + str(user.user_id))
        #     User.objects.filter(utorid=user.utorid).update(user_id=str(user.user_id))

        # Update all chatlog ids to strings
        # print(Chatlog.objects.filter(chatlog_id="d59e3d6b-15e6-45c2-a709-86cbd151934e"))
        # all_chatlogs = list(Chatlog.objects.all())
        # for i, chatlog in enumerate(all_chatlogs):
            # if i > 8296:
                # chatlog_id = str(chatlog.chatlog_id)
                # print(f"[{i}] Updating chatlog_id: {str(chatlog.chatlog_id)} - {chatlog.time}")
                # Chatlog.objects.filter(chatlog_id=chatlog.chatlog_id).update(chatlog_id_str=chatlog_id)
                # chatlogs = Chatlog.objects.filter(chatlog_id_str=chatlog_id).update(chatlog_id=str(chatlog.chatlog_id))
                # print(chatlogs, chatlog.chatlog_id)
                # chatlogs.update(chatlog_id_str=chatlog_id)
                # Chatlog.objects.filter(chatlog_id_str=str(chatlog.chatlog_id)).update(chatlog_id=str(chatlog.chatlog_id))

        # Update all converstion ids to strings
        # all_conversations = list(Conversation.objects.all())
        # for i, convo in enumerate(all_conversations):
        #     print(f"[{i}] Updating conversation_id: " + str(convo.conversation_id))
            # Conversation.objects.filter(conversation_id=convo.conversation_id).update(conversation_id_str=str(convo.conversation_id))
            # Conversation.objects.filter(conversation_id_str=str(convo.conversation_id)).update(conversation_id=str(convo.conversation_id))

        # # Update all courses 
        # all_courses = list(Course.objects.all())
        # for i, course in enumerate(all_courses):
        #     print(f"[{i}] Updating course_id: " + str(course.course_id))
        #     Course.objects.filter(course_id=course.course_id).update(course_id=str(course.course_id))

        # # Update all course deployments
        # all_course_deployments = list(CourseDeployment.objects.all())
        # for i, course_deployment in enumerate(all_course_deployments):
        #     print(f"[{i}] Updating deployment_id: " + str(course_deployment.deployment_id))
        #     CourseDeployment.objects.filter(deployment_id=course_deployment.deployment_id).update(deployment_id=str(course_deployment.deployment_id))

        # Get all conversations of user with utorid = choiman3 with a pipeline
        conversations_db = db["student_conversation"]
        query = [
            {
                "$lookup": {
                    "from": "users_user",
                    "localField": "user_id",
                    "foreignField": "user_id",
                    "as": "user"
                }
            },
            {
                "$match": {
                    "user.utorid": "choiman3"
                }
            },
            {
                #  dont include _id
                "$project": {
                    "_id": 0,
                    "user._id": 0
                }
            }
        ]
        result = list(conversations_db.aggregate(query))
        return JsonResponse({ "result": result})

class ConversationPerModelPerDeploymentView(APIView):

    @swagger_auto_schema(
        operation_summary="Get total conversation count for a course",
        responses={200: "Success", 404: "Conversation not found"},
        manual_parameters=[
            openapi.Parameter("deployment_ids", openapi.IN_QUERY, description="Deployment IDs (Comma-separated)", type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.query_params
        deployment_ids = query_params.get('deployment_ids', '')
        deployment_ids = deployment_ids.split(',')

        conversation_db = db["student_conversation"]
        query = conversation_per_model_per_deployment_query_pipeline(deployment_ids)
        result = list(conversation_db.aggregate(query))        
        
        response = { "total_chatlog_count": result}
        return JsonResponse(response)