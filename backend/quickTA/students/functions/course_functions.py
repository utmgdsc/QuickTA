from ..database import connect
from . import course_functions
from ..models import *
from ..constants import *

def get_course_cluster():
    """
    Returns a Cursor item of the Course Cluster.
    """
    cluster = connect.get_cluster()
    courses = cluster[CLUSTER][COURSE_COLLECTION]
    return courses

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
        courses = get_course_cluster()
        course = list(courses.find({"course_id" : course_id}))
        
        if len(course) == 0:
            return OPERATION_FAILED
        
        # Adding user to course's students list
        course = course[0]
        user_ls = []
        if 'users' in course.keys():
            user_ls = course['users'][:]
            if user_id not in user_ls:
                user_ls.append(user_id)
        else:
            user_ls = [user_id]

        # Update course's students list
        courses.update_one(
            {"course_id": course_id},
            {"$set": { "users" : user_ls }}
        )

        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def remove_course_students_list(course_id, user_id):
    """
    Removes a user from the course's list of students.
    Returns True if the user is successfully removed from the course list.
    Otherwise, returns false.

    Parameters:
    - course_id: Course UUID
    - user_id: User UUID
    """
    try:
        # Acquiring course collection
        courses = get_course_cluster()
        course = list(courses.find({"course_id": course_id}))

        if len(course) == 0:
            return OPERATION_FAILED
        
        course = course[0]
        user_ls = []
        if 'users' in course.keys():
            user_ls = course['users'][:]
            user_ls.remove(user_id)
        
        # Update course's students list
        courses.update_one(
            {"course_id": course_id},
            {"$set": { "users": user_ls}}
        )
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED
