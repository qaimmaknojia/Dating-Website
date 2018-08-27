from django.conf.urls import *
import api
from rest_framework.urlpatterns import format_suffix_patterns

app_name = "member_api"

urlpatterns = [
    url(r'^(?i)$', api.UserList.as_view()),
    url(r'^(?i)(?P<pk>[0-9]+)/$', api.UserDetail.as_view()),
    url(r'^(?i)(?P<pk>[0-9]+)/picture', api.user_picture),
    url(r'^(?P<pk>[0-9]+)/match', api.match),
    url(r'^(?i)(?P<pk>[0-9]+)/friends', api.friends),
    url(r'^(?i)(?P<pk>[0-9]+)/pokeStack', api.pokestack),

    #comment URL
	url(r'(?i)^comment/', api.CommentList.as_view()),
	url(r'(?i)^(?P<id>[0-9]+)/comment', api.UserComment.as_view()),

    #poke URL
    #poke list
	url(r'(?i)^poke/', api.PokeList.as_view()),
    #user poke list
    url(r'(?i)^(?P<id>[0-9]+)/poke/', api.UserPoke.as_view()),
    #users detail share
    url(r'(?i)^(?P<sid>[0-9]+)/canSee/(?P<rid>[0-9]+)', api.canSee),
    url(r'(?i)^(?P<sid>[0-9]+)/unfriend/(?P<rid>[0-9]+)', api.unfriend),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed='json')
