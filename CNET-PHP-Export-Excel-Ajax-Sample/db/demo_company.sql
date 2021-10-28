--
-- Table structure for table `demo_company`
--

DROP TABLE IF EXISTS `demo_company`;
CREATE TABLE IF NOT EXISTS `demo_company` (
  `comp_id` int(11) NOT NULL AUTO_INCREMENT,
  `companyname` varchar(255) DEFAULT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `year` varchar(10) NOT NULL,
  `section` varchar(10) NOT NULL,
  PRIMARY KEY (`comp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `demo_company`
--

INSERT INTO `demo_company` (`comp_id`, `companyname`, `firstname`, `lastname`, `year`, `section`) VALUES
(1, 'TIPL', 'Chetan', 'Sheth', '2021', 'Agency'),
(2, 'AIPL', 'Demo', 'Demo', '2020', 'B2B'),
(3, 'CNET', 'Chetan', 'Sheth', '2019', 'AI Base');
COMMIT;


