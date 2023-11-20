FROM node:18-alpine
WORKDIR /app
RUN apk --no-cache add git
ARG BACKEND_REPO_URL=https://github.com/Giagio546/app-palestra-be
RUN git clone ${BACKEND_REPO_URL} .
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install --no-cache
EXPOSE 5001
CMD ["npm", "run", "dev"]