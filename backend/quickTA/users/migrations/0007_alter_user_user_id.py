# Generated by Django 4.1.1 on 2023-10-29 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_user_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.CharField(editable=False, max_length=200, unique=True),
        ),
    ]