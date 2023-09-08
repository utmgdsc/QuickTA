import time
from datetime import datetime
from zoneinfo import ZoneInfo
from pymongo import MongoClient

from student.models import Conversation


# Constants
OPERATION_SUCCESSFUL = True
OPERATION_FAILED = False

OBJECT_EXISTS = True
OBJECT_DOES_NOT_EXIST = False

# Database information
CLUSTER = "quickTA"
STUDENT_COLLECTION = "students_user"
COURSE_COLLECTION = "students_course"
CONVERSATION_COLLECTION = "students_conversation"
GPTMODEL_COLLECITON = "students_gptmodel"


def get_cluster():
    # cluster = MongoClient('mongodb+srv://admin:cEWQJjkyDAracCLY@quickta.dmbx3ix.mongodb.net/?retryWrites=true&w=majority')
    cluster = MongoClient('mongodb+srv://admin:admin@cluster0.qatcnyw.mongodb.net/?retryWrites=true&w=majority')
    return cluster

def get_conversation_cluster():
    """
    Returns a Cursor item fo the Conversation Cluster.
    """
    cluster = get_cluster()
    conversation = cluster[CLUSTER][CONVERSATION_COLLECTION]
    return conversation

def get_conversation_chatlog(conversation_id: str) -> str:
    """
    Acquires a copy of all of the chatlogs from the provided <conversation_id>
    """
    convo_cluster = get_conversation_cluster()
    convo = convo_cluster.find({"conversation_id": conversation_id})
    convo = list(convo)[0]
    if "gpt_chatlog" in convo.keys():
        return convo["gpt_chatlog"]
    return ""

def post_conversation_chatlog(conversation_id: str, chatlog_history: str) -> str:
    """
    Posts all <chatlog_history> OpenAI text prompt to the 
    corresponding Conversation given the <conversation_id> 
    """
    try:
        convos = get_conversation_cluster()

        convos.update_one(
            {"conversation_id": conversation_id},
            {"$set": { "gpt_chatlog" : chatlog_history}}
        )
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def get_filtered_convos(course_id, view, timezone):
    """
    Returns a list of convo_ids of course <course_id> with a specific
    filter <view> in the given time format <timezone>.
    """

    start_date, end_date = time_utils.get_dates(course_id, view, timezone)

    # Retrieve all convesrations from the course given the particular datetime
    if start_date and end_date:
        
        convos = Conversation.objects.filter(
                course_id=course_id
            ).filter(
                start_time__gte=start_date
            ).filter(
                start_time__lt=end_date
            )
    else:
        convos = Conversation.objects.filter(course_id=course_id)
    return convos

def get_filtered_interactions(course_id, dates, timezone):
    """
    Returns a list of interactions of certain <dates> for course <course_id>.
    """
    interactions = []
    tz = ZoneInfo(timezone)
    # Retrieve all convesrations from the course given the particular datetime
    convos_cluster = get_conversation_cluster()

    if dates:
        total = 0
        for _date in dates:
            day, weekday = _date
            
            year_of_day = int(day.year)
            month_of_day = int(day.month)
            day_of_day = int(day.day)
        
            start_date = datetime(year_of_day, month_of_day, day_of_day, tzinfo=tz)
            
            # Handle offset_date day increment
            try:
                offset_date = datetime(year_of_day, month_of_day, day_of_day + 1, tzinfo=tz)
                
            except:
                try:
                    offset_date = datetime(year_of_day, month_of_day + 1, 1, tzinfo=tz)
                except:
                    offset_date = datetime(year_of_day + 1, 1, 1, tzinfo=tz)
            
           
            convos = Conversation.objects.filter(
                    course_id=course_id
                ).filter(
                    start_time__gte=start_date
                ).filter(
                    start_time__lt=offset_date
                )
            count = convos.count()
            
            day_f = day.strftime('%Y-%m-%d')
            
            interactions.append((day_f, weekday, count))

    return interactions