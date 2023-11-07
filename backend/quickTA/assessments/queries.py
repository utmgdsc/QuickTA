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

def get_assessment_questions(conversation_id):
    return [
    { '$match': { 'conversation_id': conversation_id } }, 
    { '$lookup': {
        'from': 'models_gptmodel', 
        'localField': 'model_id', 
        'foreignField': 'model_id', 
        'as': 'model_data'
    }}, 
    { '$project': { 'model_data.deployment_id': 1,  'deployment_id': '$model_data.deployment_id' }}, 
    { '$unwind': { 'path': '$deployment_id' }}, 
    { '$lookup': {
        'from': 'course_coursedeployment', 
        'localField': 'deployment_id', 
        'foreignField': 'deployment_id', 
        'as': 'course_deployment'
    }}, 
    { '$unwind': { 'path': '$course_deployment' }}, 
    { '$project': { 'assessment_ids': '$course_deployment.assessment_ids' }}, 
    { '$unwind': { 'path': '$assessment_ids' }}, 
    { '$project': { 'assessment_id': '$assessment_ids.assessment_id' }}, 
    { '$lookup': {
        'from': 'assessments_assessment', 
        'localField': 'assessment_id', 
        'foreignField': 'assessment_id', 
        'as': 'assessment'
    }}, 
    { '$unwind': { 'path': '$assessment' }}, 
    { '$project': { 'questions': '$assessment.question_bank' }}, 
    { '$unwind': { 'path': '$questions', 'includeArrayIndex': 'question_number'}}, 
    { '$lookup': {
            'from': 'assessments_assessmentquestion', 
            'localField': 'questions', 
            'foreignField': 'assessment_question_id', 
            'as': 'question'
    }}, 
    { '$unwind': { 'path': '$question' }}, 
    { '$project': { 'question._id': 0,  '_id': 0,  'questions': 0 }}
]

