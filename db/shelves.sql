`CREATE TABLE shelves (
    id int generated always as identity PRIMARY KEY, 
    name VARCHAR not null,
    list_type VARCHAR(50) not null,
    user_id INTEGER REFERENCES users (id) on DELETE CASCADE
    );
`