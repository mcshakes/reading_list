`CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username text,
    email varchar(50) not null,
    password text,
    created_at timestamp
);`

`CREATE UNIQUE INDEX idx_user_id
ON users(id);
`