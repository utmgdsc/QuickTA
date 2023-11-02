from datetime import datetime 

JOIN_COURSE_DEPLOYMENT_BY_COURSE_ID = {
    'from': 'course_coursedeployment',
    'localField': 'course_id',
    'foreignField': 'course_id',
    'as': 'course_deployment'
}

JOIN_USER_BY_USER_ID = {
    'from': 'users_user', 
    'localField': 'user_id',
    'foreignField': 'user_id',
    'as': 'user_data'
}

JOIN_CHATLOG_BY_CONVERSATION_ID = {
    'from': 'student_chatlog', 
    'localField': 'conversation_id', 
    'foreignField': 'conversation_id', 
    'as': 'chatlogs'
}

JOIN_MODEL_BY_MODEL_ID = { 
    'from': 'models_gptmodel',  
    'localField': 'model_id',
    'foreignField': 'model_id',
    'as': 'model_data' 
}   

JOIN_SURVEY_RESPONSE_BY_CONVERSATION_ID = {
    'from': 'survey_surveyresponse',
    'localField': 'conversation_id',
    'foreignField': 'conversation_id',
    'as': 'survey_questions'
}

JOIN_CONVERSATION_BY_USER_ID = {
    'from': 'student_conversation',
    'localField': 'user_id',
    'foreignField': 'user_id',
    'as': 'conversations'
}

def GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles):
    pipeline = []
    if (deployment_ids):
        pipeline.extend([
            { '$lookup': JOIN_MODEL_BY_MODEL_ID },
            { '$match': { 'model_data.deployment_id': {'$in': deployment_ids} } },
        ])
    if (user_roles):
        pipeline.extend([
            { '$lookup': JOIN_USER_BY_USER_ID },
            { '$match': { 'user_data.user_role': {'$in': user_roles} } },
        ])
    return pipeline

def daily_interactions_query_pipeline(course_id, start_date, end_date):

    return [
        { "$match": { "course_id": course_id, "start_time": {"$gte":start_date, "$lte": end_date} } },
        { "$project": { "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$start_time" } } } },
        { "$group": { "_id": "$date", "count": {"$sum": 1} } },
        { "$project": { "day": "$_id", "count": 1, "_id": 0 } },  
        { "$sort": { "day": 1 } }
    ]

def unique_users_query_pipeline(user_ids):

    return {
            "$and": [
                { "user_id": { "$in": user_ids } },
                { "new_user": False }
            ]
    }

def pre_survey_distribution_query_pipeline(question_id, user_role):
    return [
        { '$match': { 'user_role': user_role, 'pre_survey.question_id': question_id } },
        { '$unwind': '$pre_survey' },
        { '$match': { 'pre_survey.question_id': question_id } },
        { '$group': { '_id': '$pre_survey.answer', 'count': {'$sum': 1} } },
        { '$project': { 'answer': '$_id', 'count': 1, '_id': 0 } },
        { '$sort': { 'answer': 1 } }
    ]

def total_chatlog_count(deployment_ids, user_roles):
    return [
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$lookup': JOIN_CHATLOG_BY_CONVERSATION_ID }, 
        { '$addFields': { 'total_chatlogs': { '$size': '$chatlogs' } } }, 
        { '$unwind': { 'path': '$chatlogs',  'preserveNullAndEmptyArrays': True } }, 
        { '$match': { 'chatlogs.is_user': True } }, 
        { '$group': { '_id': '$_id', 'total_user_chatlogs': { '$sum': 1 } } }, 
        { '$group': {  '_id': None, 'total_user_chatlog_count': {'$sum': '$total_user_chatlogs'} } }
    ]

def total_conversation_count(deployment_ids, user_roles):
    return [
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$group': { '_id': '$conversation_id', 'count': {'$sum': 1} } },
        { '$group': { '_id': None, 'total_conversation_count': {'$sum': 1} } }
    ]

def min_max_chatlog_count(deployment_ids, user_roles):
    return [
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$lookup': JOIN_CHATLOG_BY_CONVERSATION_ID }, 
        { '$addFields': { 'total_chatlogs': { '$size': '$chatlogs' } } }, 
        { '$unwind': { 'path': '$chatlogs',  'preserveNullAndEmptyArrays': True } }, 
        { '$match': { 'chatlogs.is_user': True } }, 
        { '$group': { '_id': '$_id', 'total_user_chatlogs': { '$sum': 1 } } }, 
        { '$group': { '_id': None, 'min': {'$min': '$total_user_chatlogs'}, 'max': {'$max': '$total_user_chatlogs'} } }
    ]

