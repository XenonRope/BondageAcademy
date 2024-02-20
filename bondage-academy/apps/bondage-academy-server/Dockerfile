FROM docker.io/node:20.11.1-alpine

LABEL org.opencontainers.image.source https://github.com/XenonRope/BondageAcademy

ENV HOST=0.0.0.0
ENV PORT=3000
ENV MONGODB_CONNECTION_STRING=mongodb://root:root@mongodb:27017/admin?replicaSet=rs0

WORKDIR /app

RUN addgroup --system bondage-academy-server && \
  adduser --system -G bondage-academy-server bondage-academy-server

COPY dist/apps/bondage-academy-server bondage-academy-server
RUN chown -R bondage-academy-server:bondage-academy-server .

CMD [ "node", "bondage-academy-server" ]
