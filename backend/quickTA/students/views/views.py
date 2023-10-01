

# Exceptions
class UserAlreadyExistsError(Exception): pass
class CourseAlreadyExistsError(Exception): pass
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass
class OverRatingLimitError(Exception): pass
class FeedbackExistsError(Exception): pass
class MissingReportMessageError(Exception): pass
class ModelDoesNotExistsError(Exception): pass