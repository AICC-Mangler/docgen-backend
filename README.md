# DocGen 백엔드

DocGen은 프로젝트 문서 자동 생성 및 관리 플랫폼의 백엔드 서버입니다. 프로젝트 관리, 타임라인 추적, 요구사항 문서 생성, 공지사항 관리 등의 기능을 제공합니다.

## 📚 기술 스택

### 핵심 프레임워크 및 런타임

- **Node.js** - JavaScript 런타임
- **NestJS** `v11.0.1` - Node.js 기반 서버 사이드 애플리케이션 프레임워크
- **TypeScript** `v5.7.3` - 정적 타입 언어
- **PostgreSQL** `v8.16.3` - 관계형 데이터베이스

### 인증 및 보안

- **Passport.js** `v4.0.1` - 인증 미들웨어
  - `passport-jwt` `v4.0.1` - JWT 인증 전략
- **JWT (JSON Web Token)** - 토큰 기반 인증
- **bcryptjs** `v3.0.2` - 비밀번호 해싱
- **class-validator** `v0.14.2` - DTO 유효성 검증

### 데이터베이스 및 ORM

- **TypeORM** `v0.3.26` - 객체 관계 매핑
- **pg** `v8.16.3` - PostgreSQL 드라이버

### API 문서화 및 유틸리티

- **Swagger** `v11.2.0` - API 문서 자동 생성
- **class-transformer** `v0.5.1` - 객체 변환
- **exceljs** `v4.4.0` - Excel 파일 생성
- **axios** `v1.11.0` - HTTP 클라이언트
- **dotenv** `v17.2.1` - 환경 변수 관리

### 개발 도구

- **ESLint** `v9.18.0` - 코드 린팅
- **Prettier** `v3.6.2` - 코드 포맷팅
- **Jest** `v30.0.0` - 테스트 프레임워크
- **nodemon** - 개발 서버 자동 재시작

## 🔐 인증 관련 처리 방식

### 1. JWT 기반 인증

DocGen은 **JWT (JSON Web Token)**를 활용한 토큰 기반 인증을 지원합니다:

#### 토큰 구조

- **Access Token**: API 접근용 (기본 10분 유효)
- **Refresh Token**: 토큰 갱신용 (기본 6시간 유효)
- **Bearer Token**: Authorization 헤더를 통한 인증

#### 인증 플로우

```javascript
// JWT 설정
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '10m', // Access Token 유효기간
  refreshExpiresIn: '6h', // Refresh Token 유효기간
};
```

### 2. 역할 기반 접근 제어 (RBAC)

사용자 역할에 따른 API 접근 권한 관리:

| 역할    | 설명        | 접근 권한                |
| ------- | ----------- | ------------------------ |
| `ADMIN` | 관리자      | 전체 관리 기능           |
| `USER`  | 일반 사용자 | 개인 프로젝트, 문서 생성 |

### 3. 인증 미들웨어

```typescript
// JWT 인증 가드
@UseGuards(JwtAuthGuard)
@Controller('protected-route')
export class ProtectedController {
  // 인증이 필요한 엔드포인트
}
```

### 4. 인증 플로우

```
1. 사용자 로그인 요청
   ↓
2. 이메일/비밀번호 검증
   ↓
3. JWT 토큰 생성 (Access + Refresh)
   ↓
4. 토큰 반환
   ↓
5. 이후 요청마다 Authorization 헤더에 토큰 포함
   ↓
6. JwtAuthGuard에서 토큰 검증
   ↓
7. API 접근 허용/거부
```

## 📁 소스 구조

```
docgen-backend/
├── src/                        # 소스 코드
│   ├── config/                 # 설정 파일
│   │   ├── configuration.ts    # 환경 설정
│   │   ├── database.config.ts  # 데이터베이스 연결 설정
│   │   ├── jwt.config.ts       # JWT 토큰 설정
│   │   ├── swagger.config.ts   # Swagger API 문서 설정
│   │   └── typeorm.config.ts   # TypeORM 설정
│   │
│   ├── modules/                # 기능 모듈
│   │   ├── controllers/        # 컨트롤러
│   │   │   ├── AuthenticationController.ts
│   │   │   ├── MemberController.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── timeline.controller.ts
│   │   │   ├── document.controller.ts
│   │   │   └── notice.controller.ts
│   │   ├── entities/           # 데이터베이스 엔티티
│   │   │   ├── MemberEntity.ts
│   │   │   ├── project.entity.ts
│   │   │   ├── timeline.entity.ts
│   │   │   ├── document.entity.ts
│   │   │   ├── notice.entity.ts
│   │   │   ├── hashtag.entity.ts
│   │   │   └── refresh-token/
│   │   ├── dto/                # 데이터 전송 객체
│   │   │   ├── member.dto.ts
│   │   │   ├── project.dto.ts
│   │   │   ├── timeline.dto.ts
│   │   │   ├── document.dto.ts
│   │   │   ├── notice.dto.ts
│   │   │   ├── request/        # 요청 DTO
│   │   │   └── response/       # 응답 DTO
│   │   ├── services/           # 비즈니스 로직
│   │   ├── guard/              # 인증 가드
│   │   │   └── JwtAuthGuard.ts
│   │   ├── strategy/           # 인증 전략
│   │   │   └── JwtStrategy.ts
│   │   └── type/               # 공통 타입 정의
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── excel.util.ts       # Excel 파일 생성
│   │   └── http.helper.ts      # HTTP 헬퍼
│   │
│   ├── scripts/                # 스크립트
│   ├── app.module.ts           # 메인 앱 모듈
│   ├── app.controller.ts       # 메인 컨트롤러
│   ├── app.service.ts          # 메인 서비스
│   └── main.ts                 # 애플리케이션 진입점
│
├── dist/                       # 컴파일된 JavaScript 파일
├── test/                       # 테스트 파일
├── docs/                       # 문서
│   ├── docgen-front-api.yaml   # API 스펙
│   └── docgen.erd              # 데이터베이스 ERD
├── deploy/                     # 배포 설정
│   ├── dockerfile              # Docker 설정
│   └── jenkinsfile             # Jenkins 설정
├── uploads/                    # 업로드된 파일
├── package.json                # Node.js 의존성 관리
├── tsconfig.json               # TypeScript 설정
├── eslint.config.mjs           # ESLint 설정
└── README.md                   # 프로젝트 문서
```

