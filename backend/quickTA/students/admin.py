from django.contrib import admin

# Register your models here.

from .models import Chatlog, User, Course, GPTModel, Conversation, Feedback

admin.site.register(User)
admin.site.register(Course)
admin.site.register(GPTModel)
admin.site.register(Conversation)
admin.site.register(Feedback)
admin.site.register(Chatlog)
