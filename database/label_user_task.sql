-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2015-11-06 08:44:56
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
(1, 'gzwanwei', 1, 0.88, 0, 0, 1),
(1, 'hzxiayuanfang', 1, 0.89, 0, 100, 1),
(2, 'gzwanwei', 1, 0.78, 0, 0, 1),
(2, 'hzxiayuanfang', 1, 0.66, 0, 100, 1),
(3, 'gzwanwei', 1, 0.7, 0, 50, 1),
(3, 'hzjiangdapeng', 1, 0.8, 0, 50, 1),
(3, 'hzzhangtengji', 1, 0.9, 0, 50, 1),
(4, 'gzwanwei', 1, 0.4, 0, 0, 1),
(4, 'hzxiayuanfang', 1, 0.7, 0, 100, 1),
(5, 'hzxiayuanfang', 1, 0.33, 0, 100, 1),
(7, 'hzxiayuanfang', 1, 0.47, 0, 100, 1),
(9, 'gzwanwei', 1, 0.65, 0, 50, -1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
