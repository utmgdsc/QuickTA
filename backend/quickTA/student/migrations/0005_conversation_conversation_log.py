# Generated by Django 4.1.1 on 2023-09-16 03:40

from django.db import migrations
import djongo.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0004_conversation_model_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='conversation_log',
            field=djongo.models.fields.JSONField(default=list),
        ),
    ]
