"""FinalProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import *
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView, TemplateView

import views

urlpatterns = [

    # Admin Page
    url(r'^admin/', admin.site.urls),

    # Default Path
    url(r'^$', views.home, name='home'),

    # Login/Logout
    url(r'^login/$', views.login, name='login'),
    url(r'^logout/$', views.logout, name='logout'),
    # Sign up
    url(r'^signup/$', views.signup, name='signup'),

    url(r'^login_test/$', views.login_test, name='login_test'),

    # User App
    url(r'^member/', include('member.urls')),
    url(r'^api/member/', include('member.apiUrls')),

    # Survey App
    url(r'^survey/', include('survey.urls')),
    url(r'^api/survey/', include('survey.apiUrls')),

    # Answer App
    url(r'^api/answer/', include('answer.apiUrls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)