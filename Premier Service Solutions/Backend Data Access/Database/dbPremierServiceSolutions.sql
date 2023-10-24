-- Active: 1696838194376@@127.0.0.1@3306@premier_service_solutions
USE `Premier_Service_Solutions`;

-- Create tables
CREATE TABLE Client (
    ClientID INT AUTO_INCREMENT PRIMARY KEY,
    ClientName VARCHAR(100),
    Email VARCHAR(50),
    Password VARCHAR(50),
    Address VARCHAR(50),
    ContactNumber VARCHAR(15)
);

CREATE TABLE Employee (
    EmpID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(50),
    Password VARCHAR(50),
    ContactNumber VARCHAR(15),
    EmgContact VARCHAR(15),
    Skills VARCHAR(100)
);

CREATE TABLE PackageTracking (
    PackageID INT AUTO_INCREMENT PRIMARY KEY,
    PackageName VARCHAR(50),
    Price INT,
    ServiceContractCount INT DEFAULT 0
);

CREATE TABLE ServiceContract (
    ContractID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    PackageID INT,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    ContractType VARCHAR(30) NOT NULL,
    ServiceLevel VARCHAR(30),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (PackageID) REFERENCES PackageTracking(PackageID)    
);

CREATE TABLE ServiceRequest (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    EmpID INT,
    RequestDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    RequestDetails VARCHAR(100) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (EmpID) REFERENCES Employee(empID)    
);



-- Create stored procedures
DELIMITER //
CREATE PROCEDURE spGetClientServiceRequests (IN Client_ID INT)
BEGIN
    SELECT * FROM ServiceRequest WHERE ClientID = Client_ID;
END//

CREATE PROCEDURE spGetClientDetails (IN Client_Email VARCHAR(50))
BEGIN
    SELECT
        C.ClientID,
        C.ClientName,
        C.Email,
        C.ContactNumber,
        SC.ContractType,
        SC.EndDate
    FROM
        Client C
    INNER JOIN
        ServiceContract SC ON C.ClientID = SC.ClientID
    WHERE
        C.Email = Client_Email;
END //

CREATE PROCEDURE spGetActiveContracts ()
BEGIN
    SELECT * FROM ServiceContract WHERE EndDate >= NOW();
END//

CREATE PROCEDURE spGetMaintenanceJobs (IN Emp_ID INT)
BEGIN
    SELECT * FROM ServiceRequest WHERE EmpID = Emp_ID;
END//

CREATE PROCEDURE spGetActiveJobs ()
BEGIN
    SELECT * FROM ServiceRequest WHERE Status = "In Progress";
END//

CREATE PROCEDURE spGetEmployeeDetails (IN Emp_Email VARCHAR(50))
BEGIN
    SELECT * FROM Employee WHERE Email = Emp_Email;
END//

CREATE PROCEDURE spGetAllClientDetails (IN Client_Email VARCHAR(50))
BEGIN
    SELECT * FROM Client WHERE Email = Client_Email;
END//
DELIMITER ;


-- Create indexes
CREATE INDEX idxClient_ClientID ON Client (ClientID);

CREATE INDEX idxServiceContract_ContractID ON ServiceContract (ContractID);

CREATE INDEX idxTechnician_EmpID ON Employee (EmpID);


-- Create triggers

DELIMITER //

-- Trigger to update ServiceContract fields before INSERT
CREATE TRIGGER trgBefore_ServiceContract_Insert
BEFORE INSERT ON ServiceContract
FOR EACH ROW
BEGIN
    -- Update PackageID and ServiceLevel based on ContractType
    CASE NEW.ContractType
        WHEN 'Standard' THEN
            SET NEW.PackageID = 1, NEW.ServiceLevel = 'Basic-Level';
        WHEN 'Business' THEN
            SET NEW.PackageID = 2, NEW.ServiceLevel = 'High-End';
        WHEN 'Premium' THEN
            SET NEW.PackageID = 3, NEW.ServiceLevel = 'Mid-High-End';
        WHEN 'Business Promo' THEN
            SET NEW.PackageID = 4, NEW.ServiceLevel = 'High-End';
        WHEN 'Premium Promo' THEN
            SET NEW.PackageID = 5, NEW.ServiceLevel = 'Mid-High-End';
        ELSE
            -- Handle any other ContractType values if needed
            SET NEW.PackageID = NULL, NEW.ServiceLevel = NULL; -- Set to NULL if no match
    END CASE;
