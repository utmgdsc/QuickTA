from django.contrib import admin

# Register your models here.

from .models import User, Course, Model, Conversation, Feedback

admin.site.register(User)
admin.site.register(Course)
admin.site.register(Model)
admin.site.register(Conversation)
admin.site.register(Feedback)
