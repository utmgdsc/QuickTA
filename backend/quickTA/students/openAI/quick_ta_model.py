import os
import openai
import environ

from ..models import Conversation
from ..functions import conversation_functions as convo_f

env = environ.Env()
environ.Env.read_env()
# openai.organization =
# openai.Model.list()
openai.api_key = env('OPENAI_KEY')

# CONVO_START = "\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI."
BOT_START = "Hello. I am an AI chatbot designed to assist you in solving your problems by giving hints but never providing direct answers. How can I help you?"
USER = "Human"
AGENT = "AI"
WARNING = "Warning"
END = "End"
NOTI = "Notification"

# CONFIGURATIONS TO BE BASED ON THE MODEL OF THE PARTICULAR COURSE
CONFIGS = {
    "engine": "text-davinci-002",
    "temperature": 0.9,
    "max_tokens": 1000,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0.6,
}
FILTERS = [
    "answer",
    "solution",
]


START_SEQUENCE = f"\n{AGENT}: "
RESTART_SEQUENCE = f"\n\n{USER}: "

def enquire_model(conversation_id: str, question: str) -> str:
    """
    Enquires the OpenAI GPT-3 model for a text-completion answer
    given a <conversation_id> and a <question>.
    """
    # Acquire all chatlogs for the particular conversation from the conversation_id
    chatlog = convo_f.get_conversation_chatlog(conversation_id)
    print("PREVIOUS CHATLOG:", chatlog)

    if chatlog == "":
        chatlog += BOT_START

    prompt_text = f"{chatlog}{RESTART_SEQUENCE}{question}{START_SEQUENCE}"

    response = openai.Completion.create(
        prompt=prompt_text,
        stop=[" {}:".format(USER), " {}:".format(AGENT)],
        **CONFIGS
    )

    res_text = response['choices'][0]['text']
    answer = str(res_text).strip().split(RESTART_SEQUENCE.rstrip())[0]
    print(answer)
    # Save the entire chatlog (with the AI response back to the conversation)
    entire_convo = prompt_text + answer
    ret = convo_f.post_conversation_chatlog(conversation_id, entire_convo)
    print(ret)

    if not(ret): 
        return ""
    
    return answer

# def filter(self, prompt_text: str) -> str:
#     return [" ".join([word for word in prompt.split() if not word in filter]) for prompt in prompt_text]