def avg_chatlog_count(deployment_ids, user_roles):
    return [
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$lookup': JOIN_CHATLOG_BY_CONVERSATION_ID }, 
        { '$addFields': { 'total_chatlogs': { '$size': '$chatlogs' } } }, 
        { '$unwind': { 'path': '$chatlogs',  'preserveNullAndEmptyArrays': True } }, 
        { '$match': { 'chatlogs.is_user': True } }, 
        { '$group': { '_id': '$_id', 'total_user_chatlogs': { '$sum': 1 } } }, 
        { '$group': { '_id': None, 'avg': {'$avg': '$total_user_chatlogs'} } }
    ]   

def total_post_survey_response_count(deployment_ids, user_roles):
    return [
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$lookup': JOIN_SURVEY_RESPONSE_BY_CONVERSATION_ID },
        { '$unwind': { 'path': '$survey_questions',  'preserveNullAndEmptyArrays': True } },
        { '$match': { 'survey_questions.type': 'Post' } },
        { '$group': { '_id': '$conversation_id', 'count': {'$sum': 1} } },
        { '$group': { '_id': None, 'total_post_survey_response_count': {'$sum': 1} } }
    ]

def average_conversation_response_rate(deployment_ids, user_roles):
    return [   
        *GET_MATCHING_CONVERSATIONS(deployment_ids, user_roles),
        { '$group': { '_id': '$user_id', 'conversations': { '$push': { 'start_time': '$start_time', 'end_time': '$end_time', 'status': '$status', 'forced_inactive': '$forced_inactive'  } } } },
        
    ]

def users_with_multiple_query_pipeline():
    return [ 
        { '$group': { '_id': '$user_id', 'count': {'$sum': 1} } },
        { '$match': { 'count': {'$gt': 1} } },
        { '$project': { '_id': 1 } }  # Select the user_id with more than one conversation }
    ]

def user_ids_match_user_role(user_ids, user_role):
    return [
        { '$match': { 'user_id': { '$in': user_ids }, 'user_role': user_role } },
        { '$project': { 'user_id': 1 } }
    ]

def conversations_per_user_query_pipeline(course_id, start_date, end_date):
    return [
        { '$match': { 'course_id': course_id, 'start_time': {'$gte': start_date, '$lte': end_date} } },
        { '$group': { '_id': '$user_id', 'conversation_count': {'$sum': 1} } },
        { '$group': { '_id': '$conversation_count', 'user_count': {'$sum': 1} } },
        { '$project': { '_id': 0, 'conversation_count': '$_id', 'user_count': 1 } },
        { '$sort': { 'conversation_count': 1 } }
    ]

def total_conversation_count_query_pipeline(deployment_ids, user_roles):
    return [
        { '$lookup': {
                'from': 'models_gptmodel',  # Collection name to join with
                'localField': 'model_id',
                'foreignField': 'model_id',
                'as': 'model_data' }   # Alias for the joined model data
        },
        { '$unwind': '$model_data' },  # Unwind the model_data array (if present)
        { '$match': { 'model_data.deployment_id': {'$in': deployment_ids} } },
        # {  '$lookup': {
        #         'from': 'users_user',  # Collection name to join with
        #         'localField': 'user_id',
        #         'foreignField': 'user_id',
        #         'as': 'user_data' }  # Alias for the joined user data
        # },
        # { '$unwind': '$user_data' },  # Unwind the user_data array (if present)
        # { '$match': { 'user_data.user_role': {'$in': user_roles} } },
        # { '$group': { '_id': '$user_data.user_role', 'conversation_count': {'$sum': 1} } }
    ]


def conversation_per_model_per_deployment_query_pipeline(deployment_ids):
    return [
        { '$lookup': JOIN_COURSE_DEPLOYMENT_BY_COURSE_ID },
        { '$unwind': '$course_deployment' },
        { '$match': { 'course_deployment.deployment_id': {'$in': deployment_ids} } },
        { '$group': { 
            '_id': { 'deployment_id': '$course_deployment.deployment_id', 'model_id': '$model_id' },
            'conversation_count': { '$sum': 1 }
        } },
        { '$group': { 
            '_id': '$_id.deployment_id',
            'distribution': { '$push': { 'model_id': '$_id.model_id', 'conversation_count': '$conversation_count' } }
        } },
        { '$project': { '_id': 0, 'course_deployment_id': '$_id', 'distribution': 1 } }

    ]