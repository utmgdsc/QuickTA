from ..database import connect
from . import course_functions
from ..models import *

# Constants
OPERATION_SUCCESSFUL = True
OPERATION_FAILED = False
OBJECT_EXISTS = True
OBJECT_DOES_NOT_EXIST = False

CLUSTER = "quickTA"
COURSE_COLLECTION = "students_course"

def update_course_students_list(course_id, user_id):
    """
    Adds the user into the course's list of students.
    Returns True if user is successfully appended into the course's list.
    Otherwise, returns false.

    Parameters:
    - user_id : user UUID
    - course_id: course UUID
    """
    try:
        # Acquiring course collection
        cluster = connect.get_cluster()
        courses = cluster[CLUSTER][COURSE_COLLECTION]
        course = list(courses.find({"course_id" : course_id}))
        
        if len(course) == 0:
            return OPERATION_FAILED
        
        # Adding user to course's users list
        course = course[0]
        user_ls = []
        if 'users' in course.keys():
            user_ls = course['users'][:]
            if user_id not in user_ls:
                user_ls.append(user_id)
        else:
            user_ls = [user_id]

        # Update course's user list
        courses.update_one(
            {"course_id": course_id},
            {"$set": { "users" : user_ls }}
        )

        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def get_course_existence(course_id):
    """
    Returns whether a course exists by its given <course_id>
    """
    try:
        if len(Course.objects.filter(course_id=course_id)) == 0:
            return OBJECT_DOES_NOT_EXIST
        return OBJECT_EXISTS
    except:
        return OBJECT_DOES_NOT_EXIST