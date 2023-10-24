from django.urls import path
from researchers.views import *

app_name = 'researchers_api'

urlpatterns = [
    # Analytics related views
    path('/get-filtered-chatlogs', FilteredChatlogsView.as_view(), name='get_filtered_chatlogs'),
    path('/average-ratings', AverageRatingsView.as_view(), name='average_ratings'),
    path('/feedback-csv', FeedbackCsvView.as_view(), name='feedback_csv'),
    path('/resolve-reported-conversation', ResolveReportedConversationView.as_view(), name='resolve_reported_conversation'),
    path('/reported-conversations', ReportedConversationsListView.as_view(), name='reported_conversations'),
    path('/reported-conversations-csv', ReportedConversationsCsvView.as_view(), name='reported_conversations_csv'),
    path('/reported-chatlogs', ReportedChatlogsView.as_view(), name='reported_chatlogs'),
    path('/reported-chatlogs-csv', ReportedChatlogsCsvView.as_view(), name='reported_chatlogs_csv'),
    path('/avg-response-rate', AverageResponseRateView.as_view(), name='avg_response_rate'),
    path('/avg-response-rate-csv', ResponseRateCsvView.as_view(), name='avg_response_rate_csv'),
    path('/most-common-words', MostCommonWordsView.as_view(), name='most_common_words'),
    path('/most-common-words-wordcloud', MostCommonWordsWordcloudView.as_view(), name='most_common_words_wordcloud'),
    path('/avg-comfortability', AverageCourseComfortabilityView.as_view(), name='avg_comfortability_rating'),
    path('/avg-comfortability-csv', CourseComfortabilityCsvView.as_view(), name='avg_comfortability_rating_csv'),
    path('/interaction-frequency', InteractionFrequencyView.as_view(), name='interaction_frequency'),

    # new filter endpoints
    path('/v2/interaction-frequency', DailyInteractions.as_view(), name='get_filtered_chatlogs_new'),
    path('/v2/unique-users', UniqueUsersView.as_view(), name='unique_users'),
    path('/v2/pre-survey-distribution', SurveyQuestionDistributionView.as_view(), name='survey_distribution'),
    path('/v2/avg-conversation-response-rate', AverageConversationResponseRateView.as_view(), name='avg_conversation_response_rate'),
    path('/v2/conversation-per-user-distribution', ConversationPerUserDistributionView.as_view(), name='avg_conversation_response_rate_csv'),
    path('/v2/total-conversation-count', TotalConversationCountView.as_view(), name='total_conversation_count'),
    path('/v2/total-chatlog-count', TotalChatlogCountView.as_view(), name='total_chatlog_count'),
    path('/v2/total-post-survey-count', TotalPostSurveyResponseView.as_view(), name='total_user_count'),

    path('/v2/min-max-chatlog-count', MinMaxChatlogCountView.as_view(), name='min_max_chatlog_count'),
    path('/v2/avg-chatlog-count', AverageChatlogCountView.as_view(), name='avg_chatlog_count'),
    path('/v2/distinct-post-survey-count', DistinctUserPostSurveyQuestionCountView.as_view(), name='distinct_post_survey_count'),
    path('/v2/correct-assessment-count', CorrectAssessmentCountView.as_view(), name='correct_assessment_count'),
    path('/v2/chatlog-length-count', ChatlogLengthView.as_view(), name='avg_chatlog_length'),

    path('/v3', GetSpecificDataView.as_view(), name='get_specific_data'),
]