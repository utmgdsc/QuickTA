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
            
            # Create the csv 
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="ratings.csv"'
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
            most_common_words = generate_wordcloud(sentences)

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