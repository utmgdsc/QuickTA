import uuid
import openai
import environ
import time
from student.models import Conversation
from models.models import GPTResponse
from student.models import Chatlog
from datetime import timedelta

from langchain.chat_models import AzureChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage


env = environ.Env()
environ.Env.read_env()

BASE_URL = f"https://{env('AZURE_RESOURCE_NAME')}.openai.azure.com/"
API_KEY = env('AZURE_API_KEY')
DEPLOYMENT_NAME = env('AZURE_DEPLOYMENT_NAME')

# openai.api_type = 'azure'
# openai.api_version = '2023-05-15'

def format_conversation(messages):
    
    formatted_messages = []
    for message in messages:
        if message['role'] == "system": formatted_messages.append(SystemMessage(content=message['content']))
        elif message['role'] == "assistant": formatted_messages.append(AIMessage(content=message['content']))
        elif message['role'] == "user": formatted_messages.append(HumanMessage(content=message['content']))
    return formatted_messages

def completion(conversation, settings, chatlog):

    conversation_name = conversation.conversation_name
    model = settings['model'] if settings['model'] else "gpt-4"
    default_message = settings['default_message']
    default_conversation_name = settings['default_conversation_name']
    prompt = settings['prompt']
    max_tokens = settings['max_tokens']
    temperature = settings['temperature']
    top_p = settings['top_p']
    frequency_penalty = settings['frequency_penalty']
    presence_penalty = settings['presence_penalty']
    n = settings['n']

    # Generate new conversation or load conversation log
    if not conversation.conversation_log:
        messages=[
            {"role": "system", "content": f"{prompt}"},
            {"role": "assistant", "content": default_message},
            {"role": "user", "content": f"{chatlog}"},
        ]

        formatted_messages = [
            SystemMessage(content=prompt),
            AIMessage(content=default_message),
            HumanMessage(content=chatlog)     
        ]
        conversation_name = get_conversation_name(chatlog, default_conversation_name)
        create_chatlog(conversation.conversation_id, default_message, False, conversation.start_time, None)
    else:
        messages = conversation.conversation_log
        messages.append({"role": "user", "content": f"{chatlog}"})
        formatted_messages = format_conversation(messages)

    # Acquire azure gpt response
    azure_model = AzureChatOpenAI(
        openai_api_base=BASE_URL,
        openai_api_version="2023-05-15",
        deployment_name=DEPLOYMENT_NAME,
        openai_api_key=API_KEY,
        openai_api_type="azure",
        max_tokens = settings['max_tokens'],
        temperature = settings['temperature'],
        top_p = settings['top_p'],
        frequency_penalty = settings['frequency_penalty'],
        presence_penalty = settings['presence_penalty'],
        n = settings['n']
    )   
    # response = model(**formatted_messages)
    response = azure_model(formatted_messages)

    # Post response processing
    agent_response = response.content
    messages.append({"role": "assistant", "content": f"{agent_response}"})
    Conversation.objects.filter(conversation_id=conversation.conversation_id).update(conversation_log=messages, conversation_name=conversation_name)

    return agent_response, conversation_name

def get_conversation_name(chatlog, default):
    if (default): return default
    response = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt="Label this conversation with a name that is less than 6 words: \n\nChatlog: " + chatlog + "\n\nConversation name:",
        temperature=1,
        top_p=0,
        max_tokens=8,
        n=1,
        frequency_penalty=0,
        presence_penalty=0.6,  
    )
    conversation_name = response['choices'][0]['text'].strip().replace("'", "").replace('"', '')
    return conversation_name

def get_response(conversation, settings, chatlog):
    response, conversation_name = completion(conversation, settings, chatlog)
    # if not settings['stream']: 
    # else: response = "[Placeholder] Hello World"
    if not response: response = "Sorry for the invconvenience. Currently having difficulties. Please try again later."
    return response, conversation_name


def create_chatlog(cid, chatlog, is_user, time, delta):
        chatlog_id = uuid.uuid4()
        chatlog = Chatlog(
            chatlog_id=str(chatlog_id),
            conversation_id=str(cid),
            time=time,
            is_user=is_user,
            chatlog=chatlog,
            delta=delta
        )
        chatlog.save()
        return chatlog