BEGIN;

TRUNCATE
    happydog_users
    RESTART IDENTITY CASCADE;


INSERT INTO happydog_users (user_name, full_name, password)
VALUES
    ('user1', 'Happy Dog', 'password'),
    ('user2', 'Unhappy Dog', 'password');

COMMIT;