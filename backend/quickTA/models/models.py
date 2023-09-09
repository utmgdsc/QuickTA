import uuid
from django.db import models

# Create your models here.
class GPTModel(models.Model):
    model_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    model_name = models.TextField(max_length=100)
    course_id = models.CharField(max_length=100)
    status = models.BooleanField(default=True)

    # OpenAI Completion Parameters
    model = models.TextField(max_length=40)
    prompt = models.TextField(max_length=2000)
    suffix = models.TextField(max_length=100, blank=True, null=True)
    max_tokens = models.IntegerField(default=16)
    temperature = models.FloatField(default=1)
    top_p = models.FloatField(default=1)
    n = models.IntegerField(default=1)
    stream = models.BooleanField(default=False)
    logprobs = models.IntegerField(default=None)
    
    presence_penalty = models.FloatField(default=0)
    frequency_penalty = models.FloatField(default=0)
    best_of = models.IntegerField(default=1)

    def __str__(self):
        return self.model_id + " " + self.model_name