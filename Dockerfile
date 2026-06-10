FROM node:22-alpine

WORKDIR /app

# Install dependencies in a cached layer (only re-runs when lockfile changes).
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
