# Generated by Django 4.1.1 on 2023-10-23 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0006_conversation_conversation_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='forced_inactive',
            field=models.CharField(default='', max_length=1),
        ),
    ]