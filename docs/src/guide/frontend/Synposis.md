# Synposis

## Introduction
The frontend of QuickTA consists of five main pages: ```StudentPage```, ```ResearcherAnalytics```, ```ResearcherFilters```, and ```ResearcherModels```. Users with student access can only access ```StudentPage```, while users with admin access can access **all pages**.

## Running QuickTA

### First Time Setup
```
cd backend
pip install -r requirements.txt
cd ../frontend
npm i
```
**Note:** Ensure Python version is Python 3.10

### Running Backend
```
cd backend
./env/bin/activate
cd quickTA
python manage.py runserver
```
**Note:** Run ```source env/bin/activate``` instead of ```./env/bin/activate```

### Running Frontend
```
cd frontend
npm run start
```