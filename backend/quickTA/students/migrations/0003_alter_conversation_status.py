# Generated by Django 4.1.1 on 2023-09-14 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0002_alter_conversation_report_alter_conversation_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='status',
            field=models.CharField(max_length=1),
        ),
    ]
