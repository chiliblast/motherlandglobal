-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 03, 2023 at 06:19 PM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `motherlandglobal`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `sp_addRemoveFavourite`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addRemoveFavourite` (IN `p_user_id` INT, IN `p_video_id` INT, OUT `p_result` VARCHAR(10))  NO SQL
BEGIN
    IF EXISTS (
        SELECT * FROM favourites 
        WHERE user_id = p_user_id AND video_id = p_video_id
    ) THEN
        DELETE FROM favourites 
        WHERE user_id = p_user_id AND video_id = p_video_id;
        SET p_result = 'removed';
    ELSE
        INSERT INTO favourites (user_id, video_id) VALUES (p_user_id, p_video_id);
        SET p_result = 'added';
    END IF;
END$$

DROP PROCEDURE IF EXISTS `sp_signin`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_signin` (IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255))  NO SQL
BEGIN
  DECLARE hashed_password VARCHAR(255);
  
  SET hashed_password = MD5(p_password);
  
  SELECT id, firstname,lastName,email FROM users WHERE email = p_email AND password = hashed_password;
END$$

DROP PROCEDURE IF EXISTS `sp_signup`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_signup` (IN `p_firstName` VARCHAR(255), IN `p_lastName` VARCHAR(255), IN `p_email` VARCHAR(255), IN `p_password` VARCHAR(255))  BEGIN
  DECLARE hashed_password VARCHAR(255);
  SET hashed_password = MD5(p_password);

  INSERT INTO users (firstName, lastName, email, password)
  SELECT p_firstName, p_lastName, p_email, hashed_password
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = p_email
  );
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
CREATE TABLE IF NOT EXISTS `favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `video_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `city_name` varchar(50) NOT NULL,
  `country_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `latitude`, `longitude`, `city_name`, `country_name`) VALUES
(2, 28, 3, 'Algiers', 'Algeria'),
(3, -12.5, 18.5, 'Luanda', 'Angola'),
(4, -20, 30, 'Harare', 'Zimbabwe'),
(5, 24.5, -13, 'El-Aaiun', '\"Western Sahara'),
(6, 3.5337, 16.0666, 'Nola', 'Central African Republic'),
(7, 7.0006, 19.1808, 'Kaga Bandoro', 'Central African Republic'),
(8, 6.3172, 16.3783, 'Bozoum', 'Central African Republic'),
(9, 6.5369, 21.9919, '16.3783', 'Central African Republic'),
(10, 4.3313, 18.5163, 'Bimbo', 'Central African Republic'),
(11, 15.6031, 32.5265, 'Khartoum', 'Sudan'),
(12, 15.45, 36.4, 'Kassala', 'Sudan');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `link` varchar(100) NOT NULL,
  `location_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `link`, `location_id`) VALUES
(1, 'https://www.youtube.com/embed/ErOMbspikNg', 2),
(2, 'https://www.youtube.com/embed/eEpEeyqGlxA', 2),
(3, 'https://www.youtube.com/embed/rDrjQyatgXQ', 4),
(4, 'https://www.youtube.com/embed/ljbSlGigTPM', 5),
(5, 'https://www.youtube.com/embed/xnYpCXZJWAE', 6),
(6, 'https://www.youtube.com/embed/hMfur2X7Qco', 7);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
