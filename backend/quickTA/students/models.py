from django.db import models
from django.utils.timezone import now

# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    user_role = models.CharField(max_length=2)

    def __str__(self):
        return self.name + ' (' + self.utorid + ')'

class Course(models.Model):
    course_id = models.CharField(max_length=20)
    semester = models.CharField(max_length=10)
    course_code = models.CharField(max_length=9)

    def __str__(self):
        return self.course_id + ' (' + self.semester + ')' 

class Model(models.Model):
    model_id = models.CharField(max_length=20)
    course_id = models.ForeignKey(Course, null=True, on_delete=models.CASCADE)

class Conversation(models.Model):
    conversation_id = models.CharField(max_length=100)
    user_id = models.ForeignKey(User, null=True, on_delete=models.CASCADE)    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=1)
    semester = models.ForeignKey(Course, null=True, on_delete=models.CASCADE)

class Report(models.Model): 
    conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    report_msg = models.TextField(max_length = 3000)
    time = models.DateTimeField(default=now)

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

class Chatlog(models.Model):
    conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    chatlog_id = models.CharField(max_length=100)
    time = models.DateTimeField()
    is_user = models.BooleanField()
    chatlog = models.TextField(max_length = 3000)

