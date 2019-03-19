BEGIN;

TRUNCATE
    happydog_users,
    happydog_notes
    RESTART IDENTITY CASCADE;


INSERT INTO happydog_users (user_name, full_name, password)
VALUES
    ('user1', 'Happy Dog', 'password'),
    ('user2', 'Unhappy Dog', 'password');

INSERT INTO happydog_notes (title, content)
VALUES
    ('Test title', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi'),
    ('Testing123', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi');

COMMIT;