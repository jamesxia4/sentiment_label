-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2015-09-22 19:29:37
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `label_netease_gdas_test`
--

-- --------------------------------------------------------

--
-- 表的结构 `label_ods_rst`
--

CREATE TABLE IF NOT EXISTS `label_ods_rst` (
  `ods_sentence_id` bigint(11) NOT NULL,
  `date_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `source_id` bigint(11) NOT NULL,
  `comment_id` bigint(11) NOT NULL,
  `sentence_index` int(11) NOT NULL,
  `concept_id` bigint(11) NOT NULL,
  `source_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `concept_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `src_content` varchar(3000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sentiment` float DEFAULT NULL,
  `is_conflict` int(11) DEFAULT NULL,
  `is_relevent` int(11) DEFAULT NULL,
  `task_id` bigint(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ods_sentence_id`,`task_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `label_ods_src`
--

CREATE TABLE IF NOT EXISTS `label_ods_src` (
  `ods_sentence_id` bigint(11) NOT NULL,
  `date_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `source_id` bigint(11) NOT NULL,
  `comment_id` bigint(11) NOT NULL,
  `sentence_index` int(11) NOT NULL,
  `concept_id` bigint(11) NOT NULL,
  `source_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `concept_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `src_content` varchar(3000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `task_id` bigint(11) NOT NULL,
  PRIMARY KEY (`ods_sentence_id`,`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_ods_src`
--

INSERT INTO `label_ods_src` (`ods_sentence_id`, `date_id`, `game_id`, `source_id`, `comment_id`, `sentence_index`, `concept_id`, `source_name`, `concept_name`, `content`, `src_content`, `task_id`) VALUES
(1, 20150922, 1, 1, 1, 1, 1, '百度贴吧', '画面', '这个游戏画面好糟糕', '这个游戏画面好糟糕，但是易于上手', 1);

-- --------------------------------------------------------

--
-- 表的结构 `label_task`
--

CREATE TABLE IF NOT EXISTS `label_task` (
  `task_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  PRIMARY KEY (`task_id`),
  KEY `end_time` (`end_time`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=14 ;

--
-- 转存表中的数据 `label_task`
--

INSERT INTO `label_task` (`task_id`, `start_time`, `end_time`) VALUES
(1, '2015-09-16 16:00:00', '2015-09-17 16:00:00'),
(2, '2015-09-16 16:01:00', '2015-09-17 16:01:00'),
(3, '2015-09-16 16:02:00', '2015-09-17 16:02:00'),
(4, '2015-09-16 16:03:00', '2015-09-17 16:03:00'),
(5, '2015-09-16 16:04:00', '2015-09-17 16:04:00'),
(6, '2015-09-16 16:05:00', '2015-09-17 16:05:00'),
(7, '2015-09-16 16:06:00', '2015-09-17 16:06:00'),
(8, '2015-09-16 16:07:00', '2015-09-17 16:07:00'),
(9, '2015-09-16 16:08:00', '2015-09-17 16:08:00'),
(10, '2015-09-16 16:09:00', '2015-09-17 16:09:00'),
(11, '2015-09-16 16:10:00', '2015-09-17 16:10:00'),
(12, '2015-09-16 16:11:00', '2015-09-17 16:11:00'),
(13, '2015-09-16 16:12:00', '2015-09-17 16:12:00');

-- --------------------------------------------------------

--
-- 表的结构 `label_user`
--

CREATE TABLE IF NOT EXISTS `label_user` (
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `total_labeled` bigint(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `total_labeled` (`total_labeled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_user`
--

INSERT INTO `label_user` (`user_id`, `total_labeled`) VALUES
('James', 0),
('John', 0),
('Mary', 200),
('Carter', 400),
('Thomas', 600);

-- --------------------------------------------------------

--
-- 表的结构 `label_user_task`
--

CREATE TABLE IF NOT EXISTS `label_user_task` (
  `task_id` bigint(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `kappa` float DEFAULT NULL,
  `num_effective` int(11) DEFAULT NULL,
  `progress` int(11) NOT NULL,
  PRIMARY KEY (`task_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_user_task`
--

INSERT INTO `label_user_task` (`task_id`, `user_id`, `kappa`, `num_effective`, `progress`) VALUES
(1, 'James', 0, 0, 200),
(1, 'John', 0, 0, 0),
(1, 'Mary', 0.9, 150, 200),
(2, 'James', 0, 0, 0),
(2, 'John', 0, 0, 0),
(2, 'Mary', 0.8, 140, 200),
(3, 'James', 0, 0, 0),
(3, 'John', 0, 0, 0),
(3, 'Mary', 0.7, 130, 200),
(4, 'James', 0, 0, 0),
(4, 'John', 0, 0, 0),
(4, 'Mary', 0, 0, 0),
(5, 'James', 0, 0, 0),
(5, 'John', 0, 0, 0),
(5, 'Mary', 0, 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
