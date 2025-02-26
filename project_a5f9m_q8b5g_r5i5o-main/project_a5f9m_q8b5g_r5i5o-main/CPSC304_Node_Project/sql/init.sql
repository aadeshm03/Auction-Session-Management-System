DROP TABLE DeliveryVehicle CASCADE CONSTRAINTS;
DROP TABLE StorageFacility CASCADE CONSTRAINTS;
DROP TABLE Appraiser CASCADE CONSTRAINTS;
DROP TABLE Auctioneer CASCADE CONSTRAINTS;
DROP TABLE AuctionSession_Operates CASCADE CONSTRAINTS; 
DROP TABLE DeliversTo CASCADE CONSTRAINTS;
DROP TABLE CollectsFrom CASCADE CONSTRAINTS;
DROP TABLE Customers CASCADE CONSTRAINTS;
DROP TABLE ForSaleItems_ListedAt_Wins CASCADE CONSTRAINTS;
DROP TABLE Attend CASCADE CONSTRAINTS;
DROP TABLE Bidder CASCADE CONSTRAINTS;
DROP TABLE Seller CASCADE CONSTRAINTS;
DROP TABLE Items_Sells CASCADE CONSTRAINTS;
DROP TABLE InventoryItems_StoredAt CASCADE CONSTRAINTS;
DROP TABLE Bids_Receive_Places CASCADE CONSTRAINTS;
DROP TABLE Appraises CASCADE CONSTRAINTS;

-- DeliveryVehicle
CREATE TABLE DeliveryVehicle (
    licensePlate CHAR(6) PRIMARY KEY,
    makeModel VARCHAR(255) NOT NULL,
    payloadCapacity INT
);

-- StorageFacility
CREATE TABLE StorageFacility (
    address VARCHAR(255) PRIMARY KEY,
    facilityName VARCHAR(255),
    squareFT INT NOT NULL,
    rent INT
);

-- Appraiser
CREATE TABLE Appraiser (
    appraiserID INT PRIMARY KEY,
    appraiserName VARCHAR(255),
    areaOfExpertise VARCHAR(255) NOT NULL,
    appraiserFee INT 
);

-- Auctioneer
CREATE TABLE Auctioneer (
    employeeID INT PRIMARY KEY,
    auctioneerName VARCHAR(255),
    startDate DATE NOT NULL,
    hourlyWage INT 
);

-- AuctionSession_Operates
CREATE TABLE AuctionSession_Operates (
    event_date DATE,
    time VARCHAR(255),
    address VARCHAR(255),
    employeeID INT NOT NULL,
    phoneNumber INT,
    totalAttendees INT,
    numItems INT NOT NULL,
    commissionPercent INT,
    PRIMARY KEY (event_date, time, address),
    FOREIGN KEY (employeeID) REFERENCES Auctioneer(employeeID)
);

-- DeliversTo
CREATE TABLE DeliversTo (
    licensePlate CHAR(6),
    deliver_date DATE,
    time VARCHAR(255),
    address VARCHAR(255),
    PRIMARY KEY (licensePlate, deliver_date, time, address),
    FOREIGN KEY (licensePlate) REFERENCES DeliveryVehicle(licensePlate) ON DELETE CASCADE,
    FOREIGN KEY (deliver_date, time, address) REFERENCES AuctionSession_Operates(event_date, time, address) ON DELETE CASCADE
);

-- CollectsFrom
CREATE TABLE CollectsFrom (
    address VARCHAR(255),
    licensePlate CHAR(6),
    PRIMARY KEY (address, licensePlate),
    FOREIGN KEY (address) REFERENCES StorageFacility(address) ON DELETE CASCADE,
    FOREIGN KEY (licensePlate) REFERENCES DeliveryVehicle(licensePlate) ON DELETE CASCADE
);

-- Customers
CREATE TABLE Customers (
    creditCardNumber INT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    customerID INT NOT NULL
);

