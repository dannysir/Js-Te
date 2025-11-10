# Shebang이란?

## 1. 정의

Shebang(셔뱅)은 스크립트 파일의 맨 첫 줄에 작성하는 특수한 주석으로, Unix/Linux 시스템에 이 파일을 어떤 인터프리터로 실행할지 알려주는 역할을 합니다.

```javascript
#!/usr/bin/env node
```

## 2. 구조 분석

### 기본 형식
```
#!<인터프리터 경로>
```

### 구성 요소
- `#!`: Shebang 시작을 나타내는 매직 넘버
- `/usr/bin/env`: 환경 변수를 통해 프로그램을 찾는 유틸리티
- `node`: 실행할 인터프리터 이름

## 3. 왜 필요한가?

### CLI 도구로 사용하기 위해
```bash
# Shebang이 없으면
node ./bin/cli.js

# Shebang이 있으면
./bin/cli.js
# 또는
js-te  # npm link 후
```

### 실행 권한 부여
```bash
# Linux/Mac에서 실행 권한 추가
chmod +x bin/cli.js
```

## 4. 다양한 Shebang 예제

### Node.js (권장)
```javascript
#!/usr/bin/env node
```
**장점**: 시스템의 PATH에서 node를 찾아 사용 (유연함)

### Node.js (절대 경로)
```javascript
#!/usr/bin/node
```
**단점**: node가 정확히 `/usr/bin/node`에 있어야 함 (비권장)

### Python
```python
#!/usr/bin/env python3
```

### Bash
```bash
#!/bin/bash
```

### Shell
```sh
#!/bin/sh
```

## 5. `/usr/bin/env`를 사용하는 이유

### 직접 경로 지정의 문제점
```javascript
#!/usr/local/bin/node  // ❌ node가 이 위치에 없으면 실패
```

### env를 사용한 해결
```javascript
#!/usr/bin/env node  // ✅ PATH에서 node를 찾음
```

사용자마다 node 설치 위치가 다를 수 있기 때문에:
- macOS: `/usr/local/bin/node`
- nvm 사용자: `~/.nvm/versions/node/v18.0.0/bin/node`
- Linux: `/usr/bin/node`

`env`를 사용하면 시스템의 PATH 환경 변수를 통해 node를 찾습니다.

## 6. js-te 프로젝트에서의 사용

### bin/cli.js
```javascript
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from "../index.js";

// ... CLI 로직
```

### package.json 설정
```json
{
  "bin": {
    "js-te": "./bin/cli.js"
  }
}
```

### 동작 과정
1. 사용자가 `js-te` 명령어 실행
2. npm이 `bin/cli.js` 파일을 찾음
3. Shebang을 읽고 node로 파일 실행
4. `node bin/cli.js`와 동일한 효과

## 7. Windows에서는?

Windows는 Shebang을 직접 지원하지 않지만, npm이 자동으로 처리합니다:

### npm이 생성하는 래퍼
```cmd
# js-te.cmd (Windows)
@node "%~dp0\cli.js" %*
```

```bash
# js-te (Unix/Linux/Mac)
#!/bin/sh
node "$basedir/cli.js" "$@"
```

npm install/link 시 자동으로 플랫폼에 맞는 래퍼 생성

## 8. 주의사항

### 1. 반드시 첫 줄에
```
#!/usr/bin/env node  // ✅ 올바름

// 주석
#!/usr/bin/env node  // ❌ 작동 안 함
```

### 2. 줄바꿈 문자
- Unix: LF (`\n`) - 권장
- Windows: CRLF (`\r\n`) - 문제 발생 가능

Git 설정으로 해결:
```bash
git config --global core.autocrlf input
```

### 3. 실행 권한 확인
```bash
ls -l bin/cli.js
# -rwxr-xr-x  <- x가 있어야 실행 가능

# 권한이 없다면
chmod +x bin/cli.js
```

### 4. npm publish 시
- npm이 자동으로 Shebang을 감지
- bin 필드의 파일에 실행 권한 자동 설정
- 수동 chmod 불필요

## 9. 테스트 방법

### 로컬 테스트
```bash
# 1. 직접 실행
node bin/cli.js

# 2. Shebang으로 실행 (권한 필요)
./bin/cli.js

# 3. npm link 후 명령어로 실행
npm link
js-te
```

### 디버깅
```bash
# Shebang이 올바른지 확인
head -1 bin/cli.js

# 실행 권한 확인
ls -l bin/cli.js

# PATH에서 node 찾기
which node
```
