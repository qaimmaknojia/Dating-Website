from rest_framework import serializers
from django.contrib.auth.models import User
from models import *


class QuestionSerializer(serializers.ModelSerializer):
    survey_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Question
        fields = (
            'id',
            'question_index',
            'survey_id',
            'question_text',
            'question_type'
        )

class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Survey
        fields = (
            'id', 'survey_name', 'questions'
        )
    #todo: writable nested serializers
