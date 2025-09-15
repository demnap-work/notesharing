CREATE DATABASE  IF NOT EXISTS `notesharing` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `notesharing`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: notesharing
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text NOT NULL,
  `creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `state` int(11) NOT NULL DEFAULT '1',
  `owner` int(11) NOT NULL,
  `tags` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (1,'queso è il testo della nuova nota con postman','2025-09-11 15:11:44',0,1,NULL),(2,'queso è il testo della nuova nota con postman','2025-09-11 15:14:46',1,1,NULL),(3,'Nuovo testo nota','2025-09-11 15:16:19',1,1,NULL),(4,'prova nota','2025-09-11 15:16:25',1,2,NULL),(5,'prova nota','2025-09-11 15:19:26',1,2,NULL),(6,'prova nota','2025-09-11 15:19:58',1,3,NULL),(7,'prova nota','2025-09-11 15:21:16',1,3,NULL),(8,'ciaone','2025-09-11 16:47:20',1,3,NULL),(9,'<h2>Titolo</h2><p>prova modifica nota con tags</p>','2025-09-11 17:13:53',1,1,'lavoro, commessa, projects'),(10,'<h2><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong></h2><p><span style=\"color: rgb(0, 0, 0);\">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only </span></p><ul><li><span style=\"color: rgb(0, 0, 0);\">five centuries, but also </span></li><li><span style=\"color: rgb(0, 0, 0);\">the leap into electronic </span></li><li><span style=\"color: rgb(0, 0, 0);\">typesetting, remaining </span></li></ul><p><span style=\"color: rgb(0, 0, 0);\">essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>','2025-09-13 14:53:48',1,1,'tag1, tag2'),(11,'<h2><strong style=\"color: rgb(0, 0, 0);\">Lorem</strong></h2><p><span style=\"color: rgb(0, 0, 0);\">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only</span></p>','2025-09-13 15:59:17',1,1,''),(12,'<h2><strong style=\"color: rgb(0, 0, 0);\">Lorem Ipsum</strong></h2><p><span style=\"color: rgb(0, 0, 0);\">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only</span></p>','2025-09-13 15:59:19',1,1,''),(13,'<h2>Titolo 13</h2><ul><li><span style=\"color: rgb(0, 0, 0);\">five centuries, but also</span></li><li><span style=\"color: rgb(0, 0, 0);\">the leap into electronic</span></li><li><span style=\"color: rgb(0, 0, 0);\">typesetting, remaining</span></li></ul><p><br></p>','2025-09-13 15:59:28',1,1,''),(14,'<p><a href=\"http:giuseppedemartino.it\" rel=\"noopener noreferrer\" target=\"_blank\">giuseppe</a></p>','2025-09-13 16:08:02',0,1,''),(15,'<p><a href=\"https://giuseppedemartino.it\" rel=\"noopener noreferrer\" target=\"_blank\">giuseppe</a></p>','2025-09-13 16:08:57',1,1,''),(25,'<p>prova nota</p>','2025-09-14 18:20:39',1,1,''),(26,'<h2 class=\"ql-align-center\"><strong>Note</strong></h2><p class=\"ql-align-center\"><em>Remember to do something about the post-its.</em></p>','2025-09-15 08:49:24',1,1,'note, todo, work');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-15 15:16:54