-- ForSaleItems_ListedAt_Wins
CREATE TABLE ForSaleItems_ListedAt_Wins (
    itemID INT PRIMARY KEY,
    listed_date DATE NOT NULL,
    time VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    creditCardNumber INT,
    startPrice INT,
    finalPrice INT,
    condition VARCHAR(255),
    FOREIGN KEY (listed_date, time, address) REFERENCES AuctionSession_Operates(event_date, time, address) ON DELETE CASCADE,
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- Attend
CREATE TABLE Attend (
    attend_date DATE,
    time VARCHAR(255),
    address VARCHAR(255),
    creditCardNumber INT,
    PRIMARY KEY (attend_date, time, address, creditCardNumber),
    FOREIGN KEY (attend_date, time, address) REFERENCES AuctionSession_Operates(event_date, time, address) ON DELETE CASCADE, 
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- Bidder
 CREATE TABLE Bidder (
    creditCardNumber INT,
    PRIMARY KEY (creditCardNumber),
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- Seller
CREATE TABLE Seller (
    creditCardNumber INT,
    PRIMARY KEY (creditCardNumber),
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- Items_Sells
CREATE TABLE Items_Sells (
    itemID INT PRIMARY KEY,
    category VARCHAR(255),
    startDate DATE,
    creditCardNumber INT NOT NULL,
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- InventoryItems_StoredAt
CREATE TABLE InventoryItems_StoredAt (
    itemID INT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (itemID) REFERENCES Items_Sells(itemID) ON DELETE CASCADE,
    FOREIGN KEY (address) REFERENCES StorageFacility(address) ON DELETE SET NULL
);

-- Bids_Receive_Places
CREATE TABLE Bids_Receive_Places (
    itemID INT,
    amount INT,
    bid_date DATE NOT NULL,
    timePlaced VARCHAR(255) NOT NULL,
    creditCardNumber INT NOT NULL,
    status VARCHAR(255),
    PRIMARY KEY (itemID, amount),
    FOREIGN KEY (itemID) REFERENCES Items_Sells(itemID) ON DELETE CASCADE,
    FOREIGN KEY (creditCardNumber) REFERENCES Customers(creditCardNumber) ON DELETE CASCADE
);

-- Appraises
CREATE TABLE Appraises (
    appraiserID INT,
    itemID INT,
    price INT,
    PRIMARY KEY (appraiserID, itemID),
    FOREIGN KEY (appraiserID) REFERENCES Appraiser(appraiserID) ON DELETE CASCADE,
    FOREIGN KEY (itemID) REFERENCES Items_Sells(itemID) ON DELETE CASCADE
);

-- DeliveryVehicle
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('ABC123', 'Ford Transit', 3500);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('DEF456', 'Mercedes Sprinter', 4000);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('GHI789', 'Ram ProMaster', 4200);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('JKL012', 'Chevrolet Express', 3000);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('MNO345', 'Ford Transit', 3500);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('PQR678', 'Mercedes Sprinter', 4000);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('STU901', 'Ford Transit', 3500);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('VWX234', 'Mercedes Sprinter', 4000);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('YZA567', 'Chevrolet Express', 3000);
INSERT INTO DeliveryVehicle (licensePlate, makeModel, payloadCapacity) VALUES ('BCD890', 'Ram ProMaster', 4200);

-- StorageFacility
INSERT INTO StorageFacility (address, facilityName, squareFT, rent) VALUES ('123 Main St', 'Main Street Storage', 10000, 7000);
INSERT INTO StorageFacility (address, facilityName, squareFT, rent) VALUES ('456 Oak Ave', 'Oak Avenue Self Storage', 20000, 13500);
INSERT INTO StorageFacility (address, facilityName, squareFT, rent) VALUES ('789 Pine Dr', 'Pine Drive Secure Storage', 40000, 27000);
INSERT INTO StorageFacility (address, facilityName, squareFT, rent) VALUES ('101 Maple Ln', 'Maple Lane Storage Solutions', 60000, 40000);
INSERT INTO StorageFacility (address, facilityName, squareFT, rent) VALUES ('202 Birch Blvd', 'Birch Boulevard Storage Center', 80000, 52000);

-- Appraiser
INSERT INTO Appraiser (appraiserID, appraiserName, areaOfExpertise, appraiserFee) VALUES (101, 'Tom Brown', 'Toys', 1800);
INSERT INTO Appraiser (appraiserID, appraiserName, areaOfExpertise, appraiserFee) VALUES (102, 'Jane Miller', 'Sports Memorabilia', 2200);
INSERT INTO Appraiser (appraiserID, appraiserName, areaOfExpertise, appraiserFee) VALUES (103, 'David Wilson', 'Fine Art', 5000);
INSERT INTO Appraiser (appraiserID, appraiserName, areaOfExpertise, appraiserFee) VALUES (104, 'Lisa Adams', 'Vintage Cars', 6000);
INSERT INTO Appraiser (appraiserID, appraiserName, areaOfExpertise, appraiserFee) VALUES (105, 'John Clark', 'Jewelry', 2500);

-- Auctioneer
INSERT INTO Auctioneer (employeeID, auctioneerName, startDate, hourlyWage) VALUES (201, 'Sarah Johnson', TO_DATE('2020-01-15', 'YYYY-MM-DD'), 30);
INSERT INTO Auctioneer (employeeID, auctioneerName, startDate, hourlyWage) VALUES (202, 'Michael Smith', TO_DATE('2021-05-22', 'YYYY-MM-DD'), 35);
INSERT INTO Auctioneer (employeeID, auctioneerName, startDate, hourlyWage) VALUES (203, 'Emily Davis', TO_DATE('2019-03-10', 'YYYY-MM-DD'), 28);
INSERT INTO Auctioneer (employeeID, auctioneerName, startDate, hourlyWage) VALUES (204, 'James Wilson', TO_DATE('2022-08-30', 'YYYY-MM-DD'), 40);
INSERT INTO Auctioneer (employeeID, auctioneerName, startDate, hourlyWage) VALUES (205, 'Linda Taylor', TO_DATE('2023-06-01', 'YYYY-MM-DD'), 32);

-- Customers
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (1234567812345678, 'Alice Johnson', 1);
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (2345678923456789, 'Bob Smith', 2);
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (3456789034567890, 'Catherine Brown', 3);
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (4567890145678901, 'David Wilson', 4);
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (5678901256789012, 'Emily Davis', 5);
INSERT INTO Customers (creditCardNumber, customerName, customerID) VALUES (1234567218345678, 'John Doe', 1);

-- Bidder
INSERT INTO Bidder (creditCardNumber) VALUES (1234567812345678);
INSERT INTO Bidder (creditCardNumber) VALUES (2345678923456789);
INSERT INTO Bidder (creditCardNumber) VALUES (3456789034567890);
INSERT INTO Bidder (creditCardNumber) VALUES (4567890145678901);
INSERT INTO Bidder (creditCardNumber) VALUES (5678901256789012);

-- Seller
INSERT INTO Seller (creditCardNumber) VALUES (1234567812345678);
INSERT INTO Seller (creditCardNumber) VALUES (2345678923456789);
INSERT INTO Seller (creditCardNumber) VALUES (3456789034567890);
INSERT INTO Seller (creditCardNumber) VALUES (4567890145678901);
INSERT INTO Seller (creditCardNumber) VALUES (5678901256789012);

-- AuctionSession_Operates
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-15', 'YYYY-MM-DD'), '14:00', '123 Auction St', 201, 25, 4, 7771234567, 10);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-15', 'YYYY-MM-DD'), '17:00', '123 Auction St', 201, 25, 4, 9991234567, 20);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-16', 'YYYY-MM-DD'), '15:00', '456 Bid Ave', 202, 40, 500, 5552345678, 15);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-17', 'YYYY-MM-DD'), '16:00', '789 Sale Rd', 203, 55, 150, 5553456789, 12);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-13', 'YYYY-MM-DD'), '16:00', '789 Sale Rd', 203, 55, 1, 5553456789, 12);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-11-13', 'YYYY-MM-DD'), '16:00', '789 Sale Rd', 203, 55, 9, 5553456789, 12);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 204, 30, 200, 5554567890, 8);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-11-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 204, 30, 200, 5554567890, 8);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-12-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 204, 30, 200, 3334567890, 8);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-12-28', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 204, 2, 200, 5554567890, 2);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-12-28', 'YYYY-MM-DD'), '16:00', '321 Sell Blvd', 204, 30, 200, 5554567890, 3);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-19', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 205, 60, 250, 5555678901, 5);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-20', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 205, 60, 250, 5555678901, 6);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-21', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 205, 60, 250, 5555678901, 7);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-22', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 205, 60, 250, 2222678901, 8);
INSERT INTO AuctionSession_Operates (event_date, time, address, employeeID, totalAttendees, numItems, phoneNumber, commissionPercent) VALUES (TO_DATE('2024-10-25', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 205, 60, 3, 1111678901, 8);

-- Items_Sells
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1001, 'Furniture', TO_DATE('2024-10-01', 'YYYY-MM-DD'), 1234567812345678);
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1002, 'Electronics', TO_DATE('2024-10-05', 'YYYY-MM-DD'), 2345678923456789);
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1003, 'Antiques', TO_DATE('2024-10-10', 'YYYY-MM-DD'), 3456789034567890);
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1004, 'Art', TO_DATE('2024-10-12', 'YYYY-MM-DD'), 4567890145678901);
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1005, 'Collectibles', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 5678901256789012);
INSERT INTO Items_Sells (itemID, category, startDate, creditCardNumber) VALUES (1006, 'Collectibles', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 5678901256789012);
-- InventoryItems_StoredAt
INSERT INTO InventoryItems_StoredAt (itemID, address) VALUES (1001, '123 Main St');
INSERT INTO InventoryItems_StoredAt (itemID, address) VALUES (1002, '456 Oak Ave');
INSERT INTO InventoryItems_StoredAt (itemID, address) VALUES (1003, '789 Pine Dr');
INSERT INTO InventoryItems_StoredAt (itemID, address) VALUES (1004, '101 Maple Ln');
INSERT INTO InventoryItems_StoredAt (itemID, address) VALUES (1005, '202 Birch Blvd');

