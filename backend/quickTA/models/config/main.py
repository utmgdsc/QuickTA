from models.config import gpt4, azure
from typing import Dict
from student.models import Conversation
from models.models import GPTModel

def get_response(conversation: Conversation, model: GPTModel, chatlog) -> Dict:
    
    model_settings = model.get_settings()
    response = ""
    
    if model_settings['model_type'] == "gpt":
        if model_settings['model'] in ['gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k']:
            response, conversation_name = gpt4.get_response(conversation, model_settings, chatlog)
    
    elif model_settings['model_type'] == "azure":
        response, conversation_name = azure.get_response(conversation, model_settings, chatlog)
    
    return response, conversation_name