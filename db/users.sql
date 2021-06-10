`CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username text unique,
    email varchar unique,
    password text,
);`

`CREATE UNIQUE INDEX idx_user_id
ON users(id);
`