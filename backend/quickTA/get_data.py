import sys, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickTA.settings')

import django
django.setup()

from students.models import Chatlog

# Chatlog = Chatlog.objects.filter(chatlog_id=1).values()
Chatlog = Chatlog.objects.filter().values()


for row in Chatlog:
    print(row)


