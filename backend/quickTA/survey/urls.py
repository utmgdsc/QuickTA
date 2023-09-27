from django.urls import path
from .views import *

app_name = 'survey_api'

urlpatterns = [
    path('', SurveyView.as_view()),
    path('/all', SurveryListView.as_view()),
    path('/details', SurveyAllQuestionsView.as_view()),
    path('/questions', SurveyQuestionView.as_view()),
    path('/questions/all', SurveyQuestionListView.as_view()),
    path('/questions/answer', AnswerQuestionView.as_view()),
    path('/active', ActiveSurveyView.as_view()),
    path('/activate', ActivateSurveyView.as_view()),
]