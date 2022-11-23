from datetime import date

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

def get_filtered_interactions(course_id, dates):
    """
    Returns a list of interactions of certain <dates> for course <course_id>.
    """
    interactions = []

    # Retrieve all convesrations from the course given the particular datetime
    if dates:
        for _date in dates:
            day, weekday = _date
            
            year_of_day = int(day.year)
            month_of_day = int(day.month)
            day_of_day = int(day.day)
        
            start_date = date(year_of_day, month_of_day, day_of_day)
            
            # Handle offset_date day increment
            try:
                offset_date = date(year_of_day, month_of_day, day_of_day + 1)
            except:
                try:
                    offset_date = date(year_of_day, month_of_day + 1, 1)
                except:
                    offset_date = date(year_of_day + 1, 1, 1)
            
            convos = Conversation.objects.filter(
                    course_id=course_id
                ).filter(
                    start_time__gte=start_date
                ).filter(
                    start_time__lt=offset_date
                )
            
            day_f = day.strftime('%Y-%m-%d')
            interactions.append((day_f, weekday, len(convos)))

    return interactions