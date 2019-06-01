FROM nikolaik/python-nodejs:latest
EXPOSE 80

RUN pip install -r requirements.txt

CMD ["npm", "start"]
