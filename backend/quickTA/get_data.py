import sys, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickTA.settings')

import django
django.setup()

from students.models import Chatlog
from django.db.models import CharField
from django.db.models.functions import Cast

Chatlog2 = Chatlog.objects.filter()
# Chatlog3 = Chatlog.objects.filter().all()
# Chatlog2 = Chatlog.objects.filter().values_list(time=Cast('time', CharField()))
# Chatlog3 = Chatlog.objects.values_list(time)
Chatlog2 = Chatlog2.filter(id=None)
Chatlog2 = Chatlog2.filter(chatlog="test")

Chatlog2 = Chatlog2.values()

for row in Chatlog2:
    print(row)




