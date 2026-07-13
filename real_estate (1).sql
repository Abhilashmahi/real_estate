-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2026 at 11:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `real_estate`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `name`, `createdAt`) VALUES
(1, 'admin@example.com', '$2a$10$p8p4uewnldqeAUelEIvEBuKpmNqZatuynIJRfR6YNDAQxeop3C0Vq', 'Vishnu Realtor Admin', '2026-07-12 19:41:17.763');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `mobile` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `fullName`, `mobile`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'John Customer', '9876543210', 'customer@example.com', '$2a$10$KCLJGuisSlE//JeJbKd.WeR6skKMhUScBpRJx36cA1leV/iZjmyo2', '2026-07-12 19:41:17.994', '2026-07-12 19:41:17.994'),
(2, 'Test User', '9999999999', 'testunique9999@example.com', '$2a$10$WwQ2Z7zsEJiGgWipeow.n.kb5HuBvg7PfAD.NyLV5TNkn2xNHlQ6u', '2026-07-12 20:03:48.262', '2026-07-12 20:03:48.262'),
(3, 'abhilash', '9361634189', 'abikavirahul1234@gmail.com', '$2a$10$vsM9rUuFVumdLdjwFGOqDOyRuePeod5KExp0NTEuU2wEmjlyiLUxS', '2026-07-12 20:05:18.450', '2026-07-12 20:05:18.450'),
(4, 'Abhilash G 01', '9361634180', 'abikavirahul123w4@gmail.com', '$2a$10$o4aV2MFDOpg/ceI0Jb5BXe6faUs9h0y2FW4hmIAQJBRi4QgB8nnxO', '2026-07-12 22:38:43.793', '2026-07-12 22:38:43.793'),
(5, 'rahul', '9698291713', 'ggrahulrahul@gmail.com', '$2a$10$8/wjHyxerb4pTaoiGIOYR.AeY1P9mm956WnJOj5ckt3sdL7XMDyi6', '2026-07-13 04:29:59.515', '2026-07-13 04:29:59.515'),
(6, 'kavitha', '9361634190', 'abikavirahul16234@gmail.com', '$2a$10$AQ0X87DlQSOmsQru2MgQre.FmWvlOt0vnlKlsf6VC.zEco5y13eba', '2026-07-13 06:06:07.030', '2026-07-13 06:06:07.030'),
(7, 'vishnu', '9352525551', 'vishnu@gmail.com', '$2a$10$dP57YVKoSIs3lJEWMt77vu95qgSO0zVM6fhbn.qhf49jeOy108nLG', '2026-07-13 08:08:31.400', '2026-07-13 08:08:31.400');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `propertyId` int(11) DEFAULT NULL,
  `propertyName` varchar(191) NOT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'New',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `customerId`, `name`, `email`, `phone`, `propertyId`, `propertyName`, `notes`, `status`, `createdAt`) VALUES
(1, 5, '', 'ggrahulrahul@gmail.com', '', 7, 'coucunt villa', 'yes intersted', 'Follow-up', '2026-07-13 04:35:13.347'),
(2, 6, 'kavitha', 'abikavirahul16234@gmail.com', '9361634190', 2, 'Smart City Apartment', 'yes', 'Follow-up', '2026-07-13 06:06:50.282'),
(3, 7, 'vishnu', 'vishnu@gmail.com', '9352525551', 2, 'Smart City Apartment', 'test', 'Closed', '2026-07-13 08:09:54.411');

-- --------------------------------------------------------

--
-- Table structure for table `followups`
--

CREATE TABLE `followups` (
  `id` int(11) NOT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `customerId` int(11) DEFAULT NULL,
  `enquiryId` int(11) DEFAULT NULL,
  `followupDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `nextFollowupDate` varchar(191) DEFAULT NULL,
  `propertyId` int(11) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `followups`
--

INSERT INTO `followups` (`id`, `notes`, `completed`, `createdAt`, `customerId`, `enquiryId`, `followupDate`, `nextFollowupDate`, `propertyId`, `status`) VALUES
(1, 'yes', 0, '2026-07-13 06:27:59.778', 6, 2, '2026-07-13 06:27:59.778', NULL, 2, 'Pending'),
(2, 'yes intersted', 0, '2026-07-13 07:01:52.853', 5, 1, '2026-07-13 07:01:52.853', NULL, 7, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Available',
  `location` varchar(191) NOT NULL,
  `price` varchar(191) NOT NULL,
  `size` varchar(191) NOT NULL,
  `beds` int(11) NOT NULL DEFAULT 0,
  `baths` int(11) NOT NULL DEFAULT 0,
  `mapLink` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title`, `description`, `type`, `status`, `location`, `price`, `size`, `beds`, `baths`, `mapLink`, `createdAt`) VALUES
