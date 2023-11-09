# Generated by Django 4.1.1 on 2023-10-21 08:12

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0004_coursedeployment'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursedeployment',
            name='priority',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='coursedeployment',
            name='deployment_id',
            field=models.CharField(default=uuid.UUID('bf0d8818-050f-4f31-9290-24a043819196'), editable=False, max_length=50, unique=True),
        ),
    ]