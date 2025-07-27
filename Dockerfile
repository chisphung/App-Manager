FROM node:20

WORKDIR /app

# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json 
# COPY pnpm-lock.yaml /app/pnpm-lock.yaml
COPY . /app/

RUN npm install -g pnpm
RUN npm install
ENV CI=true
RUN pnpm install --frozen-lockfile 



EXPOSE 3000
CMD ["pnpm", "run", "dev"]
