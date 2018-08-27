from rest_framework import serializers
from django.contrib.auth.models import User
from models import *

class AnswerSerializer(serializers.ModelSerializer):
    survey_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Survey.objects.all())
    question_id = serializers.PrimaryKeyRelatedField(many=False, queryset=Question.objects.all())
    user_id = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())

    class Meta:
        model = Answer
        fields = (
            'id',
            'survey_id',
            'question_id',
            'user_id',
            'value'
        )