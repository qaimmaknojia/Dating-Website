from serializers import *
from models import *
from rest_framework import generics
from django.http import *
from rest_framework import permissions

def IsAuthorized(requestUserId, id):
    if str(requestUserId) == str(id):
        return True
    else:
        return False

class AnswerList(generics.CreateAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()

    def post(self, request, *args, **kwargs):
        postUserId = request.POST['user_id']
        if (not IsAuthorized(request.user.id, postUserId)):
            return HttpResponse(status=401, content="Unauthorized.")
        return self.create(request, *args, **kwargs)

class AnswerDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    permission_classes = (permissions.IsAdminUser,)