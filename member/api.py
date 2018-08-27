from django import forms
from match import Match
from serializers import *
from models import *
from serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from models import UserProfile
from django.http import *
import json
from rest_framework.response import Response


def IsAuthorized(requestUserId, id):
    if str(requestUserId) == str(id):
        return True
    else:
        return False

def isPokeAuthenticated(sid, rid):
    if (sid == rid):
        return True

    sample1 = Poke.objects.filter(sender_user = sid, receiver_user = rid, user_poke=True).count() > 0
    sample2 = Poke.objects.filter(sender_user= rid, receiver_user = sid, user_poke=True).count() > 0

    return (sample1 and sample2)

class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        queryset = User.objects.all()
        email = self.request.query_params.get('email', None)
        if (email is not None):
            queryset = queryset.filter(email=email)

        return queryset.values('id', 'first_name', 'last_name')

    def create(self, request, *args, **kwargs):
        password = request.POST['password']
        email = request.POST['email']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        phoneNumber = request.POST['phoneNumber']
        birthday = request.POST['birthday']

        try:
            user = User.objects.create_user(username= email, password=password, email=email, first_name=first_name, last_name=last_name)
            user.save()
            userProfile, created = UserProfile.objects.get_or_create(user=user)

            if (created):
                userProfile.phoneNumber = phoneNumber
                userProfile.birthday = birthday
                userProfile.save()
            else:
                return HttpResponse(status=500, content="Fail")
        except:
            return HttpResponse(status=500, content="Fail")

        return HttpResponse(status=200)

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        requestUserId = kwargs['pk']
        currentUserId = request.user.id

        if isPokeAuthenticated(str(currentUserId), str(requestUserId)):
            return self.retrieve(request, *args, **kwargs)
        else:
            user = User.objects.filter(pk=requestUserId).values('id', 'first_name', 'last_name').first()
            return Response(UserSerializer(user).data)

class ImageUploadForm(forms.Form):
    image = forms.ImageField()

# Code based from https://coderwall.com/p/bz0sng/simple-django-image-upload-to-model-imagefield
def user_picture(request, pk):
    if request.method == "GET":
        try:
            user = User.objects.get(pk=pk)
            if (user is not None):
                userImageUrl = user.userProfile.image.url
                return HttpResponseRedirect(userImageUrl)
            else:
                return HttpResponse(status=404, content="Fail")
        except:
            return HttpResponse(status=500, content="Fail")

    if request.method == "POST":
        if (not IsAuthorized(request.user.id, pk)):
            return HttpResponse(status=401, content="Unauthorized.")
        form = ImageUploadForm(request.POST, request.FILES)

        if form.is_valid():
            user = User.objects.get(pk=pk)
            if user is not None:
                userProfile, created = UserProfile.objects.get_or_create(user=user)
                userProfile.image = form.cleaned_data['image']
                userProfile.save()
                return HttpResponse(status=200, content="True")

            return HttpResponse(status=404, content="Fail")
        return HttpResponse(status=500, content="Fail")

# Displays the list of comments made by the users
class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def post(self, request, *args, **kwargs):
        postUserId = request.POST['sender_user']

        if (not IsAuthorized(request.user.id, postUserId)):
            return HttpResponse(status=401, content="Unauthorized.")

        return self.create(request, *args, **kwargs)

# Filters the list of comments specific to the received user 
class UserComment(generics.ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        userId = self.kwargs['id']
        return Comment.objects.filter(receiver_user=userId)

#filter the poke list(who poked to whom) 
class PokeList(generics.ListCreateAPIView):
    queryset = Poke.objects.all()
    serializer_class = PokeSerializer

    def post(self, request, *args, **kwargs):
        postUserId = request.POST['sender_user']

        if (not IsAuthorized(request.user.id, postUserId)):
            return HttpResponse(status=401, content="Unauthorized.")

        return self.create(request, *args, **kwargs)

#filter the poke list of current user 
class UserPoke(generics.ListAPIView):
    serializer_class = PokeSerializer

    def get_queryset(self):
        userId = self.kwargs['id']
        return Poke.objects.filter(sender_user=userId)

    def get(self, request, *args, **kwargs):
        userId = self.kwargs['id']
        if (not IsAuthorized(request.user.id, userId)):
            return HttpResponse(status=401, content="Unauthorized.")

        return self.list(request, *args, **kwargs)

#Shows the contact details if users have poked each other
def canSee(request,sid,rid):
    if (not IsAuthorized(request.user.id, sid)):
        return HttpResponse(status=401, content="Unauthorized.")

    return HttpResponse(isPokeAuthenticated(sid,rid))

def match(request, pk):
    if (not IsAuthorized(request.user.id, pk)):
        return HttpResponse(status=401, content="Unauthorized.")

    userId = pk

    if request.method == "GET":
        match = Match(userId)
        try:
            surveyId = request.GET['survey']
        except:
            return HttpResponse(status=400, content="Fail. Please provide ../match/?survey={surveyId} query parameter.")

        try:
            match.generateSurveyScoreForUser(surveyId=surveyId)
            matches = match.getUserMatches(surveyId=surveyId)
        except:
            return HttpResponse(status=400, content="Fail. User: {} has not yet completed Survey: {}".format(str(userId), str(surveyId)))

        return HttpResponse(matches)

class SurveyScoreList(generics.ListAPIView):
    serializer_class = SurveyScoresSerializer

    def get_queryset(self):
        userId = self.kwargs['id']
        return SurveyScores.objects.filter(user=userId)

def friends(request, pk):
    if (not IsAuthorized(request.user.id, pk)):
        return HttpResponse(status=401, content="Unauthorized.")

    currentPokedUsers = Poke.objects.filter(sender_user=pk, user_poke=True)

    friendsList = []
    for pokedUser in currentPokedUsers:
        #check if pokedUser has current user in poke list
        pokedUserId = pokedUser.receiver_user_id

        if (isPokeAuthenticated(pk, pokedUserId)):
            friendsList.append(pokedUserId)
    # hack to get uniqueness
    return HttpResponse(json.dumps(list(set(friendsList))))

# Everyone who has poked me that I have not yet poked yet.
def pokestack(request,pk):

    if (not IsAuthorized(request.user.id, pk)):
        return HttpResponse(status=401, content="Unauthorized.")

    currentPokedUsers = Poke.objects.filter(receiver_user=pk, user_poke=True)
    pokeList = []

    if currentPokedUsers.count() <= 0:
        return HttpResponse(json.dumps(pokeList))

    for pokedUser in currentPokedUsers:
        pokedUserId = pokedUser.sender_user_id

        if (not isPokeAuthenticated(pk, pokedUserId) and str(pokedUserId) != str(pk)):
            pokeList.append(pokedUserId)

    # hack to get uniqueness
    return HttpResponse(json.dumps(list(set(pokeList))))

def unfriend(request,sid,rid):

    if (not IsAuthorized(request.user.id,sid)):
        return HttpResponse(status=401, content="Unauthorized.")

    if request.method == "POST":
        try:
            Poke.objects.filter(sender_user = rid, receiver_user = sid, user_poke=True).delete()
            Poke.objects.filter(sender_user = sid, receiver_user = rid, user_poke=True).delete()
            return HttpResponse(status=200, content="Success.")
        except:
            return HttpResponse(status=400, content="Fail.")


