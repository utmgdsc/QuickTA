import uuid
from django.db import models
from users.models import User
import djongo.models as djmodels

# Create your models here.

class Course(models.Model):
    course_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    semester = models.CharField(max_length=10)
    course_code = models.CharField(max_length=9)
    course_name = models.TextField(max_length=1000)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    students = djmodels.JSONField(default=[], blank=True, null=True)
    instructors = djmodels.JSONField(default=[], blank=True, null=True)
    researchers = djmodels.JSONField(default=[], blank=True, null=True)
    admins = djmodels.JSONField(default=[], blank=True, null=True)

    def __str__(self):
        return self.course_code + " - " + self.course_name + "(" + str(self.course_id) + ")"   