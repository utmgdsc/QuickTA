import os
import openai
openai.organization = "" # Paste API key
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()
