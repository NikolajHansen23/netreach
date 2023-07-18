FROM node:16-alpine
ENV PUPPETEER_CACHE_DIR=/usr/src/app
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD /bin/sh -c 'npm run start && cat output/scan-*.txt'