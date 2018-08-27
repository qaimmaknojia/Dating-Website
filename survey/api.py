from serializers import *
from models import *
from rest_framework import generics
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import *

class SurveyList(generics.ListAPIView):
    serializer_class = SurveySerializer
    queryset = Survey.objects.all()

class SurveyDetail(generics.RetrieveAPIView):
    serializer_class = SurveySerializer
    queryset = Survey.objects.all()

class QuestionList(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = Question.objects.all()
        survey_id = self.kwargs.get('survey_id')

        if (survey_id is not None):
            queryset = queryset.filter(survey_id=survey_id)
        return queryset

    def create(self, request, *args, **kwargs):
        survey_id = self.kwargs.get('survey_id')
        question_index = request.POST['question_index']
        question_text = request.POST['question_text']
        question_type = request.POST['question_type']

        try:
            question = Question(survey_id=survey_id, question_index=question_index, question_type=question_type, question_text=question_text)
            question.save()
        except:
            return HttpResponse(status=400, content="Fail")

        return Response(QuestionSerializer(question).data)

class QuestionDetail(generics.RetrieveAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = Question.objects.all()
        survey_id = self.kwargs.get('survey_id')

        queryset.filter(survey_id=survey_id)

        return queryset