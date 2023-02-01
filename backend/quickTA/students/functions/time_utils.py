import calendar
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from ..models import Course
from django.utils.timezone import now

def get_dates(course_id, view, timezone):
    """
    Returns the particular date given a particular filter <view>
    in timezone <timezone>.
    """
    if view == 'Weekly':
        return get_weekly_time(timezone)
    if view == 'Monthly':
        return get_monthly_time(timezone)
    if view == 'All':
        return get_all_time(course_id, timezone)
    return None

def get_all_dates(course_id, view, timezone):
    if view == 'Weekly':
        return get_weekly_times(timezone)
    if view == 'Monthly':
        return get_monthly_times(timezone)
    if view == 'All':
        return get_all_times(course_id, timezone)
    return None

def get_all_time(course_id, timezone):
    """
    Returns the datetime of the starting to the current date, 
    with a maximum ending date given by the ending time of the course's lifespan
    given a particular <timezone>. 

    Parameters:
    - course_id: course UUID
    - timezone: (ie. America/Toronto)
    """
    tz = ZoneInfo(timezone)

    # Acquire the start date and end date of the particular course
    course = Course.objects.get(course_id=course_id)
    start_date = course.start_date
    end_date = course.end_date

    # Check for lower bound date
    curr_date = now()
    if curr_date < end_date:
        end_date = curr_date

    # Fix the start and end date's timezones
    start_date = start_date.astimezone(tz)
    end_date = end_date.astimezone(tz)
    return start_date, end_date


def get_weekly_time(timezone):
    """
    Returns the datetime 7 days ago, and the current datetime 
    of a particular timezone <timezone>.
    
    Parameters: 
    - timezone (ie. America/Toronto)
    """
    tz = ZoneInfo(timezone)
    
    t1 = datetime.now() + timedelta(days=-6)
    t1 = t1.replace(hour=0, minute=0, second=0, microsecond=0)
    t1 = t1.astimezone(tz)
    
    t2 = datetime.now() + timedelta(days=+1)
    t2 = t2.replace(hour=0, minute=0, second=0, microsecond=0)
    t2 = t2.astimezone(tz)
    # print("\033[32m", t1,t2, '\033[0m')
    return t1, t2

def get_monthly_time(timezone):
    """
    Returns the datetime of a particular timezone <timezone>
    starting from this month and the first day of next month
    
    Parameters: 
    - timezone (ie. America/Toronto)
    """
    tz = ZoneInfo(timezone)

    t1 = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Wraps December around to Jan
    next_month = t1.month + 1
    if (t1.month + 1 > 12):
        next_month = 1
        next_year = t1.year + 1
        t2 = t1.replace(year=next_year, month=next_month)
    
    t1 = t1.astimezone(tz)
    t2 = t2.astimezone(tz)
    
    
    return t1, t2

def get_all_times(course_id, timezone):
    """
    Returns each specific day of the course's lifespan, as well as th
    weekday in ascending order from the earliest day.
    
    Parameters:
    - course_id     Course UUID
    - timezone      Timezone
    """
    tz = ZoneInfo(timezone)
    all_dates = []

    # Acquire start date and end date
    course = Course.objects.get(course_id=course_id)
    start_date = course.start_date
    end_date = course.end_date

    # Set current date as the lower bound of the aggregated view
    curr_date = now()
    if curr_date < end_date:
        end_date = curr_date

    # Count how many days are in between start date and end date
    total_num_dates = end_date - start_date

    for day in range(total_num_dates.days):
        t1 = start_date + timedelta(days=day+1)
        t2 = t1.astimezone(tz)

        weekday = get_weekday_name(t2.weekday())
        all_dates.append((t2, weekday))
    return all_dates

def get_weekly_times(timezone):
    """
    Returns each specific day of the last 7 days, as well as the
    weekday in ascending order from the earliest day

    Parameters:
    - timezone (ie. America/Toronto)

    Return:
    ie. [('2022-11-15 10:48:18', 'Tuesday'), ... ]
    """
    tz = ZoneInfo(timezone)
    week = []
    for day in range(7):
        t1 = datetime.now() + timedelta(days=-6+day)
        t2 = t1.astimezone(tz)
        # print("\033[32m", t2, '\033[0m')
        weekday = get_weekday_name(t2.weekday())
        week.append((t2, weekday))
    return week

def get_monthly_times(timezone):
    """
    Returns each specific day of the last 7 days, as well as the
    weekday in ascending order from the earliest day

    Parameters:
    - timezone (ie. America/Toronto)

    Return:
    ie. [('2022-11-15 10:48:18', 'Tuesday'), ... ]
    """
    tz = ZoneInfo(timezone)
    month_dates = []

    today = datetime.now()
    year = today.year
    month = today.month    

    days_in_month = calendar.monthrange(year, month)[1]

    for day in range(1, days_in_month + 1):
        t1 = datetime.now().replace(day=day)
        t2 = t1.astimezone(tz)
        weekday = get_weekday_name(t2.weekday())
        month_dates.append((t2, weekday))
    return month_dates

def get_weekday_name(weekday):
    """
    Get the weekday string given the weekday number
    """
    if weekday == 0: return "Monday"
    if weekday == 1: return "Tuesday"
    if weekday == 2: return "Wednesday"
    if weekday == 3: return "Thursday"
    if weekday == 4: return "Friday"
    if weekday == 5: return "Saturday"
    if weekday == 6: return "Sunday"

# print(get_weekly_time("America/Toronto"))
# print(get_monthly_time("America/Toronto"))
# print(get_weekly_times("America/Toronto"))
# print(get_monthly_times("America/Toronto"))


# print(get_all_dates('Weekly', 'America/Toronto'))

# import calendar
# for i in range(5):
#     s = calendar.monthrange(2022+i, 2)
    # print(s)