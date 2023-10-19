from datetime import datetime 

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
            "$or": [
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

def users_with_multiple_query_pipeline():
    # return [
    #     { '$match': { 'course_id': course_id } },
    #     { '$sort': { 'user_id': 1, 'start_time': 1 } },
    #     { '$group': { '_id': '$user_id', 'conversations': { '$push': { 'start_time': '$start_time', 'end_time': '$end_time', 'status': '$status' } } } },
    #     { '$unwind': { 'path': '$conversations', 'includeArrayIndex': 'index' } },
    #     { '$project': { 'user_id': '$_id', 'conversation': '$conversations', 'nextConversation': { '$arrayElemAt': ['$conversations', {'$add': ['$index', 1]}] } } },
    #     { '$match': {'conversation.status': 'I', 'nextConversation': {'$ne': None}, 
    #                  '$expr': { '$gte': [ {'$subtract': ['$nextConversation.start_time', '$conversation.end_time']}, 0 ] }}
    #     },
    #     { '$group': { '_id': '$user_id', 
    #                   'totalDelta': { '$sum': { '$subtract': ['$nextConversation.start_time', '$conversation.end_time'] } }, 
    #                   'count': {'$sum': 1}
    #                 }
    #     },
    #     { '$project': { '_id': 0, 'user_id': '$_id', 
    #                    'averageResponseRate': { '$divide': ['$totalDelta', '$count'] } }
    #     }
    # ]
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
