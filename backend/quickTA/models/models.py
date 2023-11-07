import uuid
from django.db import models
import djongo.models as djmodels

from course.models import Course, CourseDeployment

# Create your models here.
class GPTModel(models.Model):
    model_id = models.CharField(default="", max_length=100)
    model_name = models.TextField(max_length=100)
    model_description = models.TextField(max_length=2000, default="")
    model_type = models.CharField(max_length=100, default="")
    course_id = models.CharField(max_length=100)
    deployment_id = models.CharField(max_length=100, default="")
    status = models.BooleanField(default=True)
    default_message = models.TextField(max_length=100000, default="")
    default_conversation_name = models.TextField(max_length=100000, default="")

    # OpenAI Completion Parameters
    model = models.TextField(max_length=40)
    prompt = models.TextField(max_length=10000)
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
        
        deployment = CourseDeployment.objects.get(course_id=self.course_id, deployment_id=self.deployment_id)

        return {
            "model_id": str(self.model_id),
            "model_name": self.model_name,
            "model_description": self.model_description,
            "course_id": self.course_id,
            "status": self.status,
            "model": self.model,
            "default_message": self.default_message,
            "default_conversation_name": self.default_conversation_name,
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
            "deployment_id": self.deployment_id,
            "deployment": deployment.to_dict(),
        }
    
    def to_student_dict(self):
        return {
            "model_id": str(self.model_id),
            "model_name": self.model_name,
            "course_id": self.course_id,
            "status": self.status,
            "default_message": self.default_message,
        }
    
    def get_settings(self, include_functions=False):
        settings = {
            "model": self.model,
            "model_type": self.model_type,
            "default_message": self.default_message,
            "default_conversation_name": self.default_conversation_name,
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
    
