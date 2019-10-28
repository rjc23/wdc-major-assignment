-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: WDC_Project
-- ------------------------------------------------------
-- Server version	10.1.38-MariaDB-0ubuntu0.18.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `WDC_Project`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `WDC_Project` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `WDC_Project`;

--
-- Table structure for table `Booking`
--

DROP TABLE IF EXISTS `Booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Booking` (
  `Booking_Date` date NOT NULL,
  `Booking_ID` int(11) NOT NULL AUTO_INCREMENT,
  `User_ID` int(11) NOT NULL,
  `Booking_Time` varchar(10) NOT NULL,
  `Party_size` int(30) NOT NULL,
  `Restaurant_ID` int(11) NOT NULL,
  PRIMARY KEY (`Booking_ID`,`User_ID`),
  KEY `User_ID` (`User_ID`),
  KEY `Restaurant_ID` (`Restaurant_ID`),
  CONSTRAINT `Booking_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `User` (`User_ID`),
  CONSTRAINT `Booking_ibfk_2` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10019 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Booking`
--

LOCK TABLES `Booking` WRITE;
/*!40000 ALTER TABLE `Booking` DISABLE KEYS */;
INSERT INTO `Booking` VALUES ('2019-04-20',10009,12346,'7:30 PM',8,5556),('2019-02-18',10010,12347,'12:30 PM',10,5559),('2019-03-15',10011,12348,'10:00 AM',10,5558),('2019-04-22',10012,12349,'9:00 AM',3,5559),('2019-03-15',10013,12348,'7:00 PM',12,5560),('2019-05-21',10014,12350,'1:00 PM',13,5561),('2019-03-18',10015,12347,'10:30 AM',2,5560),('2019-04-07',10016,12350,'8:00 PM',11,5563),('2019-02-21',10017,12346,'1:00 PM',4,5564),('2019-05-18',10018,12350,'9:30 AM',7,5568);
/*!40000 ALTER TABLE `Booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Restaurant`
--

DROP TABLE IF EXISTS `Restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Restaurant` (
  `Name` varchar(50) NOT NULL,
  `Cuisine` varchar(60) NOT NULL,
  `Location` varchar(70) NOT NULL,
  `Average_Rating` int(5) DEFAULT NULL,
  `No_Of_Bookings` int(50) DEFAULT NULL,
  `Restaurant_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Opening_Time` varchar(80) DEFAULT NULL,
  `Password` varchar(100) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `Price` int(6) DEFAULT NULL,
  `Longitude` double(15,11) NOT NULL,
  `Latitude` double(15,11) NOT NULL,
  `Image_URL` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`Restaurant_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5570 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Restaurant`
--

LOCK TABLES `Restaurant` WRITE;
/*!40000 ALTER TABLE `Restaurant` DISABLE KEYS */;
INSERT INTO `Restaurant` VALUES ('Great Wall','Chinese','45 Waymouth St Adelaide SA 5000',4,4,5556,'Lunch/Dinner','WallPassword','wall@something.com',3,-34.92612220000,138.59788070000,NULL),('Yul\'s','Italian','250 Franklin St Adelaide SA 5000',5,8,5557,'Lunch/Dinner','YulPassword','yuls@something.com',5,-34.92729450000,138.58992170000,NULL),('Great India','Indian','250 Currie St Adelaide SA 5000',3,12,5558,'Dinner','IndiaPassword','India@something.com',1,-34.92448450000,138.58890160000,NULL),('Hunters','Continental','15 Wakefield St Kent Town SA 5067',3,10,5559,'Breakfast/Lunch','HuntersPassword','Hunters@something.com',3,-34.92132230000,138.62285560000,NULL),('Ryans Kitchen','Irish','130 Gawler St Woodville West SA 5011',4,3,5560,'Breakfast/Dinner','RyansPassword','ryan@something.com',5,-34.88985260000,138.52632200000,NULL),('Popeye The Sailor Man','Vegan','120 Elizabeth St Eastwood SA 5063',2,14,5561,'Lunch','PopeyesPassword','popeye@something.com',3,-34.94277070000,138.62179600000,NULL),('Shinchan','Japanese','140 Henley Beach RD Torrensville SA 5031',1,4,5562,'Breakfast','ShinchanPassword','shinchan@something.com',2,-34.92365860000,138.56514270000,NULL),('Daniel\'s Street Joint','Continental','321 Hendley Beach RD Brooklyn Park SA 5032',3,13,5563,'Breakfast/Lunch/Dinner','DanielPassword','daniel@something.com',4,-34.92539340000,138.54416890000,NULL),('Classic Arie\'s Sandwiches','Continental','79 Glenhelen Road Morphett Vale SA 5162',5,23,5564,'Lunch/Dinner','AriePassword','Arie@something.com',4,-35.12283600000,138.50927000000,NULL),('Chowpaty','Indian','123 Acre Avenue Morphett Vale SA 5162',4,9,5565,'Dinner','ChowpatyPassword','Chowpaty@something.com',2,-35.10611200000,138.51696430000,NULL),('Cool Sunit\'s Restaurant','African','120 Walkerville Terrace, Walkerville SA 5081',5,20,5566,'Lunch/Dinner','SunitPassword','Sunit@something.com',3,-34.89468720000,138.61849710000,NULL),('Hells Restaurant','Korean','24 Wakefield St Kent Town SA 5067',5,2,5567,'Breakfast/Dinner','HellsPassword','Hells@something.com',1,-34.92132230000,138.62285560000,NULL),('Slipway','Ethiopian','15 Wakefield St Kent Town SA 5067',4,3,5568,'Breakfast/Dinner','SlipwayPassword','Slipway@something.com',5,-34.92132230000,138.62285560000,NULL),('Dogs and Duck Kitchen','American','976 North East Road Modbury SA 5092',1,12,5569,'Lunch/Dinner','DogPassword','Dog@something.com',2,-34.83043990000,138.69227950000,NULL);
/*!40000 ALTER TABLE `Restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reviews` (
  `User_ID` int(11) NOT NULL,
  `Restaurant_ID` int(11) NOT NULL,
  `Comments` varchar(300) DEFAULT NULL,
  `Ratings` int(5) DEFAULT NULL,
  `Reviews_ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`Reviews_ID`),
  UNIQUE KEY `Reviews_ID` (`Reviews_ID`),
  KEY `Restaurant_ID` (`Restaurant_ID`),
  CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `User` (`User_ID`),
  CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`),
  CONSTRAINT `Reviews_ibfk_3` FOREIGN KEY (`User_ID`) REFERENCES `User` (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
INSERT INTO `Reviews` VALUES (12346,5556,'Amazing lunch. One of the best meals I’ve had in Adelaide. Thanks for being so accommodating with my pram and baby too.',4,1),(12346,5560,'Lovely food, lovely staff. Our first visit. Did not disappoint. Highly recommend.',5,6),(12346,5569,'Not great food, good service, sat behind a group who were loud, swearing and offensive. Staff kept proving them alcohol.',1,15),(12347,5557,'Had a fantastic time and we were blown away by the dishes we ate. Will definitely be back!',5,2),(12347,5559,'Not great food, good service, sat behind a group who were loud, swearing and offensive. Staff kept proving them alcohol.',3,5),(12347,5561,'I went to Shiki a number of years ago and it was lovely and the food great but I was hugely disappointed by the dinner. It was loud, customers were poorly dressed (whole standard has gone down) and the food was average.',2,7),(12347,5563,'We took our daughter for her birthday and it was a wonderful night',4,9),(12348,5558,'I would recommend the restaurant but not the banquet. Not very much food for the money.',3,3),(12348,5562,'Decor too dated, did not like being seated with strangers.',1,8),(12349,5559,'Everything was fine but it was just relatively average for what I was expecting to be a special dining experience.',3,4),(12349,5564,'the meal was fantastic we enjoyed every course, the chef was magnificent and knew his job really well. Wait staff were very friendly and helpful as this was our fist time to this sort of restaurant.',5,10),(12349,5566,'Fantastic service and ambiance at Shiki. The seafood is super fresh and the meat so tender! Will be back again, cheers',5,12),(12349,5567,'Had a really good time with amazing service and recommendale and polite staff.',5,13),(12350,5565,'It truly was a Special night out - one you don’t forget with friends and put anniversary dinner',4,11),(12350,5568,'Everything was fantastic but the desert was stale and very dry.',4,14);
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `User_ID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Phone_No` int(11) DEFAULT NULL,
  `Favourites` varchar(20) DEFAULT NULL,
  `SocialMedia_ID` varchar(30) DEFAULT NULL,
  `Password` char(50) NOT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `Email` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12351 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (12346,'Stephy','Cole',1234567890,'Great India','1234','-1808499459','Stephcol','stephy@something.com'),(12347,'Madelein','Parker',2147483647,'Yuls','3456','Madelein','MadePar','madelein@something.com'),(12348,'Bonnie','Ruth',1275689375,'','6789','Bonnie','BonnRuth','bonnie@something.com'),(12349,'Mjam','',1267503752,'','9876','Mjam','Mjam1','mjam@something.com'),(12350,'Stephen','Brown',2147483647,'Great Wall','5432','Stephen','StephenBrown','Stephen@something.com');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-09 16:06:25

