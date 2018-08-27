from rest_framework import serializers
from django.contrib.auth.models import User
from models import *

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'phoneNumber',
            'birthday',
            'gender',
            'genderPreference'
        )

class UserSerializer(serializers.ModelSerializer):
    userProfile = UserProfileSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'userProfile',
        )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'phoneNumber',
            'birthday',
            'gender',
            'genderPreference'
        )

class CommentSerializer(serializers.ModelSerializer):

    sender_user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    receiver_user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())

    class Meta:
        model = Comment
        fields = (
            'sender_user',
            'content',
            'receiver_user',
			'comment_date'
        )

class PokeSerializer(serializers.ModelSerializer):
    sender_user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    receiver_user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())

    class Meta:
        model = Poke
        fields = (
            'sender_user',
            'user_poke',
            'receiver_user'
        )


class SurveyScoresSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    survey_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = SurveyScores
        fields = (
            'survey_id',
            'user_id',
            'surveyScore'
        )