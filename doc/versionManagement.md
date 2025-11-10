# 버전 관리 (Version Management)

## 1. 시맨틱 버저닝 (Semantic Versioning)

### 기본 구조
```
MAJOR.MINOR.PATCH
  |     |     |
  1  .  2  .  3
```

### 버전 번호의 의미
- **MAJOR (주 버전)**: 하위 호환성이 깨지는 변경
- **MINOR (부 버전)**: 하위 호환성을 유지하면서 기능 추가
- **PATCH (패치 버전)**: 하위 호환성을 유지하는 버그 수정

## 2. 버전 업데이트 시나리오

### PATCH 업데이트 (0.0.1 → 0.0.2)
```bash
npm version patch
```

**사용 시기**:
- 버그 수정
- 성능 개선
- 문서 수정
- 내부 리팩토링

**예제**:
```javascript
// 버전 0.0.1
function add(a, b) {
  return a + b;  // 버그: 문자열이면 이상하게 동작
}

// 버전 0.0.2
function add(a, b) {
  return Number(a) + Number(b);  // 버그 수정
}
```

### MINOR 업데이트 (0.0.1 → 0.1.0)
```bash
npm version minor
```

**사용 시기**:
- 새로운 기능 추가
- 기존 기능은 그대로 동작
- 하위 호환성 유지

**예제**:
```javascript
// 버전 0.0.1
export function test(description, fn) { ... }
export function expect(actual) { ... }

// 버전 0.1.0 - 새로운 기능 추가
export function test(description, fn) { ... }
export function expect(actual) { ... }
export function beforeEach(fn) { ... }  // 새로운 기능!
```

### MAJOR 업데이트 (0.0.1 → 1.0.0)
```bash
npm version major
```

**사용 시기**:
- API 변경으로 기존 코드가 작동 안 함
- 함수 시그니처 변경
- 기능 제거
- 대규모 리팩토링

**예제**:
```javascript
// 버전 0.x.x
export function test(description, fn) { ... }

// 버전 1.0.0 - Breaking Change!
export function test(options) {  // 인자 형식 변경
  const { description, fn, timeout } = options;
  ...
}

// 기존 코드는 더 이상 작동 안 함:
test('my test', () => { ... });  // ❌ 에러!

// 새로운 형식으로 변경 필요:
test({ description: 'my test', fn: () => { ... } });  // ✅
```

## 3. npm version 명령어

### 기본 사용법
```bash
# 패치 버전 증가
npm version patch

# 마이너 버전 증가
npm version minor

# 메이저 버전 증가
npm version major
```

### 버전 명령어의 효과
1. package.json의 version 필드 업데이트
2. git commit 자동 생성 (메시지: "v1.2.3")
3. git tag 자동 생성 ("v1.2.3")

### Git 없이 버전 업데이트
```bash
npm version patch --no-git-tag-version
```

## 4. 사전 릴리스 버전

### 알파(Alpha) 버전
```bash
npm version prerelease --preid=alpha
# 0.0.1 → 0.0.2-alpha.0
```

**사용 시기**: 초기 개발 단계, 불안정

### 베타(Beta) 버전
```bash
npm version prerelease --preid=beta
# 0.0.1 → 0.0.2-beta.0
```

**사용 시기**: 기능 완성, 테스트 중

### RC (Release Candidate) 버전
```bash
npm version prerelease --preid=rc
# 0.0.1 → 0.0.2-rc.0
```

**사용 시기**: 출시 직전, 최종 검증

### 사전 릴리스 버전 증가
```bash
# 0.0.2-alpha.0 → 0.0.2-alpha.1
npm version prerelease
```

## 5. 버전 범위 지정

### package.json에서의 의존성 버전

#### 정확한 버전
```json
{
  "dependencies": {
    "js-te": "1.2.3"
  }
}
```
**의미**: 정확히 1.2.3만 사용

#### 캐럿(^) - 마이너 버전 호환
```json
{
  "dependencies": {
    "js-te": "^1.2.3"
  }
}
```
**의미**: 1.2.3 이상 2.0.0 미만
- ✅ 1.2.3, 1.2.4, 1.3.0, 1.9.9
- ❌ 2.0.0

#### 틸드(~) - 패치 버전 호환
```json
{
  "dependencies": {
    "js-te": "~1.2.3"
  }
}
```
**의미**: 1.2.3 이상 1.3.0 미만
- ✅ 1.2.3, 1.2.4, 1.2.99
- ❌ 1.3.0

#### 와일드카드(*)
```json
{
  "dependencies": {
    "js-te": "*"
  }
}
```
**의미**: 모든 버전 (비권장!)

#### 부등호
```json
{
  "dependencies": {
    "js-te": ">=1.2.3 <2.0.0"
  }
}
```

## 6. 0.x.x 버전 (프로덕션 이전)

### 0.x.x의 의미
```json
{
  "version": "0.1.5"
}
```

**의미**:
- 아직 프로덕션 준비 안 됨
- API가 언제든 변경될 수 있음
- 안정성 보장 없음

### 0.x.x에서의 규칙
- **0.0.z**: 초기 개발 단계
- **0.y.z**: 기능 개발 중
- **1.0.0**: 첫 프로덕션 릴리스

### 1.0.0으로 올리는 시기
- API가 안정화됨
- 실제 사용자가 사용 중
- 하위 호환성을 유지할 준비가 됨
- 충분한 테스트와 문서

