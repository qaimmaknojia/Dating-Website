from django.conf.urls import *
import api
from rest_framework.urlpatterns import format_suffix_patterns

app_name = "survey_api"

urlpatterns = [
    url(r'^$', api.SurveyList.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', api.SurveyDetail.as_view()),
    url(r'^(?P<survey_id>[0-9]+)/questions/$', api.QuestionList.as_view()),
    url(r'^(?P<survey_id>[0-9]+)/questions/(?P<pk>[0-9]+)/$', api.QuestionDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed='json')
