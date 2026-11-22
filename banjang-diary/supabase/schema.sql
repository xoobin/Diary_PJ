-- 익명 사용자: 랜덤 ID의 해시만 저장 (IP/UA 등 접속 정보는 저장하지 않음)
create table if not exists users (
  user_no bigserial primary key,
  anon_hash text unique not null,
  created_at timestamptz default now()
);

-- 제출 메타데이터만 저장. 기분/일기 내용/제목은 저장하지 않음.
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_no bigint references users(user_no),
  char_count int not null,
  empty_fields text[] not null default '{}',
  created_at timestamptz default now()
);

create table if not exists surveys (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid unique references entries(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  answers jsonb not null default '{}',
  created_at timestamptz default now()
);

-- 서버(service role)만 접근. 브라우저 직접 접근 차단.
alter table users enable row level security;
alter table entries enable row level security;
alter table surveys enable row level security;
