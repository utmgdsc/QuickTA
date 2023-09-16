import openai
import environ
import time
from student.models import Conversation
from models.models import GPTResponse

env = environ.Env()
environ.Env.read_env()
openai.api_key = env('OPENAI_KEY')

def completion(conversation, settings, chatlog):

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
            {"role": "user", "content": f"{chatlog}"},
        ]
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
    Conversation.objects.filter(conversation_id=conversation.conversation_id).update(conversation_log=messages)
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

    return agent_response

def get_response(conversation, settings, chatlog):
    if not settings['stream']: response = completion(conversation, settings, chatlog)
    else: response = "[Placeholder] Hello World"
    return response