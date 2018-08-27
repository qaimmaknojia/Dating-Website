from django.shortcuts import *
import django.contrib.auth as auth
from django.contrib.auth.models import User
from django.http import *

# Create your views here.
app_name = "member"

def index(request):
    return HttpResponse("Member index page view")

def member(request, member_id):
    return render(request, 'main/member.html', {'member_id': member_id})