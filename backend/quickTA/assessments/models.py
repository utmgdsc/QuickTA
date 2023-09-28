import uuid
from datetime import datetime
from django.db import models
import djongo.models as djmodels

# Create your models here.

class Assessment(models.Model):
    assessment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    assessment_name = models.TextField()
    status = models.CharField(default="A", max_length=1)
    question_bank = djmodels.JSONField(default=[], blank=True, null=True)

class AssessmentQuestion(models.Model):
    assessment_question_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    type = models.TextField(choices=[('Tech', 'Tech')])
    language = models.TextField(choices=[('Python', 'Python'), ('Java', 'Java'), ('SQL', 'SQL')])
    question = models.TextField()
    choices = djmodels.JSONField()
    correct_answer = models.TextField()
    correct_answer_flavor_text = models.TextField()

    def to_dict(self, show_answer=False):
        assessment_question_dict = {
            "assessment_question_id": self.assessment_question_id,
            "type": self.type,
            "language": self.language,
            "question": self.question,
            "choices": self.choices,
        }
        if show_answer:
            assessment_question_dict["correct_answer"] = self.correct_answer
            assessment_question_dict["correct_answer_flavor_text"] = self.correct_answer_flavor_text

class AsessmentResponse(models.Model):
    assessment_id = models.CharField(max_length=100)
    assessment_question_id = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100)
    date = models.DateTimeField(default=datetime.now)
    response_choice = models.TextField()
    correct = models.BooleanField()