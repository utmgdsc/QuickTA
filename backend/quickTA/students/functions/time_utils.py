from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

def get_dates(view, timezone):
    """
    Returns the particular date given a particular filter <view>
    in timezone <timezone>.
    """
    if view == 'Weekly':
        return get_weekly_time(timezone)
    if view == 'Monthly':
        return get_monthly_time(timezone)
    return None

def get_all_dates(view, timezone):
    if view == 'Weekly':
        return get_weekly_times(timezone)
    if view == 'Monthly':
        return get_monthly_times(timezone)
    return None

def get_weekly_time(timezone):
    """
    Returns the datetime of a particular timezone <timezone> 
    7 days ago.
    
    Parameters: 
    - timezone (ie. America/Toronto)
    """
    tz = ZoneInfo(timezone)
    t1 = datetime.now() + timedelta(days=-7)
    print(t1.strftime('%Y-%m-%d %H:%M:%S'))
    t2 = t1.astimezone(tz)
    return t2 

def get_monthly_time(timezone):
    """
    Returns the datetime of a particular timezone <timezone>
    7 days ago.
    
    Parameters: 
    - timezone (ie. America/Toronto)
    """
    tz = ZoneInfo(timezone)
    t1 = datetime.now() + timedelta(days=-30)
    t2 = t1.astimezone(tz)
    return t2 

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
        t1 = datetime.now() + timedelta(days=-7+day)
        t2 = t1.astimezone(tz)
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
    week = []
    for day in range(30):
        t1 = datetime.now() + timedelta(days=-30+day)
        t2 = t1.astimezone(tz)
        weekday = get_weekday_name(t2.weekday())
        week.append((t2, weekday))
    return week

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