import uuid
from datetime import datetime 
from django.db import models
from django.utils.timezone import now
from django.core.validators import MinValueValidator, MaxValueValidator
import djongo.models as djmodels

from users.models import User
from course.models import Course

# Create your models here.
class Conversation(models.Model):
    conversation_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    course_id = models.CharField(max_length=100)
    user_id = models.CharField(max_length=50)  
    start_time = models.DateTimeField(default=now)
    end_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=1, default='A')
    reported = models.BooleanField(default=False)
    comfortability_rating = models.IntegerField(
        validators=[
            MinValueValidator(limit_value=1),
            MaxValueValidator(limit_value=5)
        ],
        blank=True,
        null=True
    )

    def __str__(self):
        return f"[{str(self.course)}] {str(self.user)} - Conversation {str(self.conversation_id)}"
    
    def to_dict(self):
        user = User.objects.get(user_id=self.user_id)
        course = Course.objects.get(course_id=self.course_id)
        return {
            "course_name": course.name,
            "course_id": self.course_id,
            "user_id": self.user_id,
            "user_name": user.name,
            "utorid": user.utorid,
            "conversation_id": str(self.conversation_id),
            "start_time": self.start_time,
            "end_time": self.end_time,
            "status": self.status,
            "reported": self.reported,
            "comfortability_rating": self.comfortability_rating
        }

class Chatlog(models.Model):
    chatlog_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    conversation_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=datetime.now)
    is_user = models.BooleanField()
    chatlog = models.TextField(max_length = 3000)
    delta = models.DurationField(blank=True, null=True)

    def __str__(self):
        return f"[{str(self.conversation)}] Chatlog - {str(self.chatlog_id)} {self.chatlog}"
    
    def to_dict(self, show_alias=False):

        if show_alias:
            convo = Conversation.objects.get(conversation_id=self.conversation_id)
            user = User.objects.get(user_id=convo.user_id)
            return {
                "chatlog_id": str(self.chatlog_id),
                "conversation_id": self.conversation_id,
                "time": self.time,
                "speaker": user.name if self.is_user else "Agent",
                "chatlog": self.chatlog,
                "delta": self.delta
            }
        return {
            "chatlog_id": str(self.chatlog_id),
            "conversation_id": self.conversation_id,
            "time": self.time,
            "is_user": self.is_user,
            "chatlog": self.chatlog,
            "delta": self.delta
        }

class Report(models.Model): 
    conversation_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=now)
    status = models.CharField(max_length=1, default='O')
    msg = models.TextField(max_length=3000)

    def __str__(self):
        return f"[{str(self.conversation)}] {self.msg}"
    
    def to_dict(self):
        conversation = Conversation.objects.get(conversation_id=self.conversation_id)
        user = User.objects.get(user_id=self.user_id)

        return {
            "course_id": conversation.course_id,
            "conversation_id": self.conversation_id,
            "user_id": self.user_id,
            "user_name": user.name,
            "utorid": user.utorid,
            "time": self.time,
            "status": self.status,
            "msg": self.msg
        }


class Feedback(models.Model):
    conversation_id = models.CharField(max_length=100)
    rating = models.FloatField()
    feedback_msg = models.TextField(max_length=1000)

    def __str__(self):
        return f"[{str(self.conversation)}] Feedback"