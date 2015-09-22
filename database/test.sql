drop database label_netease_gdas_test;
create database label_netease_gdas_test;
USE label_netease_gdas_test;

CREATE TABLE IF NOT EXISTS label_user
(
	user_id varchar(255) NOT NULL PRIMARY KEY,
	total_labeled BIGINT(11) NOT NULL,
	INDEX(total_labeled)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS label_task
(
	task_id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	start_time DATETIME NOT NULL,
	end_time DATETIME NOT NULL,
	INDEX(end_time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_user_task
(
    task_id bigint(11) not null,
    user_id varchar(255) not null,
    kappa float,
    num_effective int(11),
    progress int(11) not null,
    Primary key(task_id,user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_ods_src
(
	 ods_sentence_id bigint(11) not null,
     date_id int(11) not null,
     game_id int(11) not null,
     source_id bigint(11) not null,
     comment_id bigint(11) not null,
     sentence_index int(11) not null,
     concept_id bigint(11) not null,
	 source_name varchar(255),
     concept_name varchar(255),
	 content varchar(500),
     src_content varchar(3000),
     task_id bigint(11) not null,
     Primary key(ods_sentence_id,task_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_ods_rst
(
	 ods_sentence_id bigint(11) not null,
     date_id int(11) not null,
     game_id int(11) not null,
     source_id bigint(11) not null,
     comment_id bigint(11) not null,
     sentence_index int(11) not null,
     concept_id bigint(11) not null,
	 source_name varchar(255),
     concept_name varchar(255),
	 content varchar(500),
     src_content varchar(3000),
     sentiment float,
     is_conflict int(11),
     is_relevent int(11),
     task_id bigint(11) not null,
     user_id varchar(255) not null,
     Primary key(ods_sentence_id,task_id,user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/**
Create label_task
**/
Insert into label_task values(1,'2015-09-16 16:00:00','2015-09-17 16:00:00');
Insert into label_task values(2,'2015-09-16 16:01:00','2015-09-17 16:01:00');
Insert into label_task values(3,'2015-09-16 16:02:00','2015-09-17 16:02:00');
Insert into label_task values(4,'2015-09-16 16:03:00','2015-09-17 16:03:00');
Insert into label_task values(5,'2015-09-16 16:04:00','2015-09-17 16:04:00');
Insert into label_task values(6,'2015-09-16 16:05:00','2015-09-17 16:05:00');
Insert into label_task values(7,'2015-09-16 16:06:00','2015-09-17 16:06:00');
Insert into label_task values(8,'2015-09-16 16:07:00','2015-09-17 16:07:00');
Insert into label_task values(9,'2015-09-16 16:08:00','2015-09-17 16:08:00');
Insert into label_task values(10,'2015-09-16 16:09:00','2015-09-17 16:09:00');
Insert into label_task values(11,'2015-09-16 16:10:00','2015-09-17 16:10:00');
Insert into label_task values(12,'2015-09-16 16:11:00','2015-09-17 16:11:00');
Insert into label_task values(13,'2015-09-16 16:12:00','2015-09-17 16:12:00');


/**
Create label_user
**/
Insert into label_user values('James',0);
Insert into label_user values('John',0);
Insert into label_user values('Mary',200);
Insert into label_user values('Carter',400);
Insert into label_user values('Thomas',600);


/**
Create label_user_task
**/
Insert into label_user_task values(1,'James',0,0,0);
Insert into label_user_task values(2,'James',0,0,0);
Insert into label_user_task values(3,'James',0,0,0);
Insert into label_user_task values(4,'James',0,0,0);
Insert into label_user_task values(5,'James',0,0,0);

Insert into label_user_task values(1,'John',0,0,0);
Insert into label_user_task values(2,'John',0,0,0);
Insert into label_user_task values(3,'John',0,0,0);
Insert into label_user_task values(4,'John',0,0,0);
Insert into label_user_task values(5,'John',0,0,0);

Insert into label_user_task values(1,'Mary',0,0,0);
Insert into label_user_task values(2,'Mary',0,0,0);
Insert into label_user_task values(3,'Mary',0,0,0);
Insert into label_user_task values(4,'Mary',0,0,0);
Insert into label_user_task values(5,'Mary',0,0,0);

