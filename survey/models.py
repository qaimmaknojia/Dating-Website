from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Survey(models.Model):
    survey_name = models.CharField(max_length=512, blank=False)

    def __str__(self):
        return ("SurveyID: {}, SurveyName: {}".format(self.id, self.survey_name))

'''
Model: Question
Parameters:
    (string) question_text: Text describing the question.
    (int)    question_type: Type of Question, ie. True/False, Rate from 1 - 5.
                0: True/False
                1: 1 - 5 Rating
                More to come in the future.
    (int)    question_index: Index of question relative to the Survey. (ie. what Question is first, second, etc.)
'''
class Question(models.Model):
    survey = models.ForeignKey(Survey, related_name='questions')
    question_index = models.IntegerField(blank=False)
    question_text = models.CharField(max_length=5012, blank=False)
    question_type = models.IntegerField(blank=False)

    class Meta:
        ordering = ['survey', 'question_index']

    def __str__(self):
        return "QuestionID: {}, SurveyID: {}, SurveyName: {}, Question: {}, Index: {}, Type: {}".format(self.id, self.survey.id, self.survey.survey_name, self.question_text, self.question_index, self.question_type)
