SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `dragdrop` (
  `id` int(5) NOT NULL,
  `vObject` varchar(300) NOT NULL,
  `tText` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dragdrop`
--

INSERT INTO `dragdrop` (`id`, `vObject`, `tText`) VALUES
(1, 'div1', '\"drag4#image::Images/4-Number-PNG.png\";'),
(2, 'div4', '\"drag2#image::mages/2-Number-PNG.png\";'),
(3, 'div5', '\"drag5#image::Images/5-Number-PNG.png\";'),
(4, 'div2', '\"drag1#image::Images/1-Number-PNG.png\";'),
(5, 'div6', '\"drag8#image::Images/8-Number-PNG.png\";'),
(6, 'div8', '\"drag6#image::Images/6-Number-PNG.png\";');
