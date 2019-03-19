BEGIN;

TRUNCATE
    happydog_users,
    happydog_notes
    RESTART IDENTITY CASCADE;


INSERT INTO happydog_users (user_name, full_name, password)
VALUES
    ('user1', 'Happy Dog', 'password'),
    ('user2', 'Unhappy Dog', 'password'),
    ('admin', 'admin', 'password');

INSERT INTO happydog_notes (note_title, content)
VALUES
    ('Vaccinations', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi'),
    ('Medicines', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi'),
    ('Baths', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi'),
    ('Dog park', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi'),
    ('Allergies', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi');

COMMIT;