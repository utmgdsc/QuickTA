from djongo import models
from django.utils.timezone import now
from datetime import datetime 

# Create your models here.


class User(models.Model):
    class UserConversation(models.Model):
        conversation_id = models.CharField(max_length=100)

        class Meta:
            abstract =  True

    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    user_role = models.CharField(max_length=2)

    def __str__(self):
        return self.name + '(' + self.user_id + ')'


class Course(models.Model):
    course_id = models.CharField(max_length=20)
    semester = models.CharField(max_length=10)
    course_code = models.CharField(max_length=9)

    def __str__(self):
        return self.course_id 


class Model(models.Model):
    model_id = models.CharField(max_length=20)
    model_name = models.TextField(max_length=40)
    course_id = models.CharField(max_length=20)

    def __str__(self):
        return self.model_id + " " + self.model_name


class Conversation(models.Model):
    conversation_id = models.CharField(max_length=100)
    user_id = models.CharField(max_length=50)  
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=1)
    report = models.BooleanField()
    semester = models.CharField(max_length=20)

    def __str__(self):
        return "Conversation " + self.conversation_id + "(" + self.user_id + ")"


class Chatlog(models.Model):
    conversation_id = models.CharField(max_length=100)
    chatlog_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=datetime.now)
    is_user = models.BooleanField()
    chatlog = models.TextField(max_length = 3000)
    status = models.CharField(max_length=1, blank=True, null=True)

    def __str__(self):
        return "[" + self.conversation_id + "] Chatlog - " + self.chatlog_id + " " + self.chatlog


class Report(models.Model): 
    conversation_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=now)
    
    def __str__(self):
        return "[ " + self.conversation_id + "] " + self.time


class Feedback(models.Model):
    conversation_id = models.CharField(max_length=20)

    class Rating(models.IntegerChoices):
        POOR = 1
        UNSATISFACTORY = 2
        AVERAGE = 3
        GOOD = 4
        EXCELLENT = 5
    
    rating = models.IntegerField(choices=Rating.choices)
    feedback_msg = models.TextField(max_length=1000)

    def __str__(self):
        return "[ " + self.conversation_id +  " ] Feedback" 