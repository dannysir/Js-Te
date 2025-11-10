# NPM 패키지 생성 & 배포 방법

## 1. 패키지 초기화

### package.json 생성
```bash
npm init
```

### 주요 설정

```json
{
  "name": "js-te",
  "version": "0.0.1",
  "type": "module",
  "description": "JavaScript test library",
  "main": "index.js",
  "bin": {
    "js-te": "./bin/cli.js"
  },
  "scripts": {
    "test": "node bin/cli.js"
  },
  "keywords": ["JavaScript", "test"],
  "author": "dannysir",
  "license": "ISC"
}
```

#### 필드 설명
- **name**: 패키지 이름 (npm에서 고유해야 함)
- **version**: 시맨틱 버저닝 ( ex: `1.1.1` => `(major).(minor).(patch)` )
- **type**: "module"로 설정 시 ESM 사용
- **main**: 패키지의 진입점 파일
- **bin**: CLI 명령어 정의 (실행 가능한 스크립트)
- **keywords**: npm 검색 최적화용

## 2. 모듈 시스템 선택

### ESM (ES6 Modules)
```json
{
  "type": "module"
}
```
- `import/export` 구문 사용
- 최신 JavaScript 표준
- 비동기 로딩 지원
- `require/module.exports` 구문 사용
- Node.js 전통적인 방식
- 동기 로딩

## 3. CLI 도구 만들기

### bin 필드 설정
```json
{
  "bin": {
    "js-te": "./bin/cli.js"
  }
}
```

### 실행 파일 생성 (bin/cli.js)
```javascript
#!/usr/bin/env node

// CLI 로직
console.log('Hello from CLI!');
```

**중요**: Shebang(`#!/usr/bin/env node`)이 첫 줄에 있어야 함

## 4. 로컬 테스트

### 4 - 1 로컬 테스트 (npm link)

1. 개발한 npm 패키지에서 `npm link`.
2. 로컬에 테스트 할 프로젝트에서 `npm link 패키지명`.
3. npm 패키지에서 bin에 설정한 명령어 입력.

```
"bin": {
    "js-te": "./bin/cli.js" // 이럴 경우 'js-te'가 명령어.
},
```

### 4 - 2 로컬 테스트 완료 (npm unlink)

1. 테스트한 레포에서 `npm unlink 패키지명`
2. npm 패키지 레포에서 `npm unlink -g`

## 5. NPM 배포 준비

### .npmignore 파일 생성
배포에서 제외할 파일 지정:
```
node_modules/
.git/
.gitignore
test/
*.test.js
.env
```

### README.md 작성
사용자를 위한 문서:
- 설치 방법
- 사용 예제
- API 문서
- 기여 가이드

## 6. NPM 계정 및 로그인

### 계정 생성
https://www.npmjs.com/signup

### 로그인
```bash
npm login
```

이메일 인증 완료 필요

## 7. 배포

배포는 크게 2가지 방법의 경로를 사용할 수 있음

#### 1. 일반 Package
- 설치: `npm install js-te`
- 전 세계에서 유일해야 함
- 누가 먼저 선점하면 못 씀

```
// package.json
{
  "name": "js-te"
}
```

#### 2. Scoped Package

- 설치: `npm install @dannysir/js-te `
- 계정 아래에서만 유일하면 됨 
- 다른 사람도 `@dannysir/js-te` 사용 가능

```
//package.json
{
  "name": "@dannysir/js-te"
}
```

### 첫 배포
```bash
npm publish
```

### 범위 패키지 (Scoped Package)
```bash
npm publish --access public
```

패키지 이름: `@username/package-name`

## 8. 버전 업데이트 및 재배포

### 버전 업데이트
```bash
# 패치 버전 (0.0.1 -> 0.0.2)
npm version patch

# 마이너 버전 (0.0.1 -> 0.1.0)
npm version minor

# 메이저 버전 (0.0.1 -> 1.0.0)
npm version major
```

### 재배포
```bash
npm publish
```

## 9. Dual Package 지원 (CommonJS + ESM)

많은 사용자들이 여전히 CommonJS를 사용하므로, 양쪽을 모두 지원하는 것이 좋습니다.

### 방법 1: exports 필드 사용
```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.js",
      "require": "./index.cjs"
    }
  }
}
```

### 방법 2: 빌드 도구 사용
- Rollup, Webpack, esbuild 등을 사용해 여러 버전 생성
- 하나의 소스에서 CommonJS와 ESM 버전 모두 빌드

## 10. 자주 사용하는 명령어

```bash
# 패키지 정보 확인
npm view js-te

# 특정 버전 배포 취소 (24시간 이내)
npm unpublish js-te@0.0.1

# 전체 패키지 삭제 (72시간 이내)
npm unpublish js-te --force

# 패키지 사용 중단 표시
npm deprecate js-te@0.0.1 "Use version 0.0.2 instead"
```
