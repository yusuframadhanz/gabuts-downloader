FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends python3 ca-certificates ffmpeg     && rm -rf /var/lib/apt/lists/*     && python3 -m pip install --break-system-packages --no-cache-dir -U yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
