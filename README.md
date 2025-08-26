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

## 구조 설명 (예시 : member)

1. API
/member (Base Path)
├── GET /           → 전체 멤버 조회
├── GET /:id        → 특정 멤버 조회
├── POST /          → 새 멤버 생성
├── PUT /:id        → 멤버 수정
└── DELETE /:id     → 멤버 삭제 (Soft Delete)  << 어떻게 삭제시킬지에 따라 다르게 적용할 수 있음

2. 요청 - 응답 흐릅 (request & response cycle)
```
1. Client Request
   ↓
2. NestJS Router
   ↓
3. Controller (요청 검증)
   ↓
4. Service (비즈니스 로직)
   ↓
5. Repository (데이터베이스 쿼리)
   ↓
6. PostgreSQL Database
   ↓
7. Repository (결과 반환)
   ↓
8. Service (데이터 처리)
   ↓
9. Controller (응답 포맷팅)
   ↓
10. Client Response
```
