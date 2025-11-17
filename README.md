# js-te

Jest에서 영감을 받아 만든 가벼운 JavaScript 테스트 프레임워크입니다.

## 설치

```bash
npm install --save-dev js-te
```

## 빠른 시작

### 1. 테스트 파일 만들기

`*.test.js` 파일을 만들면 자동으로 찾아서 실행합니다.

별도의 import문 없이 `describe`와 `test`, `expect` 로직이 사용 가능합니다. 

```javascript
// math.test.js
describe('[단순 연산 테스트]', () => {
  test('더하기 테스트', () => {
    expect(1 + 2).toBe(3);
  });
});
```

### 2. 테스트 실행

package.json에 추가:

```json
{
  "scripts": {
    "test": "js-te"
  }
}
```

실행:
```bash
npm test
```


# API

## 테스트 작성

### `test(설명, 함수)`

테스트 하나를 정의합니다.

```javascript
test('배열 길이 확인', () => {
  expect([1, 2, 3].length).toBe(3);
});
```

#### `describe(이름, 함수)`

테스트를 그룹으로 묶습니다. 중첩도 됩니다.

```javascript
describe('계산기', () => {
  describe('더하기', () => {
    test('양수 더하기', () => {
      expect(2 + 3).toBe(5);
    });
  });
  
  describe('빼기', () => {
    test('양수 빼기', () => {
      expect(5 - 3).toBe(2);
    });
  });
});
```

## Matcher

### `expect(값).toBe(기댓값)`

`===`로 비교합니다. 숫자, 문자열 같은 원시값 비교할 때 사용.

```javascript
expect(5).toBe(5);
expect('안녕').toBe('안녕');
```

### `expect(값).toEqual(기댓값)`

객체나 배열의 내용을 비교합니다.

```javascript
expect({ name: '철수' }).toEqual({ name: '철수' });
expect([1, 2, 3]).toEqual([1, 2, 3]);
```

### `expect(함수).toThrow(에러메시지)`

함수가 에러를 던지는지 확인합니다.

```javascript
expect(() => {
  throw new Error('에러 발생');
}).toThrow('에러');
```

### `expect(값).toBeTruthy()` / `expect(값).toBeFalsy()`

참/거짓 여부를 확인합니다.

```javascript
expect(true).toBeTruthy();
expect(0).toBeFalsy();
```

## Mocking

### 동작 원리

Babel을 사용해서 import 구문을 변환하여 mock 함수를 가져오도록 했습니다.

1. 테스트 파일 찾기
   1. `mock(path, mockObj)` 선언 확인
   2. `path`를 key로 이용해 Map에 저장
2. Babel로 코드 변환
   1. 전체 파일의 import문 확인
   2. import 경로가 Map에 존재하면 mock 객체로 변환
   3. import 경로가 Map에 없다면 그대로 import
3. 테스트 실행
4. 원본 파일 복구

### 🚨 주의 사항 (현재 수정 중)

mocking 기능의 경우 현재 `path`를 기반으로 직접 변환을 하기 때문에 mocking이 필요한 함수의 경우 

반드시 **절대 경로**로 표현한 후 `mock` 함수에 **절대 경로**로 등록을 해주세요.

> 만약 모듈이 사용되는 모든 위치의 path가 동일하다면 상대 경로도 정삭 작동합니다.

### `mock(모듈경로, mock객체)`

모듈을 모킹합니다. import 하기 **전에** 호출해야 합니다.

```javascript
// random.js
export const random = () => Math.random();

// game.js
import { random } from './random.js';
export const play = () => random() * 10;

// game.test.js
import { mock, test, expect } from 'js-te';

test('랜덤 함수 모킹', async () => {
  // 1. 먼저 모킹
  mock('./random.js', {
    random: () => 0.5
  });
  
  // 2. 그 다음 import
  const { play } = await import('./game.js');
  
  // 3. 모킹된 값 사용
  expect(play()).toBe(5);
});
```

### `clearAllMocks()`

등록된 모든 mock을 제거합니다.

### `unmock(모듈경로)`

특정 mock만 제거합니다.

### `isMocked(모듈경로)`

mock이 등록되어 있는지 확인합니다.

## 테스트 파일 찾기 규칙

자동으로 다음 파일들을 찾아서 실행합니다:

1. `*.test.js` 파일
2. `test/` 폴더 안의 모든 `.js` 파일

```
프로젝트/
├── src/
│   ├── utils.js
│   └── utils.test.js       ✅
├── test/
│   ├── integration.js      ✅
│   └── e2e.js              ✅
└── calculator.test.js      ✅
```

## 예제

### 기본 테스트

```javascript
import { describe, test, expect } from 'js-te';

describe('문자열 테스트', () => {
  test('문자열 합치기', () => {
    const result = 'hello' + ' ' + 'world';
    expect(result).toBe('hello world');
  });
  
  test('대문자 변환', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});
```

### 모킹 예제

```javascript
// mocking.test.js
import { mock, test, expect } from 'js-te';

test('[mocking] - mocking random function', async () => {
  mock('/src/test-helper/random.js', {
    random: () => 3,
  });
  const {play} = await import('../src/test-helper/game.js');
  expect(play()).toBe(30);
});


// game.js
import {random} from '/src/test-helper/random.js'

export const play = () => {
  return random() * 10;
};

// random.js
export const random = () => Math.random();
```

## 설정

`package.json`에 해당 설정을 하셔야 정상 작동합니다.

```json
{
  "type": "module"
}
```

## 링크

- [GitHub](https://github.com/dannysir/Js-Te)

## 만든 이유

우아한테크코스 과제하면서 Jest 써보고 테스트 프레임워크가 어떻게 동작하는지 궁금해서 만들어봤습니다.

## 라이선스

ISC