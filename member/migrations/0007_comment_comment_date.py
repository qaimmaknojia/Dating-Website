# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-03 00:45
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0006_auto_20160328_0744'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='comment_date',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 3, 0, 45, 18, 371292, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
