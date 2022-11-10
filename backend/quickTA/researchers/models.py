from django.db import models
# from quickTA.students.models import Chatlog

from django.utils.timezone import now
from datetime import datetime

# Chatlog = Chatlog.objects.filter(chatlog_id=1).values()
# Chatlog = Chatlog.objects.filter().values()


# Create your models here.
class Chatlog(models.Model):
    conversation_id = models.CharField(max_length=100)
    chatlog_id = models.CharField(max_length=100)
    time = models.DateTimeField(default=datetime.now)
    is_user = models.BooleanField()
    chatlog = models.TextField(max_length = 3000)
    status = models.CharField(max_length=1, blank=True, null=True)

    def __str__(self):
        return "[" + self.conversation_id + "] Chatlog -" + self.chatlog_id
