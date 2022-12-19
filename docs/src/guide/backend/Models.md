# Models

## User

| Fields    | Type           | Description                                                                    |
| --------- | -------------- | ------------------------------------------------------------------------------ |
| user_id   | charfield(100) | Unique user ID                                                                 |
| name      | charfield(200) | User name                                                                      |
| utorid    | charfield(10)  | User UTORid                                                                    |
| user_role | charfield(200) | User role (Student - 'ST', Instructor - 'IS', Researcher - 'RS', Admin - 'AM') |

## Course

| Fields      | Type          | Description                 |
| ----------- | ------------- | --------------------------- |
| course_id   | charfield(20) | Unique course ID (UUID)     |
| semester    | charfield(10) | Course semester (ie. 2022F) |
| course_code | charfield(10) | Course code (ie. CSC108H5F) |

## Model
| Fields     | Type          | Description                  |
| ---------- | ------------- | ---------------------------- |
| model_id   | charfield(20) | Unique model ID (UUID)       |
| model_name | textfield     | Name of the model            |
| course_id  | charfield(20) | Unique course ID (UUID)      | 

## GPTModel
| Fields            | Type            | Description 
| ----------------- | --------------- | -
| model_id          | charfield(100)  | Unique model ID (UUID)
| model_name        | charfield(100)  | Name of the model
| course_id         | charfield(100)  | Unique course ID (UUID)
| status            | booleanfield    | 
| model             | textfield(40)   | The prediction-generating AI model is specified 
| prompt            | textfield(2000) | Prompt for the model 
| suffix            | textfield(100)  | The suffix that is inserted after the inserted text.
| max_tokens        | integerfield    | The maximum amount of tokens that can be created by the model 
| temperature       | floatfield      | The temperature controls how much randomness is in the output. 
| top_p             | floatfield      | An inference time sampling threshold is specified by the top_p parameter. 
| n                 | integerfield    | The number of text generated for each prompt
| stream            | booleanfield    | 
| logprobs          | integerfield    | 
| presence_penalty  | floatfield      | The model is encouraged to create new predictions by the presence penalty parameter 
| frequency_penalty | floatfield      | The model’s propensity to repeat predictions is controlled by the frequency penalty parameter. 
| best_of           | integerfield    | 

## Conversation
| Fields               | Type           | Description                                             |
| -------------------- | -------------- | ------------------------------------------------------- |
| conversation_id      | charfield(100) | Unique conversation ID (UUID)                           |
| course_id            | charfield(100) | Unique course ID (UUID)                                 |
| user_id              | charfield(100) | Unique user ID (UUID)                                   |
| start_time           | datetimefield  | Start time of the conversation                          |
| end_time             | datetimefield  | End time of the conversation                            |
| status               | charfield(1)   | status of the conversation ('O' - opened, 'C' - closed) |
| report               | booleanfield   | true if the conversation is reported                    |
| comfortablity_rating | integerfield   | Comfortability rating of the course (1-5)               |

## Chatlog
| Fields          | Type           | Description                          |
| --------------- | -------------- | ------------------------------------ |
| conversation_id | charfield(100) | Unique conversation ID (UUID)        |
| chatlog_id      | charfield(100) | Unique chatlog ID (UUID)             |
| time            | datetimefield  | Time the chatlog is recorded         |
| is_user         | booleanfield   | true if the chatlog is from a user   |
| chatlog         | textfield      | Content of the chatlog message       |
| delta           | durationfield  | Time difference between two chatlogs |

## Report
| Fields          | Type           | Description                                   |
| --------------- | -------------- | --------------------------------------------- |
| conversation_id | charfield(100) | Unique conversation ID (UUID)                 |
| course_id       | charfield(50)  | Unique course ID (UUID)                       |
| user_id         | charfield(50)  | Unique user ID (UUID)                         |
| name            | charfield(200) | Name of the user reporting the conversation   |
| utorid          | charfield(10)  | Utorid of the user reporting the conversation |
| time            | datetimefield  | Time reported                                 |
| status          | charfield(1)   | Status of the conversation reported           |
| msg             | textfield      | Content of reported message                   |

## Feedback
| Fields          | Type           | Description                      |
| --------------- | -------------- | -------------------------------- |
| conversation_id | charfield(100) | Unique conversation ID (UUID)    |
| rating          | floadfield     | Rating of the conversation (1-5) |
| feedback_msg    | textfield      | Feedback message                 |