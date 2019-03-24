BEGIN;

TRUNCATE
    happydog_notes,
    happydog_users
    RESTART IDENTITY CASCADE;

INSERT INTO happydog_users (user_name, full_name, password)
VALUES
    ('user1', 'Happy Dog', 'Password123!'),
    ('user2', 'Unhappy Dog', 'Password123!');


INSERT INTO happydog_notes (name, user_id)
VALUES
    ('Vet Visits', 1),
    ('Vaccination Records', 1),
    ('Journal', 1);

COMMIT;