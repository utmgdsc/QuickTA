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

JOIN_SURVEY_RESPONSE_BY_CONVERSATION_ID = {
    'from': 'survey_surveyresponse',
    'localField': 'conversation_id',
    'foreignField': 'conversation_id',
    'as': 'survey_questions'
}

def get_conversation_survey_questions(conversation_id, survey_types):
    if not(survey_types): survey_types = ['Pre', 'Post']
    return [
    {
        '$match': {
            'conversation_id': conversation_id
        }
    }, {
        '$lookup': {
            'from': 'models_gptmodel', 
            'localField': 'model_id', 
            'foreignField': 'model_id', 
            'as': 'model'
        }
    }, {
        '$lookup': {
            'from': 'course_coursedeployment', 
            'localField': 'model.deployment_id', 
            'foreignField': 'deployment_id', 
            'as': 'deployment'
        }
    }, {
        '$project': {
            'survey_ids': '$deployment.survey_ids'
        }
    }, {
        '$unwind': {
            'path': '$survey_ids'
        }
    }, {
        '$unwind': {
            'path': '$survey_ids'
        }
    }, {
        '$match': {
            'survey_ids.survey_type': {
                '$in': survey_types
            }
        }
    }, {
        '$lookup': {
            'from': 'survey_survey', 
            'localField': 'survey_ids.survey_id', 
            'foreignField': 'survey_id', 
            'as': 'survey'
        }
    }, {
        '$project': {
            'survey.ordering': 1, 
            'survey_id': '$survey_ids.survey_id'
        }
    }, {
        '$unwind': {
            'path': '$survey'
        }
    }, {
        '$unwind': {
            'path': '$survey.ordering', 
            'includeArrayIndex': 'ordering'
        }
    }, {
        '$lookup': {
            'from': 'survey_surveyquestion', 
            'localField': 'survey.ordering', 
            'foreignField': 'question_id', 
            'as': 'question'
        }
    }, {
        '$unwind': {
            'path': '$question'
        }
    }, {
        '$addFields': {
            'question.survey_id': '$survey_id'
        }
    }, {
        '$project': {
            'question': 1, 
            'ordering': 1, 
            '_id': 0
        }
    }, {
        '$project': {
            'question._id': 0
        }
    }
]

