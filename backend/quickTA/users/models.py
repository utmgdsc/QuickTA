import uuid
from django.db import models
import djongo.models as djmodels

# Create your models here.
class User(models.Model):

    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    user_role = models.CharField(max_length=2)
    courses = djmodels.JSONField(default=[], blank=True, null=True)

    def __str__(self):
        return f"User(user_id={self.user_id}, name={self.name}, utorid={self.utorid}, user_role={self.user_role}, courses={self.courses})"
    
    class Meta:
        indexes = [
            models.Index(fields=['user_id'], name='user_id_idx'),
            models.Index(fields=['utorid'], name='utorid_idx'),
        ]