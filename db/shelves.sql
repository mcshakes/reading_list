`CREATE TABLE shelves (
    id int generated always as identity PRIMARY KEY, 
    name VARCHAR(50) not null,
    list_type VARCHAR(50) not null,
    user_id INTEGER REFERENCES user (id) on DELETE CASCADE
    );
`