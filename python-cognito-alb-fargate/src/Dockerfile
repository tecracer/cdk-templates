FROM python:3.7-alpine

COPY requirements.txt .

RUN pip install -r requirements.txt

ADD . /app

WORKDIR /app

EXPOSE 80

CMD ["gunicorn", "-b", "0.0.0.0:80", "--access-logfile", "-", "--error-logfile", "-", "webapp:app"]