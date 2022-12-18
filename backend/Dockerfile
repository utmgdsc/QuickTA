FROM python:3.10

WORKDIR /backend

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

WORKDIR /backend/quickTA

EXPOSE 8000

ENTRYPOINT [ "python", "manage.py" ]
CMD ["runserver", "0.0.0.0:8000"]