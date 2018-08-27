from datetime import datetime 
from django.contrib.auth.models import User
from django.db import models
from survey.models import Survey
import uuid

def getImageLocation(instance, filename):

    return '/'.join(['user_profiles', str(instance.user.id), str(uuid.uuid4())])

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userProfile')
    phoneNumber = models.CharField(max_length=20, default="000-000-0000")
    birthday = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to=getImageLocation, default='default.jpg')
    gender = models.IntegerField(default=-1)
    genderPreference = models.IntegerField(default=-1)

class SurveyScores(models.Model):
    user = models.ForeignKey(User)
    survey_id = models.ForeignKey(Survey)
    surveyScore = models.IntegerField(default=0)

class Comment(models.Model):
    sender_user = models.ForeignKey(User,related_name='sender')
    content = models.CharField(max_length=800)
    receiver_user= models.ForeignKey(User,related_name='receiver')
    comment_date = models.DateTimeField(default=datetime.now)

class Poke(models.Model):
    sender_user = models.ForeignKey(User,related_name='pokesender')
    user_poke = models.BooleanField()
    receiver_user= models.ForeignKey(User,related_name='pokereceiver')
