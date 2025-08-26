## Environment Configuration

프로젝트를 실행하기 전에 환경 변수를 설정해야 합니다.

1. `.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=docgen_db
DB_SCHEMA=public

# Application Configuration
APP_PORT=3000
APP_ENV=development
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=6h
```

2. 데이터베이스 연결 정보를 실제 환경에 맞게 수정하세요.

3. `env.example` 파일을 참고하여 필요한 환경 변수를 추가하세요.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
