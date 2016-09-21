CREATE DATABASE neuronetDB;

USE neuronetDB;

CREATE TABLE `Departments` (
  `DepartmentID` int(11) NOT NULL AUTO_INCREMENT,
  `DepartmentName` varchar(50) NOT NULL DEFAULT '',
  `OverHeadCosts` int(11) NOT NULL,
  `TotalSales` int(11) NOT NULL,
  PRIMARY KEY (`DepartmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Products` (
  `ItemID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(50) NOT NULL DEFAULT '',
  `DepartmentName` varchar(50) NOT NULL DEFAULT '',
  `CategoryName` varchar(50) DEFAULT NULL,
  `Price` int(11) NOT NULL,
  `StockQuantity` int(11) NOT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `Departments` (`DepartmentID`, `DepartmentName`, `OverHeadCosts`, `TotalSales`)
VALUES
	(1,'Cyberware',950000,0),
	(2,'Vehicles',2100000,0),
	(3,'Matrix Gear',656000,0);

INSERT INTO `Products` (`ItemID`, `ProductName`, `DepartmentName`, `CategoryName`, `Price`, `StockQuantity`)
VALUES
	(1,'Sony CT-360-D','Cyberware','Cranial Cyberdeck',57000,10),
	(2,'Novatech Hyperdeck-6','Cyberware','Cranial Cyberdeck',150000,99),
	(3,'Renraku Kraftwerk-8','Cyberware','Cranial Cyberdeck',450000,9),
	(4,'Diagnosis Processor','Cyberware','Biomonitor System',5000,10),
	(5,'Subdermal Display','Cyberware','Biomonitor System',2500,200),
	(6,'Saab-Thyssen Bloodhound','Vehicles','Drone [Ground]',23500,100),
	(7,'Toyota MK-Guyver','Vehicles','Drone [Ground]',95375,100),
	(8,'Ærodesign Condor II LD SD-41','Vehicles','Drone [Air]',33650,50),
	(9,'Sikorski-Bell Microskimmer II','Vehicles','Drone [Air]',18300,300),
	(10,'Sony CTY-360-D','Matrix Gear','Cyberdeck',70000,299),
	(11,'Fuchi Cyber-4','Matrix Gear','Cyberdeck',121400,20),
	(12,'Renraku Kraftwerk-8','Matrix Gear','Cyberdeck',400000,98),
	(13,'Transys Highlander','Matrix Gear','Cyberdeck',600000,0);
