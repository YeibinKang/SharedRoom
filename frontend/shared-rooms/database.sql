CREATE DATABASE sharedrooms;

CREATE TABLE room(
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255),
    room_price INTEGER,
    room_description TEXT,
    room_photo TEXT
);

CREATE TABLE app_user(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE,
    user_password VARCHAR(255),
    user_phone VARCHAR(255),
    user_email VARCHAR(255)
);

CREATE TABLE reservation(
    reservation_id SERIAL PRIMARY KEY,
    total_price NUMERIC(6,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id INTEGER,
    room_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id)
);
