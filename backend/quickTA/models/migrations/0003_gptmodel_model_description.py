# Generated by Django 4.1.1 on 2023-09-18 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('models', '0002_gptresponse_remove_gptmodel_best_of_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='gptmodel',
            name='model_description',
            field=models.TextField(default='', max_length=2000),
        ),
    ]
