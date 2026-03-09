-- =============================================
-- TheGarden Local Dev Users
-- Run after migrations via: supabase db reset
-- =============================================

-- Admin User (admin / admin123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'admin@thegarden.local',
  crypt('admin123', gen_salt('bf')),
  now(), now(), now(),
  '{"username": "admin", "name": "Administrator"}'::jsonb,
  ''
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  '{"sub": "a1000000-0000-0000-0000-000000000001", "email": "admin@thegarden.local"}'::jsonb,
  'email', 'a1000000-0000-0000-0000-000000000001',
  now(), now(), now()
);

-- Set admin role (trigger auto-created the profile with 'customer' role)
UPDATE public.profiles SET role = 'admin' WHERE id = 'a1000000-0000-0000-0000-000000000001';

-- Worker User (worker / worker123)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_user_meta_data, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'worker@thegarden.local',
  crypt('worker123', gen_salt('bf')),
  now(), now(), now(),
  '{"username": "worker", "name": "Küche"}'::jsonb,
  ''
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  '{"sub": "a1000000-0000-0000-0000-000000000002", "email": "worker@thegarden.local"}'::jsonb,
  'email', 'a1000000-0000-0000-0000-000000000002',
  now(), now(), now()
);

-- Set worker role
UPDATE public.profiles SET role = 'worker' WHERE id = 'a1000000-0000-0000-0000-000000000002';
