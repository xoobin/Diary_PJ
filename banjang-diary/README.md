# 📒 반장 일기장 걷어라

담임 선생님의 일기장 코멘트를 기다리던 초등학교 시절 경험을 되살려, AI 코멘트라는 보상으로 **기록 습관화**를 돕는 익명 웹서비스.

## 구조
- `public/index.html` : 일기 작성 → 대기 → 코멘트 확인 → 설문 (단일 페이지)
- `public/admin.html` : 개발자 전용 대시보드 (비밀번호 보호)
- `api/comment.js` : Gemini로 코멘트 생성 + 메타데이터 저장
- `api/survey.js` : 설문 문항 제공/응답 저장 (문항은 `lib/config.js`에서 수정)
- `api/admin.js` : 대시보드 데이터 (관리자 비밀번호 필요)
- `supabase/schema.sql` : DB 스키마

## 데이터 정책
| 개발자가 확인 가능 | 개발자가 확인 불가 (저장·로그 안 함) |
|---|---|
| 사용자N(사용 순서), 입력 글자 수, 공란 항목(날씨/제목), 설문 응답 | 오늘의 기분, 일기 내용, 일기 제목, IP·기기 등 접속자 상세 정보 |

일기 내용은 코멘트 생성을 위해 Google Gemini API로만 전달되고 DB·서버 로그에 남지 않습니다. (Gemini 무료 티어는 입력 내용이 Google의 제품 개선에 사용될 수 있습니다.)
사용자 구분은 브라우저에서 만든 랜덤 ID의 SHA-256 해시로만 하며, 개인 식별 정보는 없습니다.

## 배포 (약 10분)
1. **GitHub**: 새 리포지토리 생성 후
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<계정>/banjang-diary.git
   git push -u origin main
   ```
2. **Supabase**: 새 프로젝트 → SQL Editor에서 `supabase/schema.sql` 실행 → Project Settings > API에서 URL, service_role key 복사
3. **Vercel**: Add New Project → 위 GitHub 리포 import (Framework: Other, 설정 변경 불필요)
   Environment Variables에 `.env.example`의 5개 값(GEMINI_API_KEY 등) 입력 → Deploy
4. 배포 URL이 서비스 주소, `/admin.html`이 개발자 대시보드입니다.

## 로컬 실행
```bash
cp .env.example .env   # 값 채우기
npx vercel dev
```

## 운영 시 참고
- Vercel 로그에 일기 내용이 찍히지 않도록 `console.log(req.body)` 류를 추가하지 마세요.
- 공개 서비스이므로 API 비용 보호를 위해 Google AI Studio에서 무료 티어 호출 한도를 확인하고, 초과 시 사용자에게 안내 문구가 표시됩니다.
