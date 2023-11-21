FROM node:18-alpine
WORKDIR /app
ENV PORT=5001
ENV CONNECTION_STRING=mongodb://127.0.0.1:27017/app-palestra
ENV ACCESS_TOKEN_SECRET=chiavesegreta123
ENV MAX_PRENOTAZIONI_WEEK=5
ENV FASCE_ORARIE=16:00-17:30,17:30-19:00,19:00-20:30,20:30-22:00
RUN apk --no-cache add git
ARG BACKEND_REPO_URL=https://github.com/Giagio546/app-palestra-be
RUN git clone ${BACKEND_REPO_URL} .
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install --no-cache
EXPOSE 5001
CMD ["npm", "run", "dev"]