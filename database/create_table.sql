create database label_netease_gdas;
USE label_netease_gdas;

CREATE TABLE IF NOT EXISTS label_user
(
	user_id varchar(255) NOT NULL PRIMARY KEY,
	total_labeled BIGINT(11) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS label_task
(
	task_id BIGINT(11) NOT NULL,
	task_group BIGINT(11) NOT NULL,
	start_time DATETIME NOT NULL,
	end_time DATETIME NOT NULL,
	task_title varchar(500),
	description varchar(3000),
	requirements varchar(3000),
	Primary key(task_id,task_group)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_user_task
(
    task_id bigint(11) not null,
    user_id varchar(255) not null,
	task_group bigint(11) not null,
    kappa float,
    num_effective int(11),
    progress int(11) not null,
	is_finished int(11) not null,
    Primary key(task_id,task_group,user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_ods_src
(
	 ods_sentence_id bigint(11) not null,
	 task_id bigint(11) not null,
	 task_group bigint(11) not null,
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
     Primary key(ods_sentence_id,task_id,task_group)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

create table if not exists label_ods_rst
(
	 ods_sentence_id bigint(11) not null,
	 task_id bigint(11) not null,
	 task_group varchar(255) not null,
     user_id varchar(255) not null,
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
     Primary key(ods_sentence_id,task_id,task_group,user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;