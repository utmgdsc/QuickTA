# Generated by Django 4.1.1 on 2023-10-29 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0007_conversation_forced_inactive'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatlog',
            name='chatlog_id',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='conversation',
            name='conversation_id',
            field=models.CharField(max_length=100),
        ),
    ]