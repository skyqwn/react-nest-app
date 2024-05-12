FROM node:latest

#이미지 안에 애플리케이션 코드를 넣기위한 디렉터리 생성
WORKDIR /usr/src/app

#앱 의존성 설치
#가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해 와일드카드를 사용
COPY package*.json ./

RUN npm install

# 앱 소스 추가
COPY . .

EXPOSE 80
# 여기서는 서버를 구동하도록 node app.js을 실행하는 기본 npm start을 사용할 것이다.
# 서버가 구동되는 파일명 app.js
CMD [ "node", "app.js" ]