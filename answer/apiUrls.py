from django.conf.urls import *
import api
from rest_framework.urlpatterns import format_suffix_patterns

app_name = "answer_api"

urlpatterns = [
    url(r'^$', api.AnswerList.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', api.AnswerDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed='json')
