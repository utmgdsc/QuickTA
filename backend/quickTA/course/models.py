import uuid
from django.db import models
from users.models import User
import djongo.models as djmodels

# Create your models here.

class Course(models.Model):
    course_id = models.CharField(max_length=100, editable=False, unique=True)
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
    
    class Meta:
        indexes = [
            models.Index(fields=['course_id'], name='course_id_idx'),
            models.Index(fields=['course_name'], name='course_name'),
            models.Index(fields=['semester'], name='semester'),
        ]

class CourseDeployment(models.Model):
    deployment_id = models.CharField(max_length=50, editable=False, unique=True)
    deployment_name = models.TextField(max_length=1000)
    course_id = models.CharField(max_length=50)
    priority = models.IntegerField(default=0)
    status = models.CharField(default="A", max_length=1) # A or I - Active or Inactive

    def to_dict(self):
        return {
            'deployment_id': self.deployment_id,
            'deployment_name': self.deployment_name,
            'course_id': self.course_id,
            'priority': self.priority,
            'status': self.status
        }