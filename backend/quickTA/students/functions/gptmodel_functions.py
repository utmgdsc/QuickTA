import uuid
from ..models import GPTModel
from ..constants import *
from ..database import connect
from . import course_functions

GPTMODEL_KEYS = {
    "model_id",
    "model_name",
    "course_id",

    "model",
    "prompt",
    "suffix",
    "max_tokens",
    "temperature",
    "top_p",
    "n",
    "stream",
    "logprobs",
    "presence_penalty",
    "frequency_penalty",
    "best_of"
}


def acquire_gptmodel_cluster():
    """
    Returns a Cursor item of the User Cluster.
    """
    cluster = connect.get_cluster()
    gptmodels = cluster[CLUSTER][GPTMODEL_COLLECITON]
    return gptmodels

def get_model_existence(model_id):
    """
    Retrieves whether a GPT Model exists by its given <model_id>
    """
    try:
        if len(GPTModel.objects.filter(model_id=model_id)) == 0:
            return OBJECT_DOES_NOT_EXIST
        return OBJECT_EXISTS
    except:
        return OBJECT_DOES_NOT_EXIST

def get_active_model(course_id):
    """
    Acquires the current active GPT model for <course_id>
    """
    gptmodels = acquire_gptmodel_cluster()
        
    query = { 
        "course_id": course_id,
        "status": True
    }
    gpt_model = list(gptmodels.find(query))
    
    if len(gpt_model) == 0: 
        return OPERATION_FAILED

    gpt_model = gpt_model[0]
    res = {
        "model_id": gpt_model['model_id'],
        "model_name": gpt_model['model_name'],
        "course_id": gpt_model['course_id'],

        "model": gpt_model['model'],
        "prompt": gpt_model['prompt'],
        "suffix": gpt_model['suffix'],
        "max_tokens": gpt_model['max_tokens'],
        "temperature": gpt_model['temperature'],
        "top_p": gpt_model['top_p'],
        "n": gpt_model['n'],
        "stream": gpt_model['stream'],
        "logprobs": gpt_model['logprobs'],
        "presence_penalty": gpt_model['presence_penalty'],
        "frequency_penalty": gpt_model['frequency_penalty'],
        "best_of": gpt_model['best_of']
    }
    return res

def create_gptmodel(data):
    """
    Creates a GPT model given request data parameters.
    Returns a response object of the newly created GPT model.
    """
    keys = data.keys()
    
    if "suffix" not in keys: data['suffix'] = ''
    if "max_tokens" not in keys: data['max_tokens'] = 16
    if "temperature" not in keys: data['temperature'] = 1
    if "top_p" not in keys: data['top_p'] = 1
    if "n" not in keys: data['n'] = 1
    if "stream" not in keys: data['stream'] = False
    if "logprobs" not in keys: data['logprobs'] = None

    if "presence_penalty" not in keys: data['presence_penalty'] = 0
    if "frequency_penalty" not in keys: data['frequency_penalty'] = 0
    if "best_of" not in keys: data['best_of'] = 1
    
    has_existing_models = len(get_gptmodels(data['course_id'])) != 0 

    if (has_existing_models): status = False
    else: status = True

    gpt_model = GPTModel(
        model_id = uuid.uuid4(),
        model_name = data['model_name'],
        course_id = data['course_id'],
        status = status,

        # OpenAI Completion Parameters
        model = data['model'],
        prompt = data['prompt'],
        suffix = data['suffix'],
        max_tokens = data['max_tokens'],
        temperature = data['temperature'],
        top_p = data['top_p'],
        n = data['n'],
        stream = data['stream'],
        logprobs = data['logprobs'],
        
        presence_penalty = data['presence_penalty'],
        frequency_penalty = data['frequency_penalty'],
        best_of = data['best_of']
    )
    gpt_model.save()

    res = {
        "model_id": gpt_model.model_id,
        "model_name": gpt_model.model_name,
        "course_id": gpt_model.course_id,

        "model": gpt_model.model,
        "prompt": gpt_model.prompt,
        "suffix": gpt_model.suffix,
        "max_tokens": gpt_model.max_tokens,
        "temperature": gpt_model.max_tokens,
        "top_p": gpt_model.top_p,
        "n": gpt_model.n,
        "stream": gpt_model.stream,
        "logprobs": gpt_model.logprobs,
        "presence_penalty": gpt_model.presence_penalty,
        "frequency_penalty": gpt_model.frequency_penalty,
        "best_of": gpt_model.best_of
    }
    return res 

def update_gptmodel(data):
    """
    Updates GPT Model with the given data.
    Returns a response of the GPT Model object if succeeds,
    otherwise returns OPERAITON_FAILED.
    """
    try:
        keys = data.keys()

        for key in keys:
            if key not in GPTMODEL_KEYS:
                return OPERATION_FAILED
        
        gptmodels = acquire_gptmodel_cluster()
        
        query = { 
            "model_id": data['model_id'],
            "course_id": data['course_id']
        }
        data.pop('model_id')
        data.pop('course_id')
        updated_values = {
            "$set": data
        }

        gptmodels.update_one(query, updated_values)
        gpt_model = list(gptmodels.find(query))[0]
        res = {
            "model_id": gpt_model.model_id,
            "model_name": gpt_model.model_name,
            "course_id": gpt_model.course_id,

            "model": gpt_model.model,
            "prompt": gpt_model.prompt,
            "suffix": gpt_model.suffix,
            "max_tokens": gpt_model.max_tokens,
            "temperature": gpt_model.max_tokens,
            "top_p": gpt_model.top_p,
            "n": gpt_model.n,
            "stream": gpt_model.stream,
            "logprobs": gpt_model.logprobs,
            "presence_penalty": gpt_model.presence_penalty,
            "frequency_penalty": gpt_model.frequency_penalty,
            "best_of": gpt_model.best_of
        }
        return res
    except:
        return OPERATION_FAILED

def deactivate_gptmodel(course_id: str) -> bool:
    """
    Finds currently activated GPT model for the course
    """
    try:
        gptmodels = acquire_gptmodel_cluster()
        
        query = {
            "course_id": course_id,
            "status": True
        }
        update = { "$set": {"status": False} }
        gptmodels.update_one(query, update)

        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def activate_gptmodel(model_id: str) -> bool:
    """
    Activates a given GPT model
    Returns a boolean value.
    """
    try:
        gptmodels = acquire_gptmodel_cluster()
        
        query = {
            "model_id": model_id,
        }
        update = { "$set": {"status": True} }
        gptmodels.update_one(query, update)
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def switch_gptmodel(course_id, model_id):
    """
    Switch current GPT Model
    """
    try:
        # Check for course & model existence
        course = course_functions.get_course_existence(course_id)
        if not(course): return OPERATION_FAILED
        model = get_model_existence(model_id)
        if not(model): return OPERATION_FAILED

        # Deactivate old model & activate new model
        ret = deactivate_gptmodel(course_id)
        if ret:
            ret = activate_gptmodel(model_id)
            if not(ret): return OPERATION_FAILED
    except:
        return OPERATION_FAILED

def get_gptmodels(course_id):
    """
    Gets all GPT Models for a particular course
    """
    try:
        gpt_models = GPTModel.objects.filter(course_id=course_id).values()
        return list(gpt_models)
    except:
        return OPERATION_FAILED

def delete_gptmodels(model_id):
    """
    Deletes a GPT Model given <model_id>
    """
    try:
        GPTModel.objects.filter(model_id=model_id).delete()
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED