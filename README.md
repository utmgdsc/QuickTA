# QuickTA
---
## Description

QuickTA is a web application designed to give students direct, automated assistance. In the case of a complex assignment, guidance on its various components may be scattered across multiple pages. This will lead to student confusion, and while the answer may exist in a specific post, the student may continue to post their question, leading to occupied staff time. QuickTA aims to reduce this, with a goal to ultimately reduce the answering responsibilities of a teaching staff, and to shift it towards an automated program.

To achieve this, QuickTA will offer a simple interface, allowing students to ask QuickTA a question. Using NLP (OpenAI's GPT-3 Model), QuickTA will parse and match the given inquiry to an appropriate answer. If the supplied answer was insufficient or the program cannot answer the given question, the user is prompted whether to send the inquiry to the teaching staff. Though ultimately, QuickTA should be able to reduce such messages to the teaching staff, allowing for less productive hours occupied by answering inquiries.


## Problem Statement

Within a course environment, the responsibilities of teaching staff include facilitating a learning environment, marking assessments, and answering student inquiries. In the case of the latter, answering these inquiries is often a burdensome process—a large amount of productive hours are often dedicated to responding to student questions. These questions can often be redundant or easily anticipated, though nevertheless a member of the teaching staff must still tailor an appropriate response. 

Currently, the only solution to mitigate these redundant/easily anticipated questions is to include an “FAQ” page. While effective to an extent, students can often overlook an “FAQ” as the student themself must personally parse the page for solutions. Such a conundrum was the inspiration for QuickTA, an web application to give students direct, automated assistance.


## Key Features

- Automated assistance responses regarding course content inquiries by students
- Data extraction from student responses (course comfortability, student ratings, response rates, interaction frequency) through a dashboard view in weekly and monthly visualizations
- Keyword extraction from student's conversations with the agent through unsupervised approaches based on text statistical features using YAKE
- GPT Model configurations for instructor with ease in prompt engineering and other configurations

---
## Quickstart

Clone the project into your local machine:
```
git clone https://github.com/utmgdsc/QuickTA.git
```

### Frontend configuration
Change directories from the root directory of the project on your local machine into the frontend folder and install relevant dependencies with `npm`:
```
cd frontend
npm install
```

Afterwards, create a `.env`file under the frontend folder:
```
REACT_APP_API_URL="http://127.0.0.1:8000/api"
```

Finally, run the frontend server with the following command:
```
npm run start
```

### Backend configuration
To run the backend server , download all the required python package dependencies through `pip` and then run the django backend server with the following commands:

```
# Change directories from the root directory to backend
cd backend
pip install -r requirements.txt
cd quickTA
python3 manage.py runserver
```

---
## Comprehensive Documentation

To access the documentation of QuickTA, enter the following in your terminal at the project root directory:

```
cd docs
npm install
npm run dev
```

The vuepress documentation provides extensive information regarding both the frontend and the backend.

---

## QuickTA Architecture

The following illustrations provides a glimpse of the data flow and operational procedures of quickTA. They provide all the implemented endpoints, and how the user interacts with the core QuickTA responding agent.

### Shibboleth Authentication 
<img width="499" alt="image" src="https://user-images.githubusercontent.com/29339332/205561506-1cd5cdc5-6fe4-4138-82e6-475f4c124096.png">

### User view
<img width="593" alt="image" src="https://user-images.githubusercontent.com/29339332/205561557-20da2723-4272-4680-a292-6e41dfff5147.png">

### Instructor/Researcher view 
<img width="670" alt="image" src="https://user-images.githubusercontent.com/29339332/205561611-a2a02694-093d-4a3d-863a-ab2e92205b18.png">

### Admin view
<img width="367" alt="image" src="https://user-images.githubusercontent.com/29339332/205561626-f47bb150-645a-4acb-8403-7d08d75c5715.png">

