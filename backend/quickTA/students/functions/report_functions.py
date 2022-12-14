from . import time_utils

from ..models import *
from ..constants import *

def get_filtered_convos(course_id, view, timezone):
    """
    Returns a list of convo_ids of course <course_id> with a specific
    filter <view> in the given time format <timezone>.
    """
    start_date, end_date = time_utils.get_dates(course_id, view, timezone)
    if start_date and end_date:
        reported_convos = Report.objects.filter(
                course_id=course_id
            ).filter(
                status='O'
            ).filter(
                time__gte=start_date
            ).filter(
                time__lt=end_date
            ).order_by('-time')
    else:
        reported_convos = Report.objects.filter(course_id=course_id).filter(status='O').order_by('-time')
    
    return reported_convos

def resolve_conversation(convo_id):
    """
    Resolves an active reported conversation <convo_id>.
    """

    convo = Report.objects.filter(conversation_id=convo_id)
    if len(convo) == 0:
        return OPERATION_FAILED
    
    convo = Report.objects.filter(conversation_id=convo_id).update(
        status='C'
    )
    return OPERATION_SUCCESSFUL
