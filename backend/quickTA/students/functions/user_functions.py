from ..database import connect
from . import course_functions

OPERATION_SUCCESSFUL = True
OPERATION_FAILED = False

def add_user_to_course(user_id, course_id):
    """
    Adds the course to the user's accessibility rights.
    Returns True if user successfully adds the course_id to the user.
    Otherwise, returns False.
    
    Parameters:
    - user_id : user UUID
    - course_id: course UUID
    """
    try:
        # Acquiring user collection
        cluster = connect.get_cluster()
        users = cluster["quickTA"]["students_user"]
        user = list(users.find({"user_id" : user_id}))[0]

        # Ensure course exists
        course = course_functions.get_course_existence(course_id)
        if not(course):
            return OPERATION_FAILED

        # Adding course to user's course list
        course_ls = []
        if 'courses' in user.keys():
            course_ls = user['courses'][:]
            if course_id not in course_ls:
                course_ls.append(course_id)
                
        # Create course list if course does not exist
        else:
            course_ls = [course_id]
        
        # Update user's course list
        users.update_one(
            {"user_id" : user_id},
            {"$set": { "courses" : course_ls }}
        )
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED