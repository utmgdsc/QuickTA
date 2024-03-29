# Generated by Django 4.1.1 on 2023-09-16 03:40

from django.db import migrations, models
import djongo.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('models', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GPTResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.TextField(max_length=100)),
                ('model_id', models.TextField(max_length=100)),
                ('chatlog_id', models.TextField(max_length=100)),
                ('gpt_id', models.TextField(max_length=100)),
                ('object', models.TextField(max_length=100)),
                ('created', models.TextField(max_length=100)),
                ('model', models.TextField(max_length=100)),
                ('choices', djongo.models.fields.JSONField(default=list)),
                ('usage', djongo.models.fields.JSONField(default=dict)),
            ],
        ),
        migrations.RemoveField(
            model_name='gptmodel',
            name='best_of',
        ),
        migrations.RemoveField(
            model_name='gptmodel',
            name='logprobs',
        ),
        migrations.RemoveField(
            model_name='gptmodel',
            name='suffix',
        ),
        migrations.AddField(
            model_name='gptmodel',
            name='function_call',
            field=models.TextField(blank=True, max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='gptmodel',
            name='functions',
            field=djongo.models.fields.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='gptmodel',
            name='max_tokens',
            field=models.IntegerField(default=300),
        ),
    ]
