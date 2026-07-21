/**
 * 매탄1동 기상 상황판 - 서버 (Render 배포용)
 * ------------------------------------------------
 * 이 서버 하나가 두 가지 역할을 합니다:
 *   1) public/index.html (대시보드 화면) 을 그대로 보여줌
 *   2) /api/forecast, /api/warnings 로 기상청 API를 대신 호출해서 전달 (CORS 우회)
 *
 * 로컬에서 테스트하려면
 *   npm install
 *   node server.js
 *   브라우저에서 http://localhost:4000 접속
 *
 * Render.com에 배포하면 폰에서도 https://내앱이름.onrender.com 주소로
 * 언제 어디서든 접속할 수 있습니다. (README.md 배포 가이드 참고)
 */

const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
const PORT = process.env.PORT || 4000;

// 대시보드 정적 파일 서빙 (public/index.html이 기본 화면이 됨)
app.use(express.static(path.join(__dirname, 'public')));

// CORS 허용 (개인용 앱이므로 * 허용)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  next();
});

const KMA_BASE = 'http://apis.data.go.kr/1360000';

// 회사 위치(매탄1동) 격자좌표 - 필요시 변경
const DEFAULT_NX = 61;
const DEFAULT_NY = 120;

/**
 * 단기예보 발표시각(02,05,08,11,14,17,20,23시, 각 10분 이후 제공) 중
 * 가장 최근 발표시각을 자동 계산
 */
function latestBaseTime() {
  const times = [23, 20, 17, 14, 11, 8, 5, 2];
  const now = new Date();
  const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  let hour = kst.getHours();
  let date = new Date(kst);

  let base = times.find(t => hour > t || (hour === t && kst.getMinutes() >= 10));
  if (!base) {
    base = 23;
    date.setDate(date.getDate() - 1);
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return { base_date: `${y}${m}${d}`, base_time: `${String(base).padStart(2, '0')}00` };
}

// 기상청 API는 실패해도 200 + HTML/텍스트로 응답하는 경우가 있어,
// JSON 파싱 실패 시 원문 텍스트를 그대로 에러에 담아 원인 파악이 쉽게 만듭니다.
async function safeFetchJson(url) {
  const r = await fetch(url);
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const snippet = text.slice(0, 300);
    throw new Error(`기상청 API가 JSON이 아닌 응답을 반환했습니다 (status ${r.status}): ${snippet}`);
  }
}

app.get('/api/forecast', async (req, res) => {
  try {
    const key = req.query.key;
    const nx = req.query.nx || DEFAULT_NX;
    const ny = req.query.ny || DEFAULT_NY;
    if (!key) return res.status(400).json({ error: 'missing key' });

    const { base_date, base_time } = latestBaseTime();
    const url = `${KMA_BASE}/VilageFcstInfoService_2.0/getVilageFcst`
      + `?serviceKey=${key}&numOfRows=1000&pageNo=1&dataType=JSON`
      + `&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

    const json = await safeFetchJson(url);
    res.json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'forecast proxy failed', detail: String(e.message || e) });
  }
});

app.get('/api/warnings', async (req, res) => {
  try {
    const key = req.query.key;
    if (!key) return res.status(400).json({ error: 'missing key' });

    const url = `${KMA_BASE}/WthrWrnInfoService/getWthrWrnList`
      + `?serviceKey=${key}&numOfRows=50&pageNo=1&dataType=JSON`;

    const json = await safeFetchJson(url);
    res.json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'warning proxy failed', detail: String(e.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`[기상 상황판] http://localhost:${PORT} 에서 실행 중`);
});
