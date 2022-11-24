import time
from datetime import date
from zoneinfo import ZoneInfo

from . import time_utils
from ..models import *

def get_filtered_convos(course_id, view, timezone):
    """
    Returns a list of convo_ids of course <course_id> with a specific
    filter <view> in the given time format <timezone>.
    """

    start_date, end_date = time_utils.get_dates(view, timezone)

    # Retrieve all convesrations from the course given the particular datetime
    if start_date and end_date:
        
        start = time.time()
        convos = Conversation.objects.filter(
                course_id=course_id
            ).filter(
                start_time__gte=start_date
            ).filter(
                start_time__lt=end_date
            )
        end = time.time()
        print("Time elapsed (Conversation filtering):", (end-start) * 1000)

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
            
            day_f = day.strftime('%Y-%m-%d')
            
            start = time.time()
            interactions.append((day_f, weekday, len(convos)))
            end = time.time()
            print("Time elapsed (Date [" + str(day_of_day) + "])", (end-start) * 1000)
            total += end-start
        print("Time elapsed (Date)", total * 1000)

    return interactions