# Generated by Django 4.1.1 on 2023-09-08 15:29

import datetime
import django.core.validators
from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chatlog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chatlog_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('conversation_id', models.CharField(max_length=100)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('is_user', models.BooleanField()),
                ('chatlog', models.TextField(max_length=3000)),
                ('delta', models.DurationField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('course_id', models.CharField(max_length=100)),
                ('user_id', models.CharField(max_length=50)),
                ('start_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(max_length=1)),
                ('reported', models.BooleanField(default=False)),
                ('comfortability_rating', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(limit_value=1), django.core.validators.MaxValueValidator(limit_value=5)])),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(max_length=100)),
                ('rating', models.FloatField()),
                ('feedback_msg', models.TextField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(max_length=100)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('status', models.CharField(max_length=1)),
                ('msg', models.TextField(max_length=3000)),
            ],
        ),
    ]
