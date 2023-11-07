from django.urls import path
from .views import *

app_name = 'assessment_api'

urlpatterns = [
    # Pre/Post question endpoints
    path('', AssessmentView.as_view()),
    path('/all', AssessmentListView.as_view()),
    path('/question', AssessmentQuestionView.as_view()),
    path('/question/all', AssessmentQuestionListView.as_view()),
    path('/question/answer', AnswerAsessmentQuestionView.as_view()),
    path('/v2/question/answer', AnswerAsessmentQuestionOnlyView.as_view()),
    path('/question/random', RandomAssessmentQuestionView.as_view()),
    path('/v2/question/random', AssessmentQuestionBankView.as_view()),
]