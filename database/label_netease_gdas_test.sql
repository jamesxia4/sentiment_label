-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2015-11-03 13:45:11
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
  `task_id` bigint(11) NOT NULL,
  `task_group` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
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
  PRIMARY KEY (`ods_sentence_id`,`task_id`,`task_group`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `label_ods_src`
--

CREATE TABLE IF NOT EXISTS `label_ods_src` (
  `ods_sentence_id` bigint(11) NOT NULL,
  `task_id` bigint(11) NOT NULL,
  `task_group` bigint(11) NOT NULL,
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
  PRIMARY KEY (`ods_sentence_id`,`task_id`,`task_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `label_task`
--

CREATE TABLE IF NOT EXISTS `label_task` (
  `task_id` bigint(11) NOT NULL,
  `task_group` bigint(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `task_title` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `commentGame` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `dataSource` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `dataTime` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `taskSize` int(11) NOT NULL,
  `taskType` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `generalDesc` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`task_id`,`task_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_task`
--

INSERT INTO `label_task` (`task_id`, `task_group`, `start_time`, `end_time`, `task_title`, `commentGame`, `dataSource`, `dataTime`, `taskSize`, `taskType`, `generalDesc`) VALUES
(1, 1, '2015-10-13 22:00:00', '2015-11-13 22:00:00', '2015第1期 玩家评论情感倾向任务 001', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(2, 1, '2015-10-13 22:00:00', '2015-11-13 22:00:00', '2015第1期 玩家评论情感倾向任务 002', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(3, 1, '2015-10-13 22:00:00', '2015-11-14 22:00:00', '2015第1期 玩家评论情感倾向任务 003', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(4, 1, '2015-10-13 22:00:00', '2015-11-14 22:00:00', '2015第1期 玩家评论情感倾向任务 004', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(5, 1, '2015-10-13 22:00:00', '2015-11-15 22:00:00', '2015第1期 玩家评论情感倾向任务 005', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(6, 1, '2015-10-13 22:00:00', '2015-11-13 22:00:00', '2015第1期 玩家评论情感倾向任务 006', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(7, 1, '2015-10-13 22:00:00', '2015-11-05 22:00:00', '2015第1期 玩家评论情感倾向任务 007', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(8, 1, '2015-10-13 22:00:00', '2015-11-05 22:00:00', '2015第1期 玩家评论情感倾向任务 008', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(9, 1, '2015-10-13 22:00:00', '2015-11-05 22:00:00', '2015第1期 玩家评论情感倾向任务 009', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计'),
(10, 1, '2015-10-13 22:00:00', '2015-11-05 22:00:00', '2015第1期 玩家评论情感倾向任务 010', '炉石传说', '百度贴吧', '2015.10.1~2015.12.1', 100, '情感倾向任务 文字类', '该任务数据来源于“UXData-舆情监控系统”从网上抓取的用户评论。任务目的是标注相关评论语句的情感倾向以及与游戏特征的关系，标注结果将用于评估舆情监控系统中情感分类算法的准确率，以便进行算法迭代和后续通用指数的设计');

-- --------------------------------------------------------

--
-- 表的结构 `label_user`
--

CREATE TABLE IF NOT EXISTS `label_user` (
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `total_labeled` bigint(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_user`
--

INSERT INTO `label_user` (`user_id`, `total_labeled`) VALUES
('gzwanwei', 0),
('hzjiangdapeng', 100),
('hzmazewu', 406),
('hzxiayuanfang', 203),
('hzzhangtengji', 200);

-- --------------------------------------------------------

--
-- 表的结构 `label_user_task`
--

CREATE TABLE IF NOT EXISTS `label_user_task` (
  `task_id` bigint(11) NOT NULL,
  `user_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `task_group` bigint(11) NOT NULL,
  `kappa` float DEFAULT NULL,
  `num_effective` int(11) DEFAULT NULL,
  `progress` int(11) NOT NULL,
  `is_finished` int(11) DEFAULT NULL,
  PRIMARY KEY (`task_id`,`task_group`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `label_user_task`
--

INSERT INTO `label_user_task` (`task_id`, `user_id`, `task_group`, `kappa`, `num_effective`, `progress`, `is_finished`) VALUES
(1, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(2, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(3, 'gzwanwei', 1, 0, 0, 50, 0),
(3, 'hzjiangdapeng', 1, 0, 0, 50, 0),
(3, 'hzzhangtengji', 1, 0, 0, 50, 0),
(4, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(5, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(7, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(8, 'hzxiayuanfang', 1, 0, 0, 100, 0),
(9, 'gzwanwei', 1, 0, 0, 50, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
