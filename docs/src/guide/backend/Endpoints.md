# Endpoints
---
There are three main different categories of endpoints that are separated by their user functions. The following is the base URL for the three categories of endpoints:

- Students (ST):  <code>http://localhost:8000/api</code>
- Instructors/Researchers (IS/RS): <code>http://localhost:8000/api/resarcher</code>
- Admin (AM): <code>http://localhost:8000/api/admin</code>

To see the comprehensive documentation of the endpoints, after running the backend server on your local computer, visit either link:

- Swagger Documentation: <a href="http://localhost:8000/api/swagger/schema/">http://localhost:8000/api/swagger/schema/</a>
- Redoc Documentation: <a href="http://localhost:8000/api/redoc">http://localhost:8000/api/redoc</a>

## Student Endpoints
### **User related endpoints**
- **Create user**: <code>/user</code> Creates a new user.
- **Get user**: <code>/get-user</code> Acquires a user's information given their utorid. 
- **Get user courses**: <code>/user/courses</code> Acquires the user's list of enrolled courses.

### **Course related endpoints**
- **Create course**: <code>/course</code> Creates a new course.
- **Get course**: <code>/get-course</code> Retrieves a current course's information.
- **Get all courses**: <code>/course/all</code> Retrieves all courses.

### **Conversation related endpoints**
- **Start conversation**: <code>/conversation</code> Retrieves a request to start a session.
- **Comfortability Rating**: <code>/comfortability-rating</code> Adds a course comfortability rating to the corresponding conversation.
- **Post chatlog**: <code>/chatlog</code>: Retrieves and posts a chatlog from the user, then returns a response from the OpenAI model.
- **Post feedback**: <code>/feedback</code> Retrieves and saves a feedback from the user to the database.
    Logs the conversation as inactive afterwards.
- **Acquire all conversation chatlogs**: <code>/report</code> Retrieves the conversation id and returns a copy of the chatlog.
- **Report incorrect answers**: <code>/incorrect-answer</code> Flags the given answer of a particular conversation as wrong.

## Instructor / Researcher Endpoints
### Analytics Endpoints:
- **Get Average Ratings**: <code>researcher/average-ratings</code> Acquires the average ratings of a course.
- **Get Average Ratings (CSV)**:<code>researcher/average-ratings-csv</code> Acquires the average ratings of a course in a CSV file.
- **Get reported conversations:** <code>researcher/reported-conversations</code> Returns all reported conversations of a given course.
- **Get reported conversations (CSV):**<code>researcher/reported-conversations-csv</code> Returns all reported conversations of a given course in a CSV file. 
- **Resolve reported conversations**: <code>researcher/resolve-reported-conversation</code>  Resolves a reported conversation.
- **Get reported conversation chatlogs**:<code>researcher/report-chatlogs</code> Returns all of the chatlogs of a reported conversation ID.
- **Get reported chat**:<code>researcher/reported-chatlogs-csv</code> Retrieves the reported conversation id and returns a CSV copy of the chatlog.
- **Get average response rate**:<code>researcher/avg-response-rate</code> Acquires the average response rate of a given course.
- **Get average response rate (CSV)**:<code>researcher/avg-response-rate-csv</code> Acquires a CSV containing the average response rate of a given course.
- **Get most common words**:<code>researcher/most-common-words</code> Acquires the most common topics within user responses for a given course.
- **Get average comfortability rating**:<code>researcher/avg-comfortability-rating</code> Acquires the average course comfortability rating for a given course.
- **Get average comfortability rating (CSV)**:<code>researcher/avg-comfortability-rating-csv</code> Retrieves a CSV copy of all the course comfortability ratings of a given course id.
- **Get interaction frequency**:<code>researcher/interaction-frequency</code> Retrieves the interaction frequency of QuickTA of a given

### Filters Endpoints:
- **Get filtered chatlogs**:<code>researcher/get-filtered-chatlogs</code>

### Course Information Endpoints
- **Get course's student list**: <code>researcher/course-student-list</code> Acquires the information of all students of a course given the course_id.

### GPT Model Configuration Endpoints
- **GPT model create**:<code>researcher/gptmodel-create</code>  Creates a GPT Model given the parameter specifications.
- **GPT model update**: <code>researcher/gptmodel-update</code> Updates a particular GPT model.
- **GPT model activate**: <code>researcher/gptmodel-activate</code> Activates a selected GPTModel.
- **GPT model get one**: <code>researcher/gptmodel-get-one</code> Acquires one GPT Model when given the course ID and model ID.
- **GPT model get course**: <code>researcher/gptmodel-get</code> Returns all GPT models related to a course.
- **GPT model get all course**: <code>researcher/gptmodel-get-all </code> Retrieves all GPT models from all courses.
- **GPT model delete**: <code>researcher/gptmodel-delete </code> Deletes a GPT model configuration.

## Admin Endpoints
- **Add a user**:<code>admin/add-user</code> Add a single user
- **Add multiple users**:<code>admin/add-multiple-user</code> Adds multiple users.
- **Add user to a course**:<code>admin/add-user-course</code> Links a user to a course.
- **Add multiple users to a course**:<code>admin/add-multiple-user-course</code> Links multiple user to a course.
- **Remove a user from a course**:<code>admin/remove-user-course</code> Removes a user from a course.
- **Import all students from CSV List**:<code>admin/import-all-students-from-csv</code> Adds the list of students in the CSV file passed it into a specific course.