-- ForSaleItems_ListedAt_Wins
INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, finalPrice, condition, startPrice) 
VALUES (1001, TO_DATE('2024-10-15', 'YYYY-MM-DD'), '14:00', '123 Auction St', 1234567812345678, 550, 'New', 500);

INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, finalPrice, condition, startPrice) 
VALUES (1002, TO_DATE('2024-10-16', 'YYYY-MM-DD'), '15:00', '456 Bid Ave', 2345678923456789, 350, 'Used', 300);

INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, finalPrice, condition, startPrice) 
VALUES (1003, TO_DATE('2024-10-17', 'YYYY-MM-DD'), '16:00', '789 Sale Rd', 3456789034567890, 220, 'Refurbished', 200);

INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, finalPrice, condition, startPrice) 
VALUES (1004, TO_DATE('2024-10-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 4567890145678901, 180, 'Damaged', 150);

INSERT INTO ForSaleItems_ListedAt_Wins (itemID, listed_date, time, address, creditCardNumber, finalPrice, condition, startPrice) 
VALUES (1005, TO_DATE('2024-10-19', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 5678901256789012, 450, 'Open Box', 400);

-- Bids_Receive_Places
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1001, 500, '10:30', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 1234567812345678, 'Open');
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1002, 300, '11:00', TO_DATE('2024-10-16', 'YYYY-MM-DD'), 2345678923456789, 'Closed');
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1003, 200, '11:30', TO_DATE('2024-10-17', 'YYYY-MM-DD'), 3456789034567890, 'Pending');
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1004, 150, '12:00', TO_DATE('2024-10-18', 'YYYY-MM-DD'), 4567890145678901, 'Open');
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1005, 400, '12:30', TO_DATE('2024-10-19', 'YYYY-MM-DD'), 5678901256789012, 'Closed');
INSERT INTO Bids_Receive_Places (itemID, amount, timePlaced, bid_date, creditCardNumber, status) VALUES (1001, 1000, '12:30', TO_DATE('2024-10-15', 'YYYY-MM-DD'), 1234567218345678, 'Open');

