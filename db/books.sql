`CREATE TABLE books (
    id int generated always as identity PRIMARY KEY, 
    title TEXT not null,
    author TEXT not null,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed boolean DEFAULT FALSE,
    shelf_id INTEGER REFERENCES shelves (id) on DELETE CASCADE
);
`