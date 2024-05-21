# # Step 1: Build the application
# FROM node:20-alpine AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY ./package.json ./package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the application
# RUN npm run build

# # Step 2: Create the final image
# FROM node:20-alpine

# # Set the working directory
# WORKDIR /app

# # Copy only the necessary files from the build stage
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./

# # Expose the port the app runs on
# EXPOSE 4000

# # Define the command to run the application
# CMD ["node", "dist/main.js"]




FROM node:18

# /app 이라는 폴더에서 프로젝트를 실행할 예정이므로 mkdir 명령어로 폴더를 생성
RUN mkdir -p /app

# /app 이라는 폴더에서 프로젝트를 실행
WORKDIR /app

# Dockerfile이 위치한 폴더의 모든 내용을 /app으로 복사
COPY ./package.json ./

# 프로젝트에서 사용한 패키지를 package.json 을 통하여 모두 설치
RUN npm install

# 프로젝트를 빌드
RUN npm run build

# 프로젝트에서 5000번 포트를 사용한다는 의미
EXPOSE 5000

# 빌드 이후에 dist라는 폴더에 main.js가 생성되므로 해당 파일을 실행
CMD [ "node", "dist/main.js" ]