### 주요 디렉토리 설명

#### `src/config/`

- **database.config.ts**: PostgreSQL 연결 설정
- **jwt.config.ts**: JWT 토큰 설정 (시크릿, 만료시간)
- **typeorm.config.ts**: TypeORM 엔티티 및 데이터베이스 설정
- **swagger.config.ts**: API 문서화 설정

#### `src/modules/`

- **controllers/**: 각 도메인별 API 엔드포인트 처리
- **entities/**: 데이터베이스 테이블과 매핑되는 엔티티 클래스
- **dto/**: 요청/응답 데이터 구조 정의
- **services/**: 비즈니스 로직 처리
- **guard/**: 인증 및 권한 검증 미들웨어

## 🔄 기본적인 소스 플로우

### 1. 애플리케이션 시작

```
main.ts
  ├── NestFactory.create(AppModule)
  ├── CORS 설정
  ├── ValidationPipe 설정
  ├── Swagger 문서 설정
  └── 서버 리스닝 (PORT 3100)
```

### 2. 일반적인 API 요청 플로우

```
클라이언트 요청
    ↓
[CORS 검증]
    ↓
[ValidationPipe] - DTO 유효성 검증
    ↓
[Controller] - 엔드포인트 처리
    ↓
[Service] - 비즈니스 로직
    ↓
[Repository/TypeORM] - 데이터베이스 쿼리
    ↓
[Response] - JSON 형식 응답
```

### 3. 인증이 필요한 API 플로우

```
POST /authentication/signin
    ↓
MemberService.signIn()
    ↓
비밀번호 검증 (bcryptjs)
    ↓
JWT 토큰 생성 (Access + Refresh)
    ↓
응답: { accessToken, refreshToken, expiresIn }
    ↓
이후 요청마다 Authorization: Bearer {token}
    ↓
JwtAuthGuard에서 토큰 검증
```

### 4. 프로젝트 관리 플로우

```
프로젝트 생성
    ↓
ProjectController.createProject()
    ↓
ProjectService.createProjectRaw()
    ↓
TypeORM으로 데이터베이스 저장
    ↓
해시태그 연결 (Many-to-Many)
    ↓
응답: 프로젝트 정보 + 해시태그
```

### 5. 문서 생성 플로우

```
문서 생성 요청
    ↓
DocumentController.createRequirementDocument()
    ↓
DocumentService.create_requirement_document()
    ↓
외부 API 호출 (axios)
    ↓
문서 ID 생성 및 저장
    ↓
Excel 파일 생성 (exceljs)
    ↓
파일 다운로드 제공
```

## 🚀 동작 방법

### 1. 환경 설정

#### 필수 요구사항

- **Node.js** v18 이상
- **PostgreSQL** v12 이상
- **npm** 또는 **yarn**

#### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다:

```bash
# 서버 설정
APP_PORT=3100
NODE_ENV=development

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=docgen
DB_SCHEMA=public

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-here-2025
JWT_EXPIRES_IN=10m
JWT_REFRESH_EXPIRES_IN=6h

# CORS 설정
CORS_ORIGINS=http://localhost:8181,https://docgen.aicc-project.com
```

### 2. 설치 및 실행

#### 의존성 설치

```bash
npm install
```

#### 개발 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run start:dev

# API 서버 (포트 3100)
npm run start:api

# 일반 시작
npm start
```

#### 프로덕션 빌드 및 실행

```bash
# 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

서버가 정상적으로 시작되면 다음 메시지가 출력됩니다:

```
Application is running on: http://localhost:3100
```

### 3. 데이터베이스 설정

PostgreSQL에서 다음 테이블들이 자동으로 생성됩니다:

- `member` - 사용자 정보
- `project` - 프로젝트 정보
- `timeline` - 프로젝트 타임라인
- `document` - 문서 정보
- `notice` - 공지사항
- `hashtag` - 해시태그
- `project_hashtag` - 프로젝트-해시태그 연결
- `refresh_token` - 리프레시 토큰

### 4. API 테스트

#### Swagger 문서 접근

```
http://localhost:3100/api-docs
```

#### 로그인 테스트

```bash
POST http://localhost:3100/authentication/signin
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "your_password"
}
```

#### 인증된 요청 테스트

```bash
GET http://localhost:3100/projects?id=1
Authorization: Bearer {access_token}
```

### 5. 파일 다운로드

생성된 Excel 문서는 다음 경로로 접근 가능합니다:

```
GET http://localhost:3100/document/requirement/file/{document_id}
GET http://localhost:3100/document/functional/file/{document_id}
GET http://localhost:3100/document/policy/file/{document_id}
```

## 🔧 주요 API 엔드포인트

### 인증

- `POST /authentication/signup` - 회원가입
- `POST /authentication/signin` - 로그인
- `POST /authentication/signout` - 로그아웃
- `POST /authentication/refresh` - 토큰 갱신

### 회원 관리

- `GET /member/list` - 전체 회원 조회
- `GET /member/:id` - 특정 회원 조회
- `POST /member/access` - 프로젝트 열람 권한 부여
- `PATCH /member/password/update` - 비밀번호 변경
- `DELETE /member` - 회원 탈퇴

### 프로젝트 관리

- `GET /projects` - 프로젝트 목록 조회
- `GET /projects/:id` - 특정 프로젝트 조회
- `GET /projects/count/:id` - 회원별 프로젝트 개수
- `POST /projects` - 프로젝트 생성
- `PUT /projects/:id` - 프로젝트 수정
- `DELETE /projects/:id` - 프로젝트 삭제

### 타임라인 관리

- `GET /timelines/projects?id={projectId}` - 프로젝트별 타임라인 조회
- `POST /timelines` - 타임라인 생성
- `PUT /timelines/:id` - 타임라인 수정
- `DELETE /timelines/:id` - 타임라인 삭제

### 문서 관리

- `POST /document/requirement` - 요구사항 문서 생성
- `POST /document/requirement/questions` - 요구사항 질문 생성
- `GET /document/requirement/:document_id` - 요구사항 문서 조회
- `GET /document/requirement/file/:document_id` - 요구사항 Excel 다운로드
- `DELETE /document/requirement/:document_id` - 요구사항 문서 삭제
- `POST /document/functional` - 기능 명세서 생성
- `GET /document/functional/file/:document_id` - 기능 명세서 Excel 다운로드
- `POST /document/policy` - 정책 문서 생성
- `GET /document/policy/file/:document_id` - 정책 문서 Excel 다운로드
- `GET /document/project/:project_id` - 프로젝트별 문서 목록
- `GET /document/users/:user_id` - 사용자별 문서 목록

### 공지사항 관리

- `GET /notices` - 공지사항 목록 조회 (페이지네이션)
- `GET /notices/:noticeId` - 공지사항 상세 조회
- `POST /notices` - 공지사항 생성
- `PUT /notices/:noticeId` - 공지사항 수정
- `DELETE /notices/:noticeId` - 공지사항 삭제

## 📝 개발 가이드

### 새로운 API 추가하기

1. **엔티티 생성** (`src/modules/entities/`)

```typescript
@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  created_date_time: Date;
}
```

2. **DTO 생성** (`src/modules/dto/`)

```typescript
export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class EntityResponseDto {
  id: number;
  name: string;
  created_date_time: Date;
}
```

3. **서비스 생성** (`src/modules/services/`)

```typescript
@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(EntityName)
    private entityRepository: Repository<EntityName>,
  ) {}

  async create(createDto: CreateEntityDto): Promise<EntityName> {
    const entity = this.entityRepository.create(createDto);
    return await this.entityRepository.save(entity);
  }
}
```

4. **컨트롤러 생성** (`src/modules/controllers/`)

```typescript
@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  async create(@Body() createDto: CreateEntityDto) {
    return await this.entityService.create(createDto);
  }
}
```

5. **모듈에 등록** (`src/modules/module.ts`)

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([EntityName])],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
```

### 데이터베이스 쿼리 실행

```typescript
// TypeORM Repository 사용
const entities = await this.entityRepository.find({
  where: { name: 'example' },
  relations: ['relatedEntity'],
});

// Raw Query 사용
const result = await this.entityRepository.query(
  'SELECT * FROM table_name WHERE condition = $1',
  [value],
);
```

## 🛡️ 보안 고려사항

- ✅ JWT 토큰 기반 인증으로 세션 관리
- ✅ bcryptjs를 통한 비밀번호 해싱
- ✅ CORS 정책으로 허용된 도메인만 접근 가능
- ✅ class-validator를 통한 입력 데이터 검증
- ✅ TypeORM을 통한 SQL 인젝션 방지
- ✅ 환경 변수를 통한 민감 정보 관리
- ✅ Refresh Token을 통한 토큰 갱신 메커니즘

## 📄 라이선스

UNLICENSED

## 👥 기여자

DocGen 개발팀

---

**DocGen** - 프로젝트 문서 자동 생성 및 관리 플랫폼
