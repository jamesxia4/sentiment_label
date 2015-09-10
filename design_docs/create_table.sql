mysql> show tables;
+------------------------+																	——————————————————————————
| Tables_in_netease_gdas |
+------------------------+																	——————————————————————————
| label_task             |																	标注任务
| label_user             |																	标注人员			
| ods_label              |																	标注项
| user_finised_task      |																	每个标注人员已完成的任务
| user_task_taken        |																	每个标注人员已领取的任务
+------------------------+
5 rows in set (0.01 sec)

mysql> desc label_task;
+--------------+---------------+------+-----+---------+----------------+
| Field        | Type          | Null | Key | Default | Extra          |
+--------------+---------------+------+-----+---------+----------------+
| task_id      | bigint(11)    | NO   | PRI | NULL    | auto_increment |					标注任务id
| start_time   | datetime      | NO   |     | NULL    |                |					任务起始时间
| end_time     | datetime      | NO   | MUL | NULL    |                |					任务截止时间
| batch_desc   | varchar(3000) | YES  |     | NULL    |                |					任务介绍
| label_std    | varchar(3000) | YES  |     | NULL    |                |					标注标准
| label_sample | varchar(3000) | YES  |     | NULL    |                |					标注范例
| num_worker   | int(11)       | NO   |     | NULL    |                |					已有人数
+--------------+---------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)

mysql> desc label_user;
+-------------------+------------+------+-----+---------+----------------+
| Field             | Type       | Null | Key | Default | Extra          |
+-------------------+------------+------+-----+---------+----------------+
| user_id           | bigint(11) | NO   | PRI | NULL    | auto_increment |					标注员id
| num_current_task  | bigint(11) | NO   |     | NULL    |                |					当前剩余任务数
| num_finished_task | bigint(11) | NO   |     | NULL    |                |					目前已完成任务数
| total_labeled     | bigint(11) | NO   | MUL | NULL    |                |					总共标注条目数
+-------------------+------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)

mysql> desc ods_label;
+----------------+---------------+------+-----+---------+----------------+
| Field          | Type          | Null | Key | Default | Extra          |
+----------------+---------------+------+-----+---------+----------------+
| label_id       | bigint(11)    | NO   | PRI | NULL    | auto_increment |					标注项id
| date_id        | int(11)       | NO   |     | NULL    |                |					时期
| game_id        | int(11)       | NO   |     | NULL    |                |					游戏id
| source_id      | bigint(11)    | NO   |     | NULL    |                |					数据来源
| comment_id     | bigint(11)    | NO   |     | NULL    |                |					评论id
| sentence_index | int(11)       | NO   |     | NULL    |                |					语句在评论中的序号
| concept_id     | bigint(11)    | NO   |     | NULL    |                |					特征id
| concept_name   | varchar(255)  | YES  |     | NULL    |                |					特征名
| src_content    | varchar(3000) | YES  |     | NULL    |                |					评论内容
| content        | varchar(500)  | YES  |     | NULL    |                |					语句内容
| sentiment      | float         | YES  |     | NULL    |                |					情感倾向
| is_conflict    | int(11)       | YES  |     | NULL    |                |					情感倾向是否前后矛盾
| is_relevent    | int(11)       | YES  |     | NULL    |                |					语句是否与特征无关
| task_id        | bigint(11)    | NO   | PRI | NULL    |                |					标注项属于的任务id
| user_id        | bigint(11)    | NO   | PRI | NULL    |                |					标注员id
| is_final       | int(11)       | NO   |     | NULL    |                |					是否为已提交标注项
| last_edit      | datetime      | NO   |     | NULL    |                |					最后编辑时间
+----------------+---------------+------+-----+---------+----------------+
17 rows in set (0.00 sec)

mysql> desc user_finished_task;
+---------------+------------+------+-----+---------+----------------+
| Field         | Type       | Null | Key | Default | Extra          |
+---------------+------------+------+-----+---------+----------------+
| id            | bigint(11) | NO   | PRI | NULL    | auto_increment |						用户已完成任务id
| task_id       | bigint(11) | NO   | PRI | NULL    |                |						对应task表中任务id
| user_id       | bigint(11) | NO   | PRI | NULL    |                |						用户id
| kappa         | float      | YES  |     | NULL    |                |						一致性参数
| num_effective | int(11)    | YES  |     | NULL    |                |						有效条目数
+---------------+------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

mysql> desc user_task_taken;
+----------+------------+------+-----+---------+----------------+
| Field    | Type       | Null | Key | Default | Extra          |
+----------+------------+------+-----+---------+----------------+
| id       | bigint(11) | NO   | PRI | NULL    | auto_increment |							用户已接任务id
| task_id  | bigint(11) | NO   | PRI | NULL    |                |							对应task表中任务id
| user_id  | bigint(11) | NO   | PRI | NULL    |                |							用户id
| progress | int(11)    | NO   |     | NULL    |                |							进度
+----------+------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)










create database netease_gdas;
USE netease_gdas;

CREATE TABLE IF NOT EXISTS label_user
(
	user_id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	num_current_task BIGINT(11) NOT NULL,
	num_finished_task BIGINT(11) NOT NULL,
	total_labeled BIGINT(11) NOT NULL,
	INDEX(total_labeled)
);

CREATE TABLE IF NOT EXISTS label_task
(
	task_id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	start_time DATETIME NOT NULL,
	end_time DATETIME NOT NULL,
	batch_desc VARCHAR(3000),
	label_std VARCHAR(3000),
	label_sample VARCHAR(3000),
	num_worker INT(11) NOT NULL,
	INDEX(end_time)
);

Create table if not exists user_finished_task
(
	id bigint(11) not null auto_increment,
    task_id bigint(11) not null,
    user_id bigint(11) not null,
    kappa float,
    num_effective int(11),
    Primary key(id,task_id,user_id)
);

Create table if not exists user_task_taken
(
	id bigint(11) not null auto_increment,
    task_id bigint(11) not null,
    user_id bigint(11) not null,
    progress int(11) not null,
    Primary key(id,task_id,user_id)
);

create table if not exists ods_label
(
	 label_id bigint(11) not null auto_increment,
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
     user_id bigint(11) not null,
     is_final int(11) not null,
     last_edit datetime not null,
     Primary key(label_id,task_id,user_id)
);