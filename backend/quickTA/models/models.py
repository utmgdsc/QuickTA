import uuid
from django.db import models
import djongo.models as djmodels

# Create your models here.
class GPTModel(models.Model):
    model_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    model_name = models.TextField(max_length=100)
    model_description = models.TextField(max_length=2000, default="")
    course_id = models.CharField(max_length=100)
    status = models.BooleanField(default=True)

    # OpenAI Completion Parameters
    model = models.TextField(max_length=40)
    prompt = models.TextField(max_length=2000)
    max_tokens = models.IntegerField(default=300)
    temperature = models.FloatField(default=1)
    top_p = models.FloatField(default=1)
    n = models.IntegerField(default=1)
    stream = models.BooleanField(default=False)
    presence_penalty = models.FloatField(default=0)
    frequency_penalty = models.FloatField(default=0)

    # function based
    functions = djmodels.JSONField(default=list)
    function_call = models.TextField(max_length=2000, blank=True, null=True)

    def __str__(self):
        return str(self.model_id) + " " + self.model_name
    
    def get_model_id(self):
        return str(self.model_id)
    
    def to_dict(self):
        return {
            "model_id": str(self.model_id),
            "model_name": self.model_name,
            "model_description": self.model_description,
            "course_id": self.course_id,
            "status": self.status,
            "model": self.model,
            "prompt": self.prompt,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "n": self.n,
            "stream": self.stream,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty,
            "functions": self.functions,
            "function_call": self.function_call,
        }
    
    def to_student_dict(self):
        return {
            "model_id": str(self.model_id),
            "model_name": self.model_name,
            "course_id": self.course_id,
            "status": self.status
        }
    
    def get_settings(self, include_functions=False):
        settings = {
            "model": self.model,
            "prompt": self.prompt,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "n": self.n,
            "stream": self.stream,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty,
        }
        if include_functions:
            settings["functions"] = self.functions
            settings["function_call"] = self.function_call
        return settings
    
    class Meta:
        indexes = [
            models.Index(fields=['model_id'], name='model_id_idx'),
            models.Index(fields=['model_name'], name='model_name'),
            models.Index(fields=['course_id'], name='course_id'),
        ]

class GPTResponse(models.Model):
    conversation_id = models.TextField(max_length=100)
    model_id = models.TextField(max_length=100)
    chatlog_id = models.TextField(max_length=100)
    
    # GPT response parameters
    gpt_id = models.TextField(max_length=100)
    object = models.TextField(max_length=100)
    created = models.TextField(max_length=100)
    model = models.TextField(max_length=100)
    choices = djmodels.JSONField(default=list)
    usage = djmodels.JSONField(default=dict)
    
