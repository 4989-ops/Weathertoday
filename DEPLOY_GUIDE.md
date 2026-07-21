# 매탄1동 기상 상황판 — 폰에서 쓰기 (가장 쉬운 방법)

목표: PC를 꺼둬도, 회사 밖에서도, 폰에서 언제든지 열리는 나만의 날씨 앱 만들기.
아래 순서대로만 따라오시면 됩니다. (전부 무료)

---

## 1단계. GitHub에 파일 올리기 (5분)

1. https://github.com 접속 → 회원가입 (계정 없으면)
2. 우측 상단 **+** → **New repository** 클릭
3. Repository name: `weather-dashboard` (아무 이름이나 가능)
4. **Public** 선택 (Private도 가능하나 Public이 더 간단) → **Create repository**
5. 생성된 페이지에서 **uploading an existing file** 클릭
6. 이 폴더 안의 파일들을 **폴더 구조 그대로** 드래그해서 올리기:
   ```
   server.js
   package.json
   public/index.html
   ```
   ⚠️ `public` 폴더 안에 `index.html`이 들어있는 구조를 그대로 유지해야 합니다.
7. 하단 **Commit changes** 클릭

---

## 2단계. Render.com에 배포하기 (5분)

1. https://render.com 접속 → **Get Started** → GitHub 계정으로 로그인/가입
2. 대시보드에서 **New +** → **Web Service** 클릭
3. 방금 만든 `weather-dashboard` 저장소 선택 → **Connect**
4. 설정 입력:
   - **Name**: `maetan1dong-weather` (원하는 이름, 이게 주소에 들어감)
   - **Region**: Singapore (한국에서 가장 가까움)
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free** 선택
5. **Create Web Service** 클릭
6. 2~3분 기다리면 배포 완료. 상단에 이런 주소가 생깁니다:
   ```
   https://maetan1dong-weather.onrender.com
   ```

이 주소가 **내 개인 날씨 앱 주소**입니다. 폰이든 PC든 이 URL만 열면 됩니다.

⚠️ 무료 티어 특징: 15분간 아무도 안 들어오면 서버가 잠들고, 다음 접속 시 첫 로딩이
10~30초 정도 걸릴 수 있어요. (총무팀 업무용으로는 문제없는 수준)

---

## 3단계. 폰에서 열고 API 키 입력

1. 폰 브라우저(크롬 등)에서 위 주소 접속
2. 하단 "설정" 패널 열고 **서비스키**만 입력 (프록시 서버 주소는 **비워두세요** — 자동으로 같은 서버를 사용합니다)
3. "키 적용 후 재조회" 클릭 → LIVE 배지로 바뀌면 성공
4. 한 번 입력해두면 다음부터는 자동으로 기억됩니다 (폰 브라우저에 저장됨)

---

## 4단계. 폰에 "앱처럼" 설치하기

### 방법 A — 홈 화면에 추가 (가장 쉬움, 설치파일 없음)
- **안드로이드(크롬)**: 주소 접속 후 우측 상단 점 3개(⋮) → **"홈 화면에 추가"**
- 완료! 홈 화면에 아이콘이 생기고, 눌러보면 주소창 없이 앱처럼 전체화면으로 열립니다.

### 방법 B — 진짜 .apk 파일 만들기
1. https://www.pwabuilder.com 접속
2. 상단 입력창에 배포된 주소(`https://maetan1dong-weather.onrender.com`) 입력 → **Start**
3. 분석이 끝나면 **Android** 카드에서 **Package** 클릭
4. 옵션 기본값 그대로 두고 **Generate** → `.apk`(또는 `.aab`) 파일 다운로드
5. 폰으로 그 apk 파일 전송 → 폰에서 실행 → "출처를 알 수 없는 앱 설치 허용" 동의 → 설치

방법 A로 충분히 앱처럼 쓸 수 있어서, 굳이 apk까지 필요 없다면 A만 하셔도 됩니다.

---

## 문제 생기면

- Render 배포 후 화면이 안 뜬다 → Render 대시보드의 **Logs** 탭에서 에러 확인
- LIVE 전환이 안 된다 → 브라우저 개발자도구(F12) > Console 탭에서 에러 메시지 확인, 저에게 캡처 보내주시면 바로 봐드릴게요
- Render 무료 서비스가 잠들어서 느리다 → 정상입니다, 첫 접속만 조금 기다리면 됩니다
