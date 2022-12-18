# Shared Components

## TopNav

The header of each page. Displays the QuickTA logo, utorid, and logout button.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| courseCode    | str    | Code of the current course   |
| courseName    | str    | Name of the current course   |
| courses       | list   | List of course objects    |
| setCurrCourse | callback    | callback to set the state of courses |
| currCourse    | object | Course object containing courseid, coursecode, and semester   |

## CourseSelect

Dropdown container allowing user to select a course.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| currCourse    | object | Course object containing courseid, coursecode, and semester   |
| setCurrCourse | callback | callback to set the state of courses |
| waiting | bool  | Whether to disable page while loading |

## CourseCreator

Allows the user to create a course.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| userid    | str    | Unique ID of user   |