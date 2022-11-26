import os
import openai
# from ..models import Chatlog, Conversation
from dotenv import dotenv_values

config = dotenv_values(".env")
openai.organization = config # Paste API key
print(config)
openai.api_key = ""
# openai.Model.list()

MESSAGE_START = "\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI."

class Conversation:
    CONVO_START = MESSAGE_START
    BOT_START = "Hello. I am an AI agent designed to assist you in solving your problems without providing you direct answers. How can I help you?"
    USER = "Human"
    AGENT = "AI"
    WARNING = "Warning"
    END = "End"
    NOTI = "Notification"

    def __init__(self, user: str, chatbot: str, chatlog: str) -> None:
        self.user_name = user
        self.chatbot_name = chatbot
        self.chatlog = chatlog
        self.prompt = chatlog.split(self.CONVO_START)[0]
    
    

class GPTChatlog:
    
    USER = "User"
    AGENT = "Agent" 
    CONFIGS = {
        "engine": "text-davinci-002",
        "temperature": 0.9,
        "max_tokens": 100,
        "top_p": 1,
        "fequency_penalty": 0,
        "presence_penalty": 0.6,
    }
    FILTERS = [
        "answer",
        "solution",
    ]

    def __init__(self):

        self.start_sequence = f"\n{self.AGENT}"
        self.restart_sequence = f"\n\n{self.USER}"

    def enquire_model(self, question: str) -> str:
    # response = openai.Completion.create(model="text-davinci-002", prompt="Say this is a test", temperature=0, max_tokens=6)
        prompt_text = f"{self.chatlog}{self.restart_sequence}{question}{self.start_sequence}"

        # 1. Initialize prompt (arm) text 
        # 2. Acquire all of the previous chatlogs for the conversation 
        # 3. Append arm extension  
        self.filter_chatlog(prompt_text)
        response = openai.Completion.create(
            prompt=prompt_text,
            stop=[" {}:".format(self.USER), " {}:".format(self.AGENT)],
            **self.CONFIGS
        )

        res_text = response['choices'][0]['text']
        answer = str(res_text).strip().split(self.restart_sequence.rstrip())[0]
        return answer

    def filter(self, prompt_text: str) -> str:
        return [" ".join([word for word in prompt.split() if not word in filter]) for prompt in prompt_text]