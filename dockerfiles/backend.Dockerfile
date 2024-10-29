FROM node:18
WORKDIR /app
COPY ./backend .
COPY ./*.env .
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y ffmpeg && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN mkdir -p /app/uploads
RUN mkdir -p /app/uploads/video
RUN mkdir -p /app/uploads/gif
CMD ["node", "index.js"]