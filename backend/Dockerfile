FROM python:3.10

WORKDIR /backend

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

WORKDIR /backend/quickTA

EXPOSE 8000

CMD [ "python", "manage.py", "runserver" ]