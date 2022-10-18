from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    utorid = models.CharField(max_length=10)
    user_role = models.CharField(max_length=2)

    def __str__(self):
        return self.name + '(' + self.utorid + ')'