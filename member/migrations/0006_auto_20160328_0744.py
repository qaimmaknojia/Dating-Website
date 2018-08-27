# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-28 07:44
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('member', '0005_auto_20160328_0107'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurveyScores',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('surveyScore', models.IntegerField(default=0)),
                ('survey_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='survey.Survey')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='surveyScore',
        ),
    ]