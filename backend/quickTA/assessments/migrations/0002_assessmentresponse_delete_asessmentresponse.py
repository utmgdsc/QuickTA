# Generated by Django 4.1.1 on 2023-09-29 17:34

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssessmentResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_id', models.CharField(max_length=100)),
                ('assessment_question_id', models.CharField(max_length=100)),
                ('user_id', models.CharField(max_length=100)),
                ('conversation_id', models.CharField(max_length=100)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('answer', models.TextField()),
                ('correct', models.BooleanField()),
            ],
        ),
        migrations.DeleteModel(
            name='AsessmentResponse',
        ),
    ]
