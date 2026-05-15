-- NeuroPathway Ecosystem initial Supabase schema.
-- Enable extensions required for UUIDs, case-insensitive email, and vector RAG search.
create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "vector";

create type user_role as enum (
  'parent_carer', 'child_young_person', 'adult_user', 'teacher_senco',
  'educational_psychologist', 'speech_language_therapist', 'occupational_therapist',
  'camhs_clinician', 'social_worker', 'gp_paediatrician', 'administrator', 'commissioner'
);

create type risk_level as enum ('green', 'amber', 'red');
create type consent_status as enum ('granted', 'withdrawn', 'expired', 'pending');
create type observation_category as enum (
  'emotional_dysregulation', 'executive_functioning', 'sensory_processing',
  'communication_difference', 'sleep', 'school_avoidance', 'anxiety', 'self_harm_risk'
);

create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('nhs_trust', 'icb', 'local_authority', 'school', 'university', 'employer', 'provider')),
  ods_code text,
  created_at timestamptz not null default now()
);

create table schools (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id) on delete cascade,
  name text not null,
  urn text,
  local_authority text,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  organisation_id uuid references organisations(id),
  email citext not null unique,
  full_name text not null,
  role user_role not null,
  mfa_enabled boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  registration_body text,
  registration_number text,
  job_title text,
  service_name text,
  created_at timestamptz not null default now()
);

create table children (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  school_id uuid references schools(id),
  nhs_number text,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  pronouns text,
  primary_parent_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table adults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date_of_birth date,
  support_preferences jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table consents (
  id uuid primary key default gen_random_uuid(),
  subject_user_id uuid references users(id),
  child_id uuid references children(id) on delete cascade,
  granted_by uuid not null references users(id),
  shared_with_organisation_id uuid references organisations(id),
  purpose text not null,
  status consent_status not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  check ((subject_user_id is not null) or (child_id is not null))
);

create table observations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  created_by uuid not null references users(id),
  category observation_category not null,
  intensity int not null check (intensity between 1 and 5),
  narrative text not null,
  context jsonb not null default '{}',
  safeguarding_concern boolean not null default false,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  check ((child_id is not null) or (adult_id is not null))
);

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  created_by uuid not null references users(id),
  title text,
  body text not null,
  emotion_tags text[] not null default '{}',
  ai_summary text,
  created_at timestamptz not null default now(),
  check ((child_id is not null) or (adult_id is not null))
);

create table mood_logs (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  created_by uuid not null references users(id),
  mood_label text not null,
  mood_score int not null check (mood_score between 1 and 10),
  notes text,
  created_at timestamptz not null default now(),
  check ((child_id is not null) or (adult_id is not null))
);

create table risk_scores (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  level risk_level not null,
  score int not null check (score between 0 and 100),
  rationale jsonb not null default '[]',
  recommended_action text not null,
  model_version text not null,
  calculated_at timestamptz not null default now(),
  check ((child_id is not null) or (adult_id is not null))
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  created_by uuid not null references users(id),
  report_type text not null check (report_type in ('ehcp', 'parent_summary', 'clinician_summary', 'commissioner_brief')),
  status text not null default 'draft',
  content jsonb not null,
  generated_at timestamptz not null default now(),
  approved_at timestamptz,
  check ((child_id is not null) or (adult_id is not null))
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  uploaded_by uuid not null references users(id),
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  classification text not null default 'evidence',
  created_at timestamptz not null default now(),
  check ((child_id is not null) or (adult_id is not null))
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id),
  child_id uuid references children(id) on delete cascade,
  adult_id uuid references adults(id) on delete cascade,
  assigned_to uuid references users(id),
  created_by uuid not null references users(id),
  title text not null,
  description text,
  due_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id),
  organisation_id uuid references organisations(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table evidence_embeddings (
  id uuid primary key default gen_random_uuid(),
  observation_id uuid references observations(id) on delete cascade,
  report_id uuid references reports(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  check ((observation_id is not null) or (report_id is not null))
);

alter table users enable row level security;
alter table children enable row level security;
alter table adults enable row level security;
alter table observations enable row level security;
alter table journal_entries enable row level security;
alter table mood_logs enable row level security;
alter table risk_scores enable row level security;
alter table reports enable row level security;
alter table documents enable row level security;
alter table consents enable row level security;
alter table tasks enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

create policy "Users can read own profile" on users for select using (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);
create policy "Notifications are private" on notifications for select using (auth.uid() = user_id);
create policy "Parents can view linked children" on children for select using (primary_parent_id = auth.uid());
create policy "Creators can view own observations" on observations for select using (created_by = auth.uid());
create policy "Creators can insert observations" on observations for insert with check (created_by = auth.uid());
create policy "Creators can view own journal entries" on journal_entries for select using (created_by = auth.uid());
create policy "Creators can insert journal entries" on journal_entries for insert with check (created_by = auth.uid());

create index observations_child_time_idx on observations(child_id, occurred_at desc);
create index mood_logs_child_time_idx on mood_logs(child_id, created_at desc);
create index risk_scores_child_time_idx on risk_scores(child_id, calculated_at desc);
create index reports_child_type_idx on reports(child_id, report_type);
create index audit_logs_entity_idx on audit_logs(entity_table, entity_id, created_at desc);
