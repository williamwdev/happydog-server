BEGIN;

TRUNCATE
    happydog_notes,
    happydog_users
    RESTART IDENTITY CASCADE;

INSERT INTO happydog_users (user_name, full_name, password)
VALUES
    ('pancake', 'Pancake', '$2a$12$drFo//fk4j5qQWo4.KY8XesM7CWlc9f0RUCfRC9mZCthGEf51xOpO'),
    ('demo', 'Demo', '$2a$12$rgUzCf8N3i1SPPgRK55iyOUmMdFdLaPDM36B30pry0LQYAhhzQrx6');


INSERT INTO happydog_notes (name, user_id)
VALUES
    ('Vet Visits', 1),
    ('Vaccinations', 1),
    ('Grooming', 1),
    ('Beach Day', 1);

COMMIT;