# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-07 08:48
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0007_comment_comment_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment_date',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 7, 1, 48)),
        ),
    ]
