import uuid
from enum import Enum
from django.db import models
import djongo.models as djmodels

# Create your models here.
class QuestionType(Enum):
    SCALE = 'Scale'
    MULTIPLE_CHOICE = 'MultipleChoice'
    OPEN_ENDED = 'OpenEnded'

class SurveyQuestion(models.Model):
    question_id = models.CharField(default="", max_length=100)
    type = models.TextField(choices=[('Pre', 'Pre'), ('Post', 'Post')])
    question = models.TextField()
    question_type = models.TextField(choices = [(tag.name, tag.value) for tag in QuestionType])
    answers = djmodels.JSONField(default = [], null=True, blank=True)
    open_ended_answer = models.TextField(null=True, blank=True)
    numeric_answer = models.FloatField(null=True, blank=True)


class Survey(models.Model):
    survey_id = models.CharField(default="", max_length=100)
    survey_name = models.TextField(default="")
    active = models.TextField(choices=[('True', 'True'), ('False', 'False')])
    type = models.TextField(choices=[('Pre', 'Pre'), ('Post', 'Post')])
    ordering = djmodels.JSONField(default=[], null=True, blank=True)


    def to_dict(self):
        return {
            "survey_id": self.survey_id,
            "survey_name": self.survey_name,
            "active": self.active,
            "type": self.type,
            "ordering": self.ordering
        }

class SurveyResponse(models.Model):
    survey_id = models.TextField()
    type = models.TextField(choices=[('Pre', 'Pre'), ('Post', 'Post')])
    question_id = models.TextField()
    user_id = models.TextField()
    conversation_id = models.TextField()
    answer = models.TextField()
    date = models.DateTimeField(auto_now_add=True)


