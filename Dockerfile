FROM node:slim

LABEL org.opencontainers.image.source="https://github.com/the-noona-project/noona-vault"
LABEL authors="the-noona-project"

# Install necessary packages (curl + future-proofing for DBs like MariaDB client if needed later)
RUN apt update && apt install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /noona/vault/

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy entire project
COPY . .

# Default command
CMD ["node", "initmain.mjs"]