END //


-- Trigger to update ServiceContractCount after INSERT
CREATE TRIGGER trgAfter_ServiceContract_Insert
AFTER INSERT ON ServiceContract
FOR EACH ROW
BEGIN
    -- Update ServiceContractCount in PackageTracking
    UPDATE PackageTracking
    SET ServiceContractCount = (
        (SELECT COUNT(*)
        FROM ServiceContract
        WHERE PackageID = NEW.PackageID)
    )
    WHERE PackageID = NEW.PackageID;
END //


-- Trigger to update ServiceContractCount after DELETE
CREATE TRIGGER trgAfter_ServiceContract_Delete
AFTER DELETE ON ServiceContract
FOR EACH ROW
BEGIN
    DECLARE contractCount INT DEFAULT 0;
    
    -- Get the count of ServiceContracts for the PackageID
    SELECT COUNT(*) INTO contractCount
    FROM ServiceContract
    WHERE PackageID = OLD.PackageID;

    -- Check if the count is 0 and update ServiceContractCount accordingly
    IF contractCount = 0 THEN
        UPDATE PackageTracking
        SET ServiceContractCount = 0
        WHERE PackageID = OLD.PackageID;
    ELSE
        UPDATE PackageTracking
        SET ServiceContractCount = contractCount
        WHERE PackageID = OLD.PackageID;
    END IF;
END //


-- Trigger to update ServiceContractCount before UPDATE
CREATE TRIGGER trgBefore_ServiceContract_Update
BEFORE UPDATE ON ServiceContract
FOR EACH ROW
BEGIN
    -- Update PackageID based on ContractType
    CASE NEW.ContractType
        WHEN 'Standard' THEN
            SET NEW.PackageID = 1, NEW.ServiceLevel = 'Basic-Level';
        WHEN 'Business' THEN
            SET NEW.PackageID = 2, NEW.ServiceLevel = 'High-End';
        WHEN 'Premium' THEN
            SET NEW.PackageID = 3, NEW.ServiceLevel = 'Mid-High-End';
        WHEN 'Business Promo' THEN
            SET NEW.PackageID = 4, NEW.ServiceLevel = 'High-End';
        WHEN 'Premium Promo' THEN
            SET NEW.PackageID = 5, NEW.ServiceLevel = 'Mid-High-End';
        ELSE
            -- Handle any other ContractType values if needed
            SET NEW.PackageID = NULL; -- Set to NULL if no match
    END CASE;

    -- Update ServiceContractCount for the updated PackageID
    UPDATE PackageTracking
    SET ServiceContractCount = 0
    WHERE PackageID = OLD.PackageID;
END //


-- Trigger to update ServiceContractCount after UPDATE
CREATE TRIGGER trgAfter_ServiceContract_Update
AFTER UPDATE ON ServiceContract
FOR EACH ROW
BEGIN
    DECLARE oldContractCount INT DEFAULT 0;
    DECLARE newContractCount INT DEFAULT 0;

    -- Get the count of ServiceContracts for the old PackageID
    IF OLD.PackageID IS NOT NULL THEN
        SELECT COUNT(*) INTO oldContractCount
        FROM ServiceContract
        WHERE PackageID = OLD.PackageID;
    END IF;

    -- Get the count of ServiceContracts for the new PackageID
    IF NEW.PackageID IS NOT NULL THEN
        SELECT COUNT(*) INTO newContractCount
        FROM ServiceContract
        WHERE PackageID = NEW.PackageID;
    END IF;

    -- Update ServiceContractCount for the old PackageID
    UPDATE PackageTracking
    SET ServiceContractCount = oldContractCount
    WHERE PackageID = OLD.PackageID;

    -- Update ServiceContractCount for the new PackageID
    UPDATE PackageTracking
    SET ServiceContractCount = newContractCount
    WHERE PackageID = NEW.PackageID;

END //

DELIMITER ;