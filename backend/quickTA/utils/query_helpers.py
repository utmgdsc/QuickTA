from utils.constants import *

def GET_COURSE_USER_ROLES(user_roles):
    """
    Returns a list of user roles that are valid for a course
    """
    return [f"{COURSE_ROLE_MAP[role]}" for role in user_roles]