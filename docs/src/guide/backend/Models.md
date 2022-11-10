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