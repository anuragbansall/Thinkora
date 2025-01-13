create database if not exists thinkora;
use thinkora;

create table if not exists posts(
    id varchar(50) primary key,
    username varchar(50) not null,
    title varchar(50) not null,
    content text not null,
    date datetime not null
);

-- demo data

insert into posts values(
    'post1',
    'user1',
    'Hello, World!',
    'This is a sample post.',
    now()
);