# StudentPage

## Introduction

All users have access to ```StudentPage```. When running, ```StudentPage``` can be accessed via ```http://localhost:8000/Student```, or any equivalent URL followed by ```/Student```.

```StudentPage``` consists of a primary chatbox, allowing the user to send messages to an AI model. Under certain conditions (e.g. logging out), the user will be prompted to enter a survey.

## Chat

The main container for the chatbox within ```StudentPage```. Consists of ```ChatOpenSurvey```, ```CharBoxTopNav```, ```ChatBox```, and ```CharBoxFooter```. 

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| currCourse    | object | Course object containing courseid, coursecode, and semester   |
| courses       | list   | List of course objects    |
| setCurrCourse | callback    | callback to set the state of courses |


## ChatOpenSurvey
Modal that is automatically called when a user opens ```StudentPage```. Prompts the user to rate their current comfortability with the course material from 1-5.

## ChatBoxTopNav
The header of ```Chat```. Displays the current course's name. Allows the user to **download** and **report** the current conversation.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | ---------------------------- |
| courseCode  | str           | Code of the current course   |
| currConvoID | str           | Unique conversation ID       |

## ChatBox
The body of ```Chat```. Maps conversation messages to ```ChatBubble``` components.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | ----------------------------- |
| messages    | list          | List of objects containing message, datesent, and isUser |

## ChatBubble
Called by ```ChatBox``` and displays a single message. Can be a message from the AI model or the user.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | -----------------------------  |
| key         | int           | Current index of messages list |
| message     | str           | Contents of message            |
| dateSent    | str           | Date message was sent          |
| isUser      | bool          | Whether message is from user   |

## ChatBoxFooter
The footer of ```Chat```. Allows the user to initiate, end, and send messages within a conversation.

Takes the following properties:
| Properties    | Type   | Description                  |
| -------------- | ------------- | -----------------------------  |
| updateMessages | callback      | Function to update messages |
| inConvo        | bool          | Whether user is in a conversation |
| updateInConvo  | callback      | Function to update user in convo |
| currConvoID    | str           | Unique conversation ID   |
| updateConvoID  | callback      | Function to update convo ID   |
| course_ID      | str           | Unique course ID   |
| messages    | list          | List of objects containing message, datesent, and isUser |

## FeedbackSurvey
Modal that is called when a user ends a conversation. Prompts the user to rate their experience with the course material from 1-5, and asks for text feedback.

Takes the following properties:
| Properties    | Type   | Description                  |
| -------------- | ------------- | -----------------------------  |
| isOpen         | bool          | isOpen useState |
| onClose        | callback      | onClose useState |
| conversation_id| str           | Unique conversation ID |
| updateConvoID  | callback      | Function to update convo ID   |
| updateInConvo  | callback      | Function to update user in convo |
| updateMessages | callback      | Function to update messages |