CREATE TABLE users (
    User_ID serial primary key,
    Name varchar(50) unique not null,
    Email varchar(50) unique  not null,
    Password varchar(50) not null,
    Admin boolean not null
);

CREATE TABLE apps (
    Apps_ID serial primary key,
    Name varchar(50) unique NOT NULL,
    Category varchar(20) NOT NULL,
    Price NUMERIC NOT NULL DEFAULT 0,
    Img bytea,
    Details TEXT
);


CREATE TABLE ownedApps (
    Apps_ID     int REFERENCES apps (Apps_ID) ON UPDATE CASCADE ON DELETE CASCADE
    , User_ID int REFERENCES users (User_ID) ON UPDATE CASCADE
    , CONSTRAINT ownedApps_pkey PRIMARY KEY (apps_id, User_ID)
);

INSERT INTO users VALUES (DEFAULT, 'lpradenas', 'test@test.com', 'strongPass', true);
INSERT INTO users VALUES (DEFAULT, 'test client', 'client@test.com', 'strongPass', false);

insert into apps (name, category, price, details) VALUES ('chrome', 'browser', 0, 'this is a web browser by google');

insert into ownedapps values (1, 1);

insert into apps (name, category, price, details) VALUES ('firefox', 'browser', 0, 'this is a web browser by mozzila');
insert into ownedapps values (2, 1);
insert into ownedapps values (1, 2);

insert into apps (name, category, price, details) VALUES ('clashOfClans', 'games', 9, 'this is a game by sasdas');
insert into apps (name, category, price, details) VALUES ('simps', 'games', 22, 'this is a game by sasdas');
insert into apps (name, category, price, details) VALUES ('bookface', 'entertainment', 0, 'this is a social network');
insert into apps (name, category, price, details) VALUES ('twitt', 'entertainment', 0, 'this is a social network');
insert into apps (name, category, price, details) VALUES ('steps12', 'health', 100, 'this is a health app');
insert into apps (name, category, price, details) VALUES ('hearth12', 'health', 50, 'this is a health app');
