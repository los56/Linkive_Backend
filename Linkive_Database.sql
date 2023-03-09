CREATE TABLE users (
    users_num SERIAL PRIMARY KEY,
    id VARCHAR(20) UNIQUE NOT NULL,
    nickname VARCHAR(10) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    socialLogin VARCHAR(20)
);

CREATE TABLE memos (
    memo_num SERIAL PRIMARY KEY,
    owner INT NOT NULL,
    link VARCHAR(65535) NOT NULL,
    title VARCHAR(20) NOT NULL,
    content JSON NOT NULL,
    date_created TIMESTAMP NOT NULL,
    users_num INT NOT NULL,
    folder_num INT
);

CREATE TABLE pagesheets (
    pagesheet_num SERIAL PRIMARY KEY,
    users_num INT NOT NULL,
    name VARCHAR(20) NOT NULL,
    layout JSON NOT NULL
);

CREATE TABLE folders (
    folder_num SERIAL PRIMARY KEY,
    users_num INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    password VARCHAR(20) NOT NULL,
    thumbnail VARCHAR(65535)
);