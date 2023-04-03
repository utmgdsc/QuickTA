import uuid

from ..models import User
from ..database import connect
from . import course_functions
from typing import Dict
from ..constants import * 

def acquire_user_cluster():
    """
    Returns a Cursor item of the User Cluster.
    """
    cluster = connect.get_cluster()
    users = cluster[CLUSTER][STUDENT_COLLECTION]
    return users

def acquire_user(user_id: str) -> Dict[str, str]:
    """
    Acquires a dictionary containing the information regarding a user.

    Parameter:
    - user_id: user UUID
    """
    cluster = connect.get_cluster()
    users = cluster["quickTA"]["students_user"]
    user = list(users.find({"user_id" : user_id}))[0]
    return user

def create_user(data: Dict[str, str]):
    """
    Creates a user based on the given information.
    
    Parameters:
    - data:
    """
    user_id = str(uuid.uuid4())
    data['user_id'] = user_id
            
    utorid = User.objects.filter(utorid=data['utorid'])
    if (len(utorid) != 0):
        return OPERATION_FAILED

    # Save newly created user
    user = User(
        user_id=data['user_id'],
        name=data['name'],
        utorid=data['utorid'],
        user_role=data['user_role']                
    )
    user.save()

    response = {
        "user_id": user.user_id,
        "name": user.name,
        "utorid": user.utorid,
        "user_role": user.user_role
    }
    return response

def get_user_courses(user_id: str):
    """
    Returns a list of the user's courses in course ids
    """
    try:  
        users = acquire_user_cluster()
        user = list(users.find({"user_id" : user_id}))[0]
        return user['courses']
    except:
        return OPERATION_FAILED

def add_user_to_course(user_id: str, course_id: str) -> bool:
    """
    Adds the course to the user's accessibility rights.
    Returns True if user successfully adds the course_id to the user.
    Otherwise, returns False.
    
    Parameters:
    - user_id : user UUID
    - course_id: course UUID
    """
    # try:
    # Acquiring user collection
    users = acquire_user_cluster()
    user = list(users.find({"user_id" : user_id}))
    if len(user) == 0:
        return OPERATION_FAILED
    user = user[0]

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
    print(course_ls)
    # Update user's course list
    users.update_one(
        {"user_id" : user_id},
        {"$set": { "courses" : course_ls }}
    )
    return OPERATION_SUCCESSFUL
    # except:
    #     return OPERATION_FAILED

def remove_user_from_course(user_id: str, course_id: str) -> bool:
    """
    Removes the user's accessibility rights of a certain course.
    Returns True if user is successfully revoked of the accessibility right to
    the course <course_id>, otherwise return False.

    Parameters: 
    - user_id: user UUID
    - course_id: course UUID
    """
    # try:
    # Acquiring user collection
    users = acquire_user_cluster()
    user = list(users.find({"user_id" : user_id}))[0]

    # Ensure course exists
    course = course_functions.get_course_existence(course_id)
    if not(course):
        return OPERATION_FAILED

    # Remove student 
    course_ls = []
    if 'courses' in user.keys():
        course_ls = user['courses'][:]
        course_ls.remove(course_id)
    
    # Update users's course list
    users.update_one(
        {"user_id" : user_id},
        {"$set": { "courses" : course_ls }}
    )
    return OPERATION_SUCCESSFUL
    # except:
    #     return OPERATION_FAILED

def get_user_info(user_id):
    """
    Acquires a user's information given their <user_id>.
    """
    user = User.objects.filter(user_id=user_id)
    if len(user) == 0:
        return OPERATION_FAILED
    
    user = user[0]
    ret = {
        "user_id": user.user_id,
        "name": user.name,
        "utorid": user.utorid,
        "user_role": user.user_role
    }
    return ret

def get_users_info(users):
    """
    Acquires all users' information in a given list of <users>
    which contain their user_ids.
    """
    response = []
    for user in users:
        user_data = get_user_info(user)
        if not(user_data):
            return OPERATION_FAILED
        response.append(user_data)
    return response
