CREATE TABLE happydog_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

ALTER TABLE happydog_notes
    ADD COLUMN
        user_id INTEGER REFERENCES happydog_users(id) ON DELETE CASCADE;
