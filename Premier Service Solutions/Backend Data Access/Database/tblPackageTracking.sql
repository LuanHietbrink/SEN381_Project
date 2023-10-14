-- Active: 1696838194376@@127.0.0.1@3306@premier_service_solutions
INSERT INTO PackageTracking (PackageID, PackageName, Price, ServiceContractCount) 
VALUES 
(1, 'Standard', 3377.31, 0),
(2, 'Business', 6900.54, 0),
(3, 'Premium', 6581.94, 0),
-- Assuming a 10% discount for "Business Promo" and 15% discount for "Premium Promo"
(4, 'Business Promo', 6210.49, 0),
(5, 'Premium Promo', 5594.65, 0);