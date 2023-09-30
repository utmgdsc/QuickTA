import openai
import environ
import time
from student.models import Conversation
from models.models import GPTResponse

env = environ.Env()
environ.Env.read_env()
openai.api_key = env('OPENAI_KEY')

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
            {"role": "assistant", "content": "Hi! I am an AI assistant designed to support you in your Python programming learning journey. I cannot give out solutions to your assignments (python code) but I can help guide you if you get stuck. How can I help you?"},
            {"role": "user", "content": f"{chatlog}"},
        ]
        conversation_name = get_conversation_name(chatlog)
    else:
        messages = conversation.conversation_log
        messages.append({"role": "user", "content": f"{chatlog}"})

    # Acquire GPT-4 response
    response = openai.ChatCompletion.create(
        model=model,
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
