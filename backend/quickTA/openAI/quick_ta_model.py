import os
import openai
from ..students.models import Chatlog, Conversation
openai.organization = "" # Paste API key
openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.Model.list()

class GPTChatlog(Chatlog):

    USER = "User"
    AGENT = "Agent" 
    CONFIGS = {
        "engine": "text-davinci-002",
        "temperature": 0.9,
        "max_tokens": 200,
        "top_p": 1,
        "fequency_penalty": 0,
        "presence_penalty": 0.6,
    }
    FILTERS = [
        "answer",
        "solution",
    ]

    def __init__(self, convo_id, chatlog_id, chatlog):
        
        super().__init__(
            conversation_id=convo_id,
            chatlog_id = chatlog_id,
            is_user=False,
            chatlog=chatlog,
            status='A'
        )

        self.start_sequence = f"\n{self.AGENT}"
        self.restart_sequence = f"\n\n{self.USER}"

    def enquire_model(self, question: str) -> str:
    # response = openai.Completion.create(model="text-davinci-002", prompt="Say this is a test", temperature=0, max_tokens=6)
        prompt_text = f"{self.chatlog}{self.restart_sequence}{question}{self.start_sequence}"
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