# CHANGE LOG

## [0.0.1] - 2025-11-17

### 추가
- 최초 배포
- 테스트 작성 기능 (`test`, `describe`, `expect`)
- Matcher 함수들
    - `toBe()` - 값 비교
    - `toEqual()` - 객체/배열 비교
    - `toThrow()` - 에러 검증
    - `toBeTruthy()` / `toBeFalsy()` - 참/거짓 확인
- 모킹 시스템
    - `mock()` - 모듈 모킹
    - `clearAllMocks()` - 전체 mock 제거
    - `unmock()` - 특정 mock 제거
    - `isMocked()` - mock 상태 확인
- Babel 플러그인 dynamic import를 이용한 import 변환으로 모킹 구현
- 자동 테스트 파일 찾기 (`.test.js` 파일, `test/` 폴더)
- CLI 도구 (`js-te` 명령어)
- 중첩 describe 블록 지원
- 컬러 콘솔 출력

## [0.0.2] - 2025-11-17

### 추가
- scoped 패키지로 변경하여 발생한 버그 수정
  - babelTransformImport 파일 내에 `js-te` 경로를 `@dannysir/js-te` 경로로 변경

---

## 앞으로 추가할 기능

- `beforeEach` / `afterEach` 훅
- `each` 반복 테스트
- mocking 기능 개선
  - 문제점 : 현재 path가 정확하게 일치해야 동작함
  - 개선 사항 : babel dynamic import 플러그인 로직 내에서 상대 경로를 절대 경로로 수정하는 로직을 추가하여 사용자가 어떤 경로로 입력해도 사용이 가능하게 개선