(2, 'Smart City Apartment', 'Modern 2BHK apartment in the heart of Coimbatore. Perfect for working professionals, offering 24/7 security, power backup, and close proximity to key IT parks.', 'Apartment', 'Available', 'Coimbatore', '45', '1200', 2, 2, 'https://maps.google.com/?q=11.0168,76.9558', '2026-07-12 19:41:18.016'),
(3, 'Royal Square Plot', 'Premium villa plot for sale in prime location. Ready for immediate construction with clear documentation, wide roads, and gated community security.', 'Plot', 'Available', 'Coimbatore', '18', '1500', 0, 0, 'https://maps.google.com/?q=11.0168,76.9558', '2026-07-12 19:41:18.035'),
(4, 'Elite Land Investment', 'Huge fertile land ideal for organic farming or future layout development. Scenic views and high investment appreciation potential.', 'Land', 'Available', 'Ooty', '35', '3000', 0, 0, 'https://maps.google.com/?q=11.4102,76.6950', '2026-07-12 19:41:18.048'),
(5, 'Hill View House', 'Beautiful independent residential house in peaceful hill surroundings of Ooty. Features broad windows overlooking mountain valleys.', 'House', 'Available', 'Ooty', '80', '1800', 3, 2, 'https://maps.google.com/?q=11.4102,76.6950', '2026-07-12 19:41:18.059'),
(6, 'land', NULL, 'Villa', 'Available', 'pollachi', '78', '1222', 0, 0, NULL, '2026-07-12 20:28:20.367'),
(7, 'coucunt villa', NULL, 'Villa', 'Available', 'pollachi', '75', '800000', 0, 0, NULL, '2026-07-13 04:34:26.339'),
(8, 'chennai style villa', 'rahul owner', 'Villa', 'Available', 'pollachi', '99', '5000', 0, 0, NULL, '2026-07-13 07:51:01.697'),
(9, 'test', '', 'Villa', 'Available', 'pollachi', '99', '12', 5, 2, '', '2026-07-13 07:58:12.246'),
(10, 'coucunt villa', NULL, 'Villa', 'Available', 'pollachi', '99', '12000', 1, 7, NULL, '2026-07-13 08:05:37.004'),
(11, 'unjavelampatti', 'apartment', 'Apartment', 'Available', 'pollachi', '160', '2100', 4, 2, NULL, '2026-07-13 08:14:57.420');

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `url` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `propertyId`, `url`) VALUES
(3, 2, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60'),
(4, 2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60'),
(5, 3, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'),
(6, 4, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=60'),
(7, 5, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60'),
(8, 5, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60'),
(10, 9, 'http://localhost:5000/uploads/1783929456350-820631780.jpg'),
(11, 9, 'http://localhost:5000/uploads/1783929563090-978291506.jpg'),
(12, 10, 'uploads/1783929931623-19106633.jpg'),
(13, 11, 'uploads/1783930495860-164549949.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `site_visits`
--

CREATE TABLE `site_visits` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `visitDate` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_visits`
--

INSERT INTO `site_visits` (`id`, `customerId`, `propertyId`, `visitDate`, `status`, `createdAt`) VALUES
(1, 5, 2, '2026-07-12', 'Confirmed', '2026-07-13 04:31:34.156'),
(2, 5, 7, '2026-07-12', 'Confirmed', '2026-07-13 04:35:25.176'),
(3, 6, 2, '2026-07-12', 'Confirmed', '2026-07-13 06:06:43.424'),
(4, 7, 2, '2026-07-14', 'Pending', '2026-07-13 08:10:07.788');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `customerId`, `propertyId`, `createdAt`) VALUES
(2, 5, 2, '2026-07-13 04:31:11.652'),
(3, 5, 3, '2026-07-13 04:31:13.226'),
(5, 7, 2, '2026-07-13 08:09:17.830'),
(6, 7, 3, '2026-07-13 08:09:19.154'),
(7, 7, 4, '2026-07-13 08:09:20.679');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_key` (`email`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_email_key` (`email`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enquiries_customerId_fkey` (`customerId`),
  ADD KEY `enquiries_propertyId_fkey` (`propertyId`);

--
-- Indexes for table `followups`
--
ALTER TABLE `followups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `followups_enquiryId_key` (`enquiryId`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_images_propertyId_fkey` (`propertyId`);

--
-- Indexes for table `site_visits`
--
ALTER TABLE `site_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `site_visits_customerId_fkey` (`customerId`),
  ADD KEY `site_visits_propertyId_fkey` (`propertyId`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlist_customerId_propertyId_key` (`customerId`,`propertyId`),
  ADD KEY `wishlist_propertyId_fkey` (`propertyId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `followups`
--
ALTER TABLE `followups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `site_visits`
--
ALTER TABLE `site_visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `enquiries_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enquiries_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `followups`
--
ALTER TABLE `followups`
  ADD CONSTRAINT `followups_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `enquiries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `site_visits`
--
ALTER TABLE `site_visits`
  ADD CONSTRAINT `site_visits_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `site_visits_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
