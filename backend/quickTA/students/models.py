from djongo import models
from django.utils.timezone import now
from datetime import datetime 

# Create your models here.


class User(models.Model):

    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    user_role = models.CharField(max_length=2)

    def __str__(self):
        return self.name + '(' + self.user_id + ')' + '[' + ','.join(self.courses) + ']'

class Course(models.Model):
    course_id = models.CharField(max_length=50)
    semester = models.CharField(max_length=10)
    course_code = models.CharField(max_length=9)
    course_name = models.TextField(max_length=1000)

    def __str__(self):
        return self.course_id 


class GPTModel(models.Model):
    model_id = models.CharField(max_length=100)
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


class Conversation(models.Model):
    conversation_id = models.CharField(max_length=100)
    course_id = models.CharField(max_length=100)
    user_id = models.CharField(max_length=50)  
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=1)
    report = models.BooleanField()
    comfortability_rating = models.IntegerField()

    def __str__(self):
        return "Conversation " + self.conversation_id + "(" + self.user_id + ")"


class Chatlog(models.Model):
    conversation_id = models.CharField(max_length=100)
    chatlog_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=datetime.now)
    is_user = models.BooleanField()
    chatlog = models.TextField(max_length = 3000)
    delta = models.DurationField(blank=True, null=True)

    def __str__(self):
        return "[" + self.conversation_id + "] Chatlog - " + self.chatlog_id + " " + self.chatlog


class Report(models.Model): 
    conversation_id = models.CharField(max_length=100)
    course_id = models.CharField(max_length=50)
    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    time = models.DateTimeField(default=now)
    status = models.CharField(max_length=1)
    msg = models.TextField(max_length=3000)

    def __str__(self):
        return "[ " + self.conversation_id + "] " + self.msg


class Feedback(models.Model):
    conversation_id = models.CharField(max_length=100)
    rating = models.FloatField()
    feedback_msg = models.TextField(max_length=1000)

    def __str__(self):
        return "[ " + self.conversation_id +  " ] Feedback" 