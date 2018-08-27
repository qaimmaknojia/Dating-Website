from django.http import HttpResponse

from answer.models import Answer
from survey.models import Question, Survey
from django.contrib.auth.models import User
from member.models import UserProfile, SurveyScores
import math
import json
from operator import itemgetter

def _saveSurveyScore(userId, surveyId, surveyScore):
    existingSurvey = SurveyScores.objects.filter(user_id=userId, survey_id=surveyId)
    if not existingSurvey:
        SurveyScores.objects.create(user_id=userId, survey_id=Survey.objects.get(pk=surveyId), surveyScore=surveyScore)
    else:
        return surveyScore

class SurveyHeuristicScore:
    compatibilityPercentage = 0
    userId = -1
    survey = -1

class Match():
    def __init__(self, userId):
        self.matches = []
        self.userId = userId

    def generateSurveyScoreForUser(self, surveyId):
        # Grab all answers for this member
        answers = Answer.objects.filter(user_id=self.userId, survey_id=surveyId).order_by("question_id__question_index")

        if (answers.count() == 0):
            raise Exception("SurveyNotYetCompletedError")

        # Intro Survey Calculation
        if (surveyId == "1"):

            gender = answers.get(question_id__question_index=0).value
            genderPreference = answers.get(question_id__question_index=1).value

            # Save UserProfile settings
            user = User.objects.get(id = self.userId)
            if user is not None:
                userProfile, created = UserProfile.objects.get_or_create(user=user)
                userProfile.gender = gender
                userProfile.genderPreference = genderPreference
                userProfile.save()

            # Calculate Survey score for survey 1
            surveyScore = 0
            for i in range(1, len(answers), 1):

                userAnswer = answers.get(question_id__question_index=i)
                questionScore = int(userAnswer.value)
                questionType = Question.objects.get(pk=userAnswer.question_id.id)

                # Normalize boolean questions from 0 - 5.
                if (questionType.question_type == 0):
                    questionScore = questionScore * 5

                surveyScore += questionScore

            _saveSurveyScore(self.userId, surveyId, surveyScore)

        if (surveyId == "2"):
            surveyScore = 0
            for i in range(0, len(answers), 1):

                userAnswer = answers.get(question_id__question_index=i)
                questionScore = int(userAnswer.value)
                questionType = Question.objects.get(pk=userAnswer.question_id.id)

                # Normalize boolean questions from 0 - 5.
                if (questionType.question_type == 0):
                    questionScore = questionScore * 5

                surveyScore += questionScore

            _saveSurveyScore(self.userId, surveyId, surveyScore)

        if (surveyId == "3"):
            surveyScore = 0
            for i in range(0, len(answers), 1):

                userAnswer = answers.get(question_id__question_index=i)
                questionScore = int(userAnswer.value)
                questionType = Question.objects.get(pk=userAnswer.question_id.id)

                # Normalize boolean questions from 0 - 5.
                if (questionType.question_type == 0):
                    questionScore = questionScore * 5

                surveyScore += questionScore

            _saveSurveyScore(self.userId, surveyId, surveyScore)

    def getUserMatches(self, surveyId):
        userProfile = UserProfile.objects.get(user_id=self.userId)
        gender = userProfile.gender
        genderPreference = userProfile.genderPreference
        userSurveyScore = SurveyScores.objects.get(user_id=self.userId, survey_id=surveyId)

        # Finds gender preferences
        userGenderPreferenceMatches = UserProfile.objects.filter(gender=genderPreference, genderPreference=gender).values('user')
        userMatchCompatibilityScores = []

        # Of those matched gender preference users, find closest surveyScore. compute heuristic score...
        for userMatch in userGenderPreferenceMatches:
            #Get SurveyScore of potential match
            userMatchId = userMatch['user']
            matchedSurveyScore = SurveyScores.objects.filter(user=userMatchId, survey_id=surveyId).first()

            if (matchedSurveyScore == None):
                continue

            heuristicScore = 100 - math.fabs(userSurveyScore.surveyScore - matchedSurveyScore.surveyScore)

            if heuristicScore < 0:
                heuristicScore = 0

            if str(userMatchId) != str(self.userId):
                userMatchCompatibilityScores.append([userMatchId, heuristicScore])

        userMatchCompatibilityScores = sorted(userMatchCompatibilityScores, key=itemgetter(1), reverse=True)
        return json.dumps(userMatchCompatibilityScores)