-- Attend
INSERT INTO Attend (attend_date, time, address, creditCardNumber)
VALUES (TO_DATE('2024-10-15', 'YYYY-MM-DD'), '14:00', '123 Auction St', 1234567812345678);
INSERT INTO Attend (attend_date, time, address, creditCardNumber)
VALUES (TO_DATE('2024-10-16', 'YYYY-MM-DD'), '15:00', '456 Bid Ave', 2345678923456789);
INSERT INTO Attend (attend_date, time, address, creditCardNumber)
VALUES (TO_DATE('2024-10-17', 'YYYY-MM-DD'), '16:00', '789 Sale Rd', 3456789034567890);
INSERT INTO Attend (attend_date, time, address, creditCardNumber)
VALUES (TO_DATE('2024-10-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd', 4567890145678901);
INSERT INTO Attend (attend_date, time, address, creditCardNumber)
VALUES (TO_DATE('2024-10-19', 'YYYY-MM-DD'), '18:00', '654 Offer Pl', 5678901256789012);

-- DeliversTo
INSERT INTO DeliversTo (licensePlate, deliver_date, time, address)
VALUES ('ABC123', TO_DATE('2024-10-15', 'YYYY-MM-DD'), '14:00', '123 Auction St');
INSERT INTO DeliversTo (licensePlate, deliver_date, time, address)
VALUES ('DEF456', TO_DATE('2024-10-16', 'YYYY-MM-DD'), '15:00', '456 Bid Ave');
INSERT INTO DeliversTo (licensePlate, deliver_date, time, address)
VALUES ('GHI789', TO_DATE('2024-10-17', 'YYYY-MM-DD'), '16:00', '789 Sale Rd');
INSERT INTO DeliversTo (licensePlate, deliver_date, time, address)
VALUES ('JKL012', TO_DATE('2024-10-18', 'YYYY-MM-DD'), '17:00', '321 Sell Blvd');
INSERT INTO DeliversTo (licensePlate, deliver_date, time, address)
VALUES ('MNO345', TO_DATE('2024-10-19', 'YYYY-MM-DD'), '18:00', '654 Offer Pl');

-- CollectsFrom
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('123 Main St', 'ABC123');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('202 Birch Blvd', 'ABC123');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('101 Maple Ln', 'ABC123');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('789 Pine Dr', 'ABC123');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('456 Oak Ave', 'ABC123');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('456 Oak Ave', 'DEF456');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('123 Main St', 'DEF456');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('202 Birch Blvd', 'DEF456');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('101 Maple Ln', 'DEF456');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('789 Pine Dr', 'DEF456');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('789 Pine Dr', 'GHI789');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('101 Maple Ln', 'JKL012');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('202 Birch Blvd', 'MNO345');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('123 Main St', 'MNO345');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('101 Maple Ln', 'MNO345');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('789 Pine Dr', 'MNO345');
INSERT INTO CollectsFrom (address, licensePlate) VALUES ('456 Oak Ave', 'MNO345');

-- Appraises
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (101, 1001, 485);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (102, 1002, 315);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (103, 1003, 210);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (101, 1004, 170);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (102, 1005, 430);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (102, 1003, 430);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (103, 1005, 430);
INSERT INTO Appraises (appraiserID, itemID, price) VALUES (103, 1004, 430);
