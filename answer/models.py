from __future__ import unicode_literals

from django.db import models
from survey.models import *

# Create your models here.
class Answer(models.Model):
    survey_id = models.ForeignKey(Survey)
    question_id = models.ForeignKey(Question)
    user_id = models.ForeignKey(User)
    value = models.CharField(max_length=512)

    def __str__(self):
        return "[Value: {}, QuestionID: {}, SurveyID: {}, UserID: {}]".format(self.value ,self.question_id.id, self.survey_id.id, self.user_id.id)