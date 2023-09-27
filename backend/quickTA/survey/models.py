import uuid
from enum import Enum
from django.db import models
import djongo.models as djmodels

# Create your models here.
class QuestionType(Enum):
    SCALE = 'Scale'
    MULTIPLE_CHOICE = 'MultipleChoice'

class SurveyQuestion(models.Model):
    question_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    type = models.TextField(choices=[('Pre', 'Pre'), ('Post', 'Post')])
    question = models.TextField()
    question_type = models.TextField(choices = [(tag.name, tag.value) for tag in QuestionType])
    answers = djmodels.JSONField(default = [], null=True, blank=True)
    numeric_answer = models.FloatField(null=True, blank=True)


class Survey(models.Model):
    survey_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
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