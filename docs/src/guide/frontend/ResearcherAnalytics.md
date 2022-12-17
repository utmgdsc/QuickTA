# ResearcherAnalytics

## Introduction

Only admin users have access to ```ResearcherAnalytics```. When running, ```ResearcherAnalytics``` can be accessed via ```http://localhost:8000/ResearcherAnalytics```, or any equivalent URL followed by ```/ResearcherAnalytics```.

```ResearcherAnalytics``` allows the user to view data related to the usage of a course's ```StudentPage```.

## Dashboard

The main container for ```ResearcherAnalytics```. Consists of ```DashboardHeader``` and ```DashboardBody```.

Takes the following parameters:
| Parameter     | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| courseCode    | str    | Code of the current course   |
| courseName    | str    | Name of the current course   |
| courses       | list   | List of course objects    |
| setCurrCourse | callback    | callback to set the state of courses |
| currCourse    | object | Course object containing courseid, coursecode, and semester   |

## DashboardHeader
The header of ```Dashboard```.  Displays the course name, and calls ```CourseSelect``` and ```CourseCreator``` to select and create a course respectively.

Takes the following parameters:
| Parameter     | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| courseCode    | str    | Code of the current course   |
| courseName    | str    | Name of the current course   |
| currCourse    | object | Course object containing courseid, coursecode, and semester   |
| courses       | list   | List of course objects    |
| setCurrCourse | callback    | callback to set the state of courses |

## DashboardBody
The body of ```Dashboard```. Displays all relevant analytics for a given course. Calls ```DatedStats``` for time-sensitive data, and ```ReportTable``` for flagged conversations. User can switch between data displayed monthly, or weekly.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| courseID    | str           | Unique course ID   |
| setIsLoading | callback     | Set whether data is being recieved from backend |

## DatedStats
Fetches data from the backend to display relevant analytics. Calling ```StatCard``` to display information, ```DatedStats``` shows the user: ???

Calls ```DatedGraph``` to display total interactions as a graph, and ```FrequencyCard``` to display frequently used words.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| isWeekly    | bool          | Whether information is weekly or monthly   |
| courseID    | str           | Unique course ID   |

## StatCard
Container for analytic information for ```DatedStats```.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| title       | str           | Title of information |
| num         | int           | Current units of information |
| delta       | int           | Previous units of information |
| unit        | str           | Unit of information |
| callBack    | callback      | Function to download data |

## DatedGraph
Displays a graph for total interactions for ```DatedStats```. Uses ```ApexCharts```.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| isWeekly    | bool          | Whether information is weekly or monthly   |
| courseID    | str           | Unique course ID   |

## ReportTable
Displays a table of reported conversations for ```DatedStats```. Each conversation can be viewed, which calls ```ConversationView```.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| courseID    | str           | Unique course ID   |
| isWeekly    | bool          | Whether information is weekly or monthly   |
| setIsLoading | callback     | Set whether data is being recieved from backend |

## ConversationView
Displays a modal for a given conversation within ```ReportTable```. The conversation can be downloaded.

Takes the following parameters:
| Parameters  | Type          | Description                  |
| ----------- | ------------- | ---------------------------- |
| isOpen      | bool          | isOpen useState |
| onClose     | callback      | onClose useState |
| courseID    | str           | Unique course ID   |

