FROM nikolaik/python-nodejs:latest
EXPOSE 1500

COPY . .
RUN pip install -r requirements.txt && npm install

CMD ["npm", "start"]
