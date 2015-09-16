create database label_netease_gdas;
USE label_netease_gdas;

CREATE TABLE IF NOT EXISTS label_user
(
	user_id varchar(255) NOT NULL PRIMARY KEY,
	num_current_task BIGINT(11) NOT NULL,
	num_finished_task BIGINT(11) NOT NULL,
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

create table if not exists label_ods
(
	 ods_sentence_id bigint(11) not null,
     date_id int(11) not null,
     game_id int(11) not null,
     source_id bigint(11) not null,
     comment_id bigint(11) not null,
     sentence_index int(11) not null,
     concept_id bigint(11) not null,
     concept_name varchar(255),
     src_content varchar(3000),
     content varchar(500),
     sentiment float,
     is_conflict int(11),
     is_relevent int(11),
     task_id bigint(11) not null,
     user_id varchar(255) not null,
	 is_useful int(11),
     Primary key(ods_sentence_id,task_id,user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;