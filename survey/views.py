from django.shortcuts import render
import django.contrib.auth as auth
from django.contrib.auth.models import User
from django.http import *

# Create your views here.

def index(request):
    return HttpResponse("Survey index page view")

def survey(request, survey_id):
    return render(request, 'main/survey.html', {'survey_id': survey_id})