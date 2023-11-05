import uuid
import openai
import environ
import time
from student.models import Conversation
from models.models import GPTResponse
from student.models import Chatlog
from datetime import timedelta

env = environ.Env()
environ.Env.read_env()
openai.api_type = 'azure'
openai.api_base = f"https://{env('AZURE_RESOURCE_NAME')}.openai.azure.com/"
openai.api_version = '2023-05-15'
openai.api_key = env('AZURE_API_KEY')

def completion(conversation, settings, chatlog):

    conversation_name = conversation.conversation_name
    model = settings['model'] if settings['model'] else "gpt-4"
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
            {"role": "assistant", "content": "Hello and congratulations on completing Lab 8 on file I/O and nested lists in Python! Reflecting on your experiences is a crucial step in the learning process. To get started, could you share an earlier moment (such as during the lecture) where you have encountered concepts similar to file I/O and nested lists? How does that previous experience compare with the techniques and understanding you have applied in this assignment?"},
            {"role": "user", "content": f"{chatlog}"},
        ]
        # conversation_name = get_conversation_name(chatlog)
        conversation_name = 'Lab 8 - I/O Reflection'
        
        MESSAGE = "Hello and congratulations on completing Lab 8 on file I/O and nested lists in Python! Reflecting on your experiences is a crucial step in the learning process. To get started, could you share an earlier moment (such as during the lecture) where you have encountered concepts similar to file I/O and nested lists? How does that previous experience compare with the techniques and understanding you have applied in this assignment?"
        create_chatlog(conversation.conversation_id, MESSAGE, False, conversation.start_time, None)
    else:
        messages = conversation.conversation_log
        messages.append({"role": "user", "content": f"{chatlog}"})

    # Acquire GPT-4 response
    response = openai.ChatCompletion.create(
        model=model,
        engine=env('AZURE_DEPLOYMENT_NAME'),
        messages=messages,
        temperature=temperature,
        top_p=top_p,
        max_tokens=max_tokens,
        n=n,
        frequency_penalty=frequency_penalty,
        presence_penalty=presence_penalty,  
    )

    # Post response processing
    agent_response = response['choices'][0]['message']['content']
    messages.append({"role": "assistant", "content": f"{agent_response}"})
    Conversation.objects.filter(conversation_id=conversation.conversation_id).update(conversation_log=messages, conversation_name=conversation_name)
    gpt_response = GPTResponse(
        conversation_id=str(conversation.conversation_id),
        model_id=conversation.model_id,
        gpt_id=response['id'],
        object=response['object'],
        created=response['created'],
        model=response['model'],
        choices=response['choices'],
        usage=response['usage']
    )
    gpt_response.save()

    return agent_response, conversation_name

def get_conversation_name(chatlog):
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