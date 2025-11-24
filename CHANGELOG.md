# CHANGE LOG

## [0.1.1] 2025-11-24

### 추가
- 문법 오류 발생시 babel로 변환한 파일이 다시 restore 되지않는 문제 해결
  - `babel 변환 -> 원상 복구` 로직이 문법 오류 발생시 진행되지 않는 오류 해결 

## [0.1.0]  2025-11-20

### 추가
- test.each() 기능 추가
  - 배열 형태의 테스트 케이스를 반복 실행
  - 플레이스홀더 지원 (%s, %o) 
  - 동일한 테스트 로직을 여러 데이터셋으로 검증 가능


- beforeEach()
  - 각 테스트 실행 전 초기화 코드 실행
  - 중첩된 describe 블록에서 상위 beforeEach 자동 실행
  - 테스트 간 독립성 보장


- Babel 절대 경로 변환
  - 사용자 입력 경로(상대/절대)를 절대 경로로 통일
  - 일관된 모킹 동작 보장

### 변경사항
- 내부 테스트 관리 구조 개선

## [0.0.2] 2025-11-17

### 추가
- scoped 패키지로 변경하여 발생한 버그 수정
    - babelTransformImport 파일 내에 `js-te` 경로를 `@dannysir/js-te` 경로로 변경

## [0.0.1] 2025-11-17

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

---

## 앞으로 추가할 기능

- mocking 기능 개선
  - 문제점 : mocking한 모듈을 반드시 `mock` 함수 이후에 import 해야함
  - 원인 : import를 상단에서 진행할 경우 mocking전 원본 모듈을 가져오게 됨
- ESM / Common JS 
  - 문제점 : 현재 라이브러리가 ESM 방식이기 때문에 사용자도 ESM 방식으로 사용해야함
  - 개선 방법 : rollup과 같은 번들러를 사용해 ESM 방식의 파일과 Common JS 방식의 파일 2 종류를 생성하여 배포