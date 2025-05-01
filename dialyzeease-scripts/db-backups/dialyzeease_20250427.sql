-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2025 at 07:05 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dialyzeease`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `schedule_session_id` int(11) DEFAULT NULL,
  `bed_id` int(11) DEFAULT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled','no-show') DEFAULT 'scheduled',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `schedule_session_id`, `bed_id`, `patient_id`, `staff_id`, `doctor_id`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 1006, NULL, NULL, 'Dr. Harshani will monitor the session', 'scheduled', '2025-04-15 23:59:58', '2025-04-16 00:22:53'),
(2, 14, 6, 1006, NULL, NULL, 'Dr. Harshani Fernando monitoring the session.', 'scheduled', '2025-04-16 00:25:10', NULL),
(3, 15, 1, 1006, NULL, NULL, 'Dr. will be monitoring', 'scheduled', '2025-04-16 16:06:32', NULL),
(4, 18, 19, 1020, NULL, NULL, 'Note', 'scheduled', '2025-04-23 09:09:19', '2025-04-23 09:10:33'),
(5, 26, 38, 1006, NULL, NULL, 'Dr. A.L.M. Nazar\nNephrologist ', 'scheduled', '2025-04-27 17:15:47', '2025-04-27 17:21:20');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `table_name` varchar(128) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `action` enum('create','update','delete') DEFAULT NULL,
  `changed_by_id` int(11) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `table_name`, `record_id`, `action`, `changed_by_id`, `old_data`, `new_data`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 'appointments', 1, 'create', NULL, NULL, '{\"id\":1,\"scheduleSessionId\":\"4\",\"patientId\":1006,\"bedId\":1,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"scheduled\",\"centerName\":\"Asiri Surgical\",\"date\":\"2025-04-18\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:00:02'),
(2, 'appointments', 1, 'update', NULL, '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"scheduled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":null,\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"cancelled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:34:42.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:04:42'),
(3, 'appointments', 1, 'update', NULL, '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"cancelled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:34:42.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"scheduled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:37:57.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:07:57'),
(4, 'appointments', 1, 'update', NULL, '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"scheduled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:37:57.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"cancelled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:52:09.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:22:09'),
(5, 'appointments', 1, 'update', NULL, '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"cancelled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:52:09.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":1,\"schedule_session_id\":4,\"bed_id\":1,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. Harshani will monitor the session\",\"status\":\"scheduled\",\"created_at\":\"2025-04-15T18:29:58.000Z\",\"updated_at\":\"2025-04-15T18:52:53.000Z\",\"date\":\"2025-04-17T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"07:00:00\",\"centerId\":3,\"centerName\":\"Asiri Surgical\",\"bedCode\":\"A1-BED-01\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:22:53'),
(6, 'appointments', 2, 'create', NULL, NULL, '{\"id\":2,\"scheduleSessionId\":\"14\",\"patientId\":1006,\"bedId\":6,\"notes\":\"Dr. Harshani Fernando monitoring the session.\",\"status\":\"scheduled\",\"centerName\":\"Asiri Surgical\",\"date\":\"2025-05-01\",\"startTime\":\"21:00:00\",\"endTime\":\"22:00:00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 00:25:13'),
(8, 'appointments', 3, 'create', NULL, NULL, '{\"id\":3,\"scheduleSessionId\":\"15\",\"patientId\":1006,\"bedId\":1,\"notes\":\"Dr. will be monitoring\",\"status\":\"scheduled\",\"centerName\":\"Asiri Surgical\",\"date\":\"2025-04-30\",\"startTime\":\"21:00:00\",\"endTime\":\"22:00:00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-16 16:06:35'),
(9, 'appointments', 4, 'create', NULL, NULL, '{\"id\":4,\"scheduleSessionId\":\"18\",\"patientId\":1020,\"bedId\":19,\"notes\":\"Note\",\"status\":\"scheduled\",\"centerName\":\"The National Institute For Nephrology Dialysis & Transplantation\",\"date\":\"2025-04-24\",\"startTime\":\"08:00:00\",\"endTime\":\"09:00:00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-23 09:09:22'),
(10, 'appointments', 4, 'update', NULL, '{\"id\":4,\"schedule_session_id\":18,\"bed_id\":19,\"patient_id\":1020,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Note\",\"status\":\"scheduled\",\"created_at\":\"2025-04-23T03:39:19.000Z\",\"updated_at\":null,\"date\":\"2025-04-23T18:30:00.000Z\",\"startTime\":\"08:00:00\",\"endTime\":\"09:00:00\",\"centerId\":1,\"centerName\":\"The National Institute For Nephrology Dialysis & Transplantation\",\"bedCode\":\"B1-BED-04\",\"patientName\":\"Suwan Ratnayake\"}', '{\"id\":4,\"schedule_session_id\":18,\"bed_id\":19,\"patient_id\":1020,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Note\",\"status\":\"cancelled\",\"created_at\":\"2025-04-23T03:39:19.000Z\",\"updated_at\":\"2025-04-23T03:40:11.000Z\",\"date\":\"2025-04-23T18:30:00.000Z\",\"startTime\":\"08:00:00\",\"endTime\":\"09:00:00\",\"centerId\":1,\"centerName\":\"The National Institute For Nephrology Dialysis & Transplantation\",\"bedCode\":\"B1-BED-04\",\"patientName\":\"Suwan Ratnayake\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-23 09:10:11'),
(11, 'appointments', 4, 'update', NULL, '{\"id\":4,\"schedule_session_id\":18,\"bed_id\":19,\"patient_id\":1020,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Note\",\"status\":\"cancelled\",\"created_at\":\"2025-04-23T03:39:19.000Z\",\"updated_at\":\"2025-04-23T03:40:11.000Z\",\"date\":\"2025-04-23T18:30:00.000Z\",\"startTime\":\"08:00:00\",\"endTime\":\"09:00:00\",\"centerId\":1,\"centerName\":\"The National Institute For Nephrology Dialysis & Transplantation\",\"bedCode\":\"B1-BED-04\",\"patientName\":\"Suwan Ratnayake\"}', '{\"id\":4,\"schedule_session_id\":18,\"bed_id\":19,\"patient_id\":1020,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Note\",\"status\":\"scheduled\",\"created_at\":\"2025-04-23T03:39:19.000Z\",\"updated_at\":\"2025-04-23T03:40:33.000Z\",\"date\":\"2025-04-23T18:30:00.000Z\",\"startTime\":\"08:00:00\",\"endTime\":\"09:00:00\",\"centerId\":1,\"centerName\":\"The National Institute For Nephrology Dialysis & Transplantation\",\"bedCode\":\"B1-BED-04\",\"patientName\":\"Suwan Ratnayake\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-23 09:10:33'),
(12, 'appointments', 5, 'create', NULL, NULL, '{\"id\":5,\"scheduleSessionId\":\"26\",\"patientId\":1006,\"bedId\":38,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"scheduled\",\"centerName\":\"Asiri Central Hospital\",\"date\":\"2025-05-02\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-27 17:15:51'),
(13, 'appointments', 5, 'update', NULL, '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"scheduled\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":null,\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"no-show\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:49:56.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-27 17:19:56'),
(14, 'appointments', 5, 'update', NULL, '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"no-show\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:49:56.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"no-show\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:50:10.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-27 17:20:10'),
(15, 'appointments', 5, 'update', NULL, '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"scheduled\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:50:45.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"cancelled\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:51:01.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-27 17:21:01'),
(16, 'appointments', 5, 'update', NULL, '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"cancelled\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:51:01.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '{\"id\":5,\"schedule_session_id\":26,\"bed_id\":38,\"patient_id\":1006,\"staff_id\":null,\"doctor_id\":null,\"notes\":\"Dr. A.L.M. Nazar\\nNephrologist \",\"status\":\"scheduled\",\"created_at\":\"2025-04-27T11:45:47.000Z\",\"updated_at\":\"2025-04-27T11:51:20.000Z\",\"date\":\"2025-05-01T18:30:00.000Z\",\"startTime\":\"06:00:00\",\"endTime\":\"08:00:00\",\"centerId\":8,\"centerName\":\"Asiri Central Hospital\",\"bedCode\":\"A1-BED-04\",\"patientName\":\"Yohan Hirimuthugoda\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0', '2025-04-27 17:21:20');

-- --------------------------------------------------------

--
-- Table structure for table `beds`
--

CREATE TABLE `beds` (
  `id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `code` varchar(32) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `beds`
--

INSERT INTO `beds` (`id`, `center_id`, `code`, `status`) VALUES
(1, 3, 'A1-BED-01', 'active'),
(2, 3, 'A1-BED-02', 'active'),
(3, 3, 'A1-BED-03', 'active'),
(4, 3, 'A1-BED-04', 'active'),
(5, 3, 'A1-BED-07', 'active'),
(6, 3, 'A1-BED-06', 'active'),
(7, 3, 'A1-BED-05', 'inactive'),
(8, 3, 'A1-BED-08', 'active'),
(9, 3, 'A1-BED-09', 'active'),
(10, 3, 'A1-BED-10', 'inactive'),
(11, 1, 'B1-BED-01', 'active'),
(12, 1, 'B1-BED-07', 'active'),
(13, 1, 'B1-BED-08', 'active'),
(14, 1, 'B1-BED-09', 'active'),
(15, 1, 'B1-BED-02', 'active'),
(16, 1, 'B1-BED-03', 'active'),
(17, 1, 'B1-BED-10', 'inactive'),
(18, 1, 'B1-BED-05', 'inactive'),
(19, 1, 'B1-BED-04', 'active'),
(20, 1, 'B1-BED-06', 'active'),
(21, 8, 'A1-BED-01', 'active'),
(22, 8, 'A1-BED-12', 'active'),
(23, 8, 'A1-BED-13', 'active'),
(24, 8, 'A1-BED-17', 'active'),
(25, 8, 'A1-BED-14', 'active'),
(26, 8, 'A1-BED-18', 'active'),
(27, 8, 'A1-BED-16', 'active'),
(28, 8, 'A1-BED-22', 'active'),
(29, 8, 'A1-BED-20', 'active'),
(30, 8, 'A1-BED-15', 'active'),
(31, 8, 'A1-BED-25', 'active'),
(32, 8, 'A1-BED-21', 'active'),
(33, 8, 'A1-BED-24', 'active'),
(34, 8, 'A1-BED-23', 'active'),
(35, 8, 'A1-BED-19', 'active'),
(36, 8, 'A1-BED-02', 'active'),
(37, 8, 'A1-BED-03', 'active'),
(38, 8, 'A1-BED-04', 'active'),
(39, 8, 'A1-BED-05', 'active'),
(40, 8, 'A1-BED-06', 'active'),
(41, 8, 'A1-BED-07', 'active'),
(42, 8, 'A1-BED-08', 'active'),
(43, 8, 'A1-BED-09', 'active'),
(44, 8, 'A1-BED-10', 'active'),
(45, 8, 'A1-BED-11', 'active'),
(46, 8, 'A2-BED-01', 'active'),
(47, 8, 'A2-BED-05', 'active'),
(48, 8, 'A2-BED-04', 'active'),
(49, 8, 'A2-BED-02', 'active'),
(50, 8, 'A2-BED-06', 'active'),
(51, 8, 'A2-BED-07', 'active'),
(52, 8, 'A2-BED-08', 'active'),
(53, 8, 'A2-BED-09', 'active'),
(54, 8, 'A2-BED-10', 'active'),
(55, 8, 'A2-BED-11', 'active'),
(56, 8, 'A2-BED-25', 'active'),
(57, 8, 'A2-BED-03', 'active'),
(58, 8, 'A2-BED-24', 'active'),
(59, 8, 'A2-BED-12', 'active'),
(60, 8, 'A2-BED-23', 'active'),
(61, 8, 'A2-BED-13', 'active'),
(62, 8, 'A2-BED-22', 'active'),
(63, 8, 'A2-BED-14', 'active'),
(64, 8, 'A2-BED-21', 'active'),
(65, 8, 'A2-BED-15', 'active'),
(66, 8, 'A2-BED-20', 'active'),
(67, 8, 'A2-BED-16', 'active'),
(68, 8, 'A2-BED-19', 'active'),
(69, 8, 'A2-BED-17', 'active'),
(70, 8, 'A2-BED-18', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `centers`
--

CREATE TABLE `centers` (
  `id` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_no` varchar(16) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `total_capacity` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_deleted` tinyint(1) DEFAULT 0,
  `manage_by_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `centers`
--

INSERT INTO `centers` (`id`, `name`, `address`, `contact_no`, `email`, `total_capacity`, `is_active`, `is_deleted`, `manage_by_id`) VALUES
(1, 'The National Institute For Nephrology Dialysis & Transplantation', 'Colombo 01000', '0112422335', 'national.center@dialysis.org', 40, 1, 0, 1003),
(2, 'Nawaloka Hospital', 'Colombo 00200', '0115777777', 'nawaloka@dialysis.org', 35, 1, 0, 1003),
(3, 'Asiri Surgical Hospital', 'Colombo 00500', '0114524400', 'surgical@hospital.asiri.org', 40, 1, 0, 1003),
(4, 'Kings Hospital', 'Colombo 00500', '0117743743', 'colombo@hospital.kings.org', 25, 1, 0, 1003),
(5, 'Lanka Hospital', 'Colombo 00500', '0115430000', 'colombo@hospital.lanka.org', 30, 1, 0, 1003),
(6, 'Hemas Hospital', 'Wattala 11300', '0117888888', 'wattala@hospital.hemas.org', 25, 1, 0, 1003),
(7, 'Hemas Hospital', 'Thalawathugoda 10116', '0114731731', 'thalawathugoda@hospital.hemas.org', 25, 1, 0, 1003),
(8, 'Asiri Central Hospital', 'Colombo 01000', '0114665500', 'central@hospital.asiri.org', 50, 1, 0, 1003);

-- --------------------------------------------------------

--
-- Table structure for table `center_hours`
--

CREATE TABLE `center_hours` (
  `id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `weekday` enum('mon','tue','wed','thu','fri','sat','sun') DEFAULT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `center_hours`
--

INSERT INTO `center_hours` (`id`, `center_id`, `weekday`, `open_time`, `close_time`) VALUES
(155, 6, 'mon', '06:00:00', '18:00:00'),
(156, 6, 'tue', '06:00:00', '18:00:00'),
(157, 6, 'wed', '06:00:00', '18:00:00'),
(158, 6, 'fri', '06:00:00', '18:00:00'),
(159, 6, 'thu', '06:00:00', '18:00:00'),
(160, 6, 'sat', '06:00:00', '18:00:00'),
(161, 6, 'sun', NULL, NULL),
(162, 7, 'mon', '06:00:00', '18:00:00'),
(163, 7, 'tue', '06:00:00', '18:00:00'),
(164, 7, 'wed', '06:00:00', '18:00:00'),
(165, 7, 'thu', '06:00:00', '18:00:00'),
(166, 7, 'fri', '06:00:00', '18:00:00'),
(167, 7, 'sat', '06:00:00', '18:00:00'),
(168, 7, 'sun', NULL, NULL),
(169, 3, 'mon', '06:00:00', '22:00:00'),
(170, 3, 'tue', '06:00:00', '20:00:00'),
(171, 3, 'wed', '06:00:00', '22:00:00'),
(172, 3, 'thu', '06:00:00', '20:00:00'),
(173, 3, 'fri', '06:00:00', '22:00:00'),
(174, 3, 'sat', '06:00:00', '18:00:00'),
(175, 3, 'sun', NULL, NULL),
(176, 8, 'mon', '06:00:00', '22:00:00'),
(177, 8, 'tue', '06:00:00', '22:00:00'),
(178, 8, 'wed', '06:00:00', '22:00:00'),
(179, 8, 'thu', '06:00:00', '22:00:00'),
(180, 8, 'sat', '06:00:00', '20:00:00'),
(181, 8, 'fri', '06:00:00', '22:00:00'),
(182, 8, 'sun', '06:00:00', '18:00:00'),
(183, 4, 'mon', '06:00:00', '20:00:00'),
(184, 4, 'tue', '06:00:00', '20:00:00'),
(185, 4, 'wed', '06:00:00', '20:00:00'),
(186, 4, 'thu', '06:00:00', '20:00:00'),
(187, 4, 'fri', '06:00:00', '20:00:00'),
(188, 4, 'sat', '06:00:00', '18:00:00'),
(189, 4, 'sun', NULL, NULL),
(190, 5, 'mon', '06:00:00', '22:00:00'),
(191, 5, 'tue', '06:00:00', '22:00:00'),
(192, 5, 'wed', '06:00:00', '22:00:00'),
(193, 5, 'thu', '06:00:00', '22:00:00'),
(194, 5, 'fri', '06:00:00', '22:00:00'),
(195, 5, 'sat', '06:00:00', '18:00:00'),
(196, 5, 'sun', NULL, NULL),
(197, 2, 'mon', '06:00:00', '20:00:00'),
(198, 2, 'tue', '06:00:00', '20:00:00'),
(199, 2, 'thu', '06:00:00', '20:00:00'),
(200, 2, 'wed', '06:00:00', '20:00:00'),
(201, 2, 'sat', '06:00:00', '18:00:00'),
(202, 2, 'sun', NULL, NULL),
(203, 2, 'fri', '06:00:00', '20:00:00'),
(204, 1, 'mon', '00:00:00', '22:00:00'),
(205, 1, 'tue', '00:00:00', '22:00:00'),
(206, 1, 'fri', '00:00:00', '22:00:00'),
(207, 1, 'thu', '00:00:00', '22:00:00'),
(208, 1, 'wed', '00:00:00', '22:00:00'),
(209, 1, 'sun', '06:00:00', '20:00:00'),
(210, 1, 'sat', '06:00:00', '22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `center_users`
--

CREATE TABLE `center_users` (
  `id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `assigned_role` enum('admin','staff','doctor') DEFAULT NULL,
  `assigned_at` datetime DEFAULT current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ckd_records`
--

CREATE TABLE `ckd_records` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `egfr_value` float DEFAULT NULL,
  `creatinine_value` float DEFAULT NULL,
  `ckd_stage` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `recorded_by_id` int(11) DEFAULT NULL,
  `recorded_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ckd_stages`
--

CREATE TABLE `ckd_stages` (
  `id` int(11) NOT NULL,
  `stage_number` int(11) DEFAULT NULL,
  `min_egfr` float DEFAULT NULL,
  `max_egfr` float DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dialysis_histories`
--

CREATE TABLE `dialysis_histories` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `treatment_summary` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `emergency_contact_no` varchar(16) DEFAULT NULL,
  `specialization` varchar(128) DEFAULT NULL,
  `medical_license_no` varchar(128) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `blood_group` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `emergency_contact_no`, `specialization`, `medical_license_no`, `address`, `dob`, `gender`, `blood_group`) VALUES
(1, 1005, '94-11-227-8850', 'Nephrology, Cardiology', NULL, '123, Central Rd, Colombo, WP, 01000, Sri Lanka', NULL, 'female', NULL),
(2, 1028, '0117278832', 'Nephrologist', NULL, 'Colombo 00500', NULL, 'male', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `education_materials`
--

CREATE TABLE `education_materials` (
  `id` int(11) NOT NULL,
  `ckd_stage` int(11) DEFAULT NULL,
  `lang_code` varchar(8) DEFAULT 'en',
  `type` enum('diet','lifestyle','general') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education_materials`
--

INSERT INTO `education_materials` (`id`, `ckd_stage`, `lang_code`, `type`, `title`, `content`) VALUES
(1, 2, 'es', 'general', 'Understanding Stage 5 CKD and Preparing for Treatment', 'Stage 5 CKD, also known as kidney failure, means your kidneys have lost nearly all their ability to function effectively. Treatment options include dialysis or kidney transplant.\n\nIt\'s important to work closely with your healthcare team to decide the best treatment plan. You may need to start dialysis soon to remove waste and excess fluids from your blood.\n\nEarly planning for dialysis access (like a fistula or catheter) or transplant evaluation is crucial.\n\nEmotional support from counselors, family, and CKD support groups can help you adjust during this time.');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `recipient_role` enum('admin','staff','patient','doctor') DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` enum('email','sms','app') DEFAULT NULL,
  `status` enum('pending','sent','failed','read') DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `recipient_id`, `recipient_role`, `title`, `message`, `type`, `status`, `sent_at`) VALUES
(1, 1006, 'patient', 'Dialysis Appointment Confirmation', 'Appointment confirmed at Asiri Surgical on 2025-04-18 from 06:00:00 to 07:00:00', 'email', 'sent', '2025-04-16 00:00:02'),
(2, 1006, 'patient', 'Appointment Cancelled', 'Your appointment at Asiri Surgical on Fri Apr 18 2025 00:00:00 GMT+0530 (India Standard Time) has been cancelled', 'email', 'sent', '2025-04-16 00:04:42'),
(3, 1006, 'patient', 'Appointment Scheduled', 'Your appointment at Asiri Surgical on Fri Apr 18 2025 00:00:00 GMT+0530 (India Standard Time) has been scheduled', 'email', 'sent', '2025-04-16 00:07:57'),
(4, 1006, 'patient', 'Appointment Cancelled', 'Your appointment at Asiri Surgical on Fri Apr 18 2025 00:00:00 GMT+0530 (India Standard Time) has been cancelled', 'email', 'sent', '2025-04-16 00:22:12'),
(5, 1006, 'patient', 'Appointment Scheduled', 'Your appointment at Asiri Surgical on Fri Apr 18 2025 00:00:00 GMT+0530 (India Standard Time) has been scheduled', 'email', 'sent', '2025-04-16 00:22:56'),
(6, 1006, 'patient', 'Dialysis Appointment Confirmation', 'Appointment confirmed at Asiri Surgical on 2025-05-01 from 21:00:00 to 22:00:00', 'email', 'sent', '2025-04-16 00:25:13'),
(7, 1006, 'patient', 'Dialysis Appointment Confirmation', 'Appointment confirmed at Asiri Surgical on 2025-04-30 from 21:00:00 to 22:00:00', 'email', 'sent', '2025-04-16 16:06:35'),
(8, 1020, 'patient', 'Dialysis Appointment Confirmation', 'Appointment confirmed at The National Institute For Nephrology Dialysis & Transplantation on 2025-04-24 from 08:00:00 to 09:00:00', 'email', 'sent', '2025-04-23 09:09:22'),
(9, 1020, 'patient', 'Appointment Cancelled', 'Your appointment at The National Institute For Nephrology Dialysis & Transplantation on Thu Apr 24 2025 00:00:00 GMT+0530 (India Standard Time) has been cancelled', 'email', 'sent', '2025-04-23 09:10:14'),
(10, 1020, 'patient', 'Appointment Scheduled', 'Your appointment at The National Institute For Nephrology Dialysis & Transplantation on Thu Apr 24 2025 00:00:00 GMT+0530 (India Standard Time) has been scheduled', 'email', 'sent', '2025-04-23 09:10:36'),
(11, 1006, 'patient', 'Dialysis Appointment Confirmation', 'Appointment confirmed at Asiri Central Hospital on 2025-05-02 from 06:00:00 to 08:00:00', 'email', 'sent', '2025-04-27 17:15:51'),
(12, 1006, 'patient', 'Appointment Cancelled', 'Your appointment at Asiri Central Hospital on Fri May 02 2025 00:00:00 GMT+0530 (India Standard Time) has been cancelled', 'email', 'sent', '2025-04-27 17:21:04'),
(13, 1006, 'patient', 'Appointment Scheduled', 'Your appointment at Asiri Central Hospital on Fri May 02 2025 00:00:00 GMT+0530 (India Standard Time) has been scheduled', 'email', 'sent', '2025-04-27 17:21:24');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `blood_group` varchar(16) DEFAULT NULL,
  `height` varchar(16) DEFAULT NULL,
  `weight` varchar(16) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `chronic_conditions` text DEFAULT NULL,
  `emergency_contact_no` varchar(16) DEFAULT NULL,
  `emergency_contact_name` varchar(128) DEFAULT NULL,
  `emergency_contact_relation` varchar(64) DEFAULT NULL,
  `insurance_provider` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `address`, `dob`, `gender`, `blood_group`, `height`, `weight`, `allergies`, `chronic_conditions`, `emergency_contact_no`, `emergency_contact_name`, `emergency_contact_relation`, `insurance_provider`) VALUES
(1, 1006, '123, Torrington Av, Colombo, WP 00500, Sri Lanka', '1972-02-19', 'female', 'O+', NULL, NULL, 'Sulfa Drugs\nAspirin', 'Lupus Nephritis\nPolycystic Kidney Disease', '+94-11-227-8840', 'B P Kahawatta (Father)', NULL, 'Sri Lanka Insurance'),
(19, 1026, '', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1000, 'admin'),
(1002, 'doctor'),
(1003, 'patient'),
(1001, 'staff');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_sessions`
--

CREATE TABLE `schedule_sessions` (
  `id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `session_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `available_beds` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('scheduled','in-progress','completed','cancelled') DEFAULT 'scheduled',
  `created_by_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_sessions`
--

INSERT INTO `schedule_sessions` (`id`, `center_id`, `session_id`, `session_date`, `start_time`, `end_time`, `available_beds`, `notes`, `status`, `created_by_id`, `created_at`) VALUES
(1, 3, 1, '2025-04-21', '06:00:00', '07:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:23:22'),
(2, 3, 2, '2025-04-16', '06:00:00', '07:00:00', 8, '', 'scheduled', 1000, '2025-04-15 17:23:22'),
(3, 3, 3, '2025-04-17', '06:00:00', '07:00:00', 8, '', 'scheduled', 1000, '2025-04-15 17:23:22'),
(4, 3, 4, '2025-04-18', '06:00:00', '07:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:23:22'),
(5, 3, 5, '2025-04-19', '06:00:00', '07:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:23:22'),
(6, 3, 6, '2025-04-20', '06:00:00', '07:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:23:22'),
(7, 3, 7, '2025-04-22', '06:00:00', '07:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:23:22'),
(8, 3, 8, '2025-05-05', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(9, 3, 9, '2025-05-06', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(10, 3, 10, '2025-05-02', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(11, 3, 11, '2025-05-03', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(12, 3, 12, '2025-05-04', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(13, 3, 13, '2025-05-07', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(14, 3, 14, '2025-05-01', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:37:14'),
(15, 3, 13, '2025-04-30', '21:00:00', '22:00:00', 5, NULL, 'scheduled', 1000, '2025-04-15 17:45:45'),
(16, 3, 2, '2025-04-30', '06:00:00', '07:00:00', 8, NULL, 'scheduled', 1000, '2025-04-17 14:19:28'),
(17, 1, 22, '2025-04-28', '08:00:00', '09:00:00', 10, NULL, 'scheduled', 1000, '2025-04-23 09:08:48'),
(18, 1, 25, '2025-04-30', '08:00:00', '09:00:00', 8, '', 'scheduled', 1000, '2025-04-23 09:08:48'),
(19, 1, 24, '2025-04-29', '08:00:00', '09:00:00', 10, NULL, 'scheduled', 1000, '2025-04-23 09:08:48'),
(20, 1, 25, '2025-04-30', '08:00:00', '09:00:00', 10, NULL, 'scheduled', 1000, '2025-04-23 09:08:48'),
(21, 1, 26, '2025-04-25', '08:00:00', '09:00:00', 10, NULL, 'scheduled', 1000, '2025-04-23 09:08:48'),
(22, 8, 27, '2025-05-05', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(23, 8, 27, '2025-05-12', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(24, 8, 27, '2025-05-19', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(25, 8, 27, '2025-05-26', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(26, 8, 28, '2025-05-02', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(27, 8, 28, '2025-05-09', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(28, 8, 28, '2025-05-16', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(29, 8, 28, '2025-05-23', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(30, 8, 28, '2025-05-30', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(31, 8, 30, '2025-05-07', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(32, 8, 30, '2025-05-14', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(33, 8, 30, '2025-05-21', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12'),
(34, 8, 30, '2025-05-28', '06:00:00', '08:00:00', 50, NULL, 'scheduled', 1000, '2025-04-27 17:14:12');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `center_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `weekday` enum('mon','tue','wed','thu','fri','sat','sun') DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `default_capacity` int(11) DEFAULT NULL,
  `recurrence_pattern` enum('daily','weekly') DEFAULT 'weekly',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `center_id`, `doctor_id`, `weekday`, `start_time`, `end_time`, `default_capacity`, `recurrence_pattern`, `status`, `created_by_id`, `created_at`) VALUES
(1, 3, 1005, 'mon', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(2, 3, 1005, 'wed', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(3, 3, 1005, 'thu', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(4, 3, 1005, 'fri', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(5, 3, 1005, 'sat', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(6, 3, 1005, 'sun', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(7, 3, 1005, 'tue', '06:00:00', '07:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 15:31:23'),
(8, 3, 1005, 'mon', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(9, 3, 1005, 'tue', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(10, 3, 1005, 'fri', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(11, 3, 1005, 'sat', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(12, 3, 1005, 'sun', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(13, 3, 1005, 'wed', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(14, 3, 1005, 'thu', '21:00:00', '22:00:00', 5, 'weekly', 'active', 1000, '2025-04-15 16:46:17'),
(15, 3, 1005, 'mon', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(16, 3, 1005, 'wed', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(17, 3, 1005, 'thu', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(18, 3, 1005, 'sat', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(19, 3, 1005, 'sun', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(20, 3, 1005, 'fri', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(21, 3, 1005, 'tue', '20:00:00', '21:00:00', 10, 'weekly', 'active', 1000, '2025-04-16 16:02:12'),
(22, 1, 1005, 'mon', '08:00:00', '09:00:00', 10, 'weekly', 'active', 1000, '2025-04-23 09:08:23'),
(23, 1, 1005, 'thu', '08:00:00', '09:00:00', 10, 'weekly', 'active', 1000, '2025-04-23 09:08:23'),
(24, 1, 1005, 'tue', '08:00:00', '09:00:00', 10, 'weekly', 'active', 1000, '2025-04-23 09:08:23'),
(25, 1, 1005, 'wed', '08:00:00', '09:00:00', 10, 'weekly', 'active', 1000, '2025-04-23 09:08:23'),
(26, 1, 1005, 'fri', '08:00:00', '09:00:00', 10, 'weekly', 'active', 1000, '2025-04-23 09:08:23'),
(27, 8, 1028, 'mon', '06:00:00', '08:00:00', 50, 'weekly', 'active', 1000, '2025-04-27 17:13:42'),
(28, 8, 1028, 'fri', '06:00:00', '08:00:00', 50, 'weekly', 'active', 1000, '2025-04-27 17:13:42'),
(29, 8, 1028, 'tue', '06:00:00', '08:00:00', 50, 'weekly', 'active', 1000, '2025-04-27 17:13:42'),
(30, 8, 1028, 'wed', '06:00:00', '08:00:00', 50, 'weekly', 'active', 1000, '2025-04-27 17:13:42'),
(31, 8, 1028, 'thu', '06:00:00', '08:00:00', 50, 'weekly', 'active', 1000, '2025-04-27 17:13:42');

-- --------------------------------------------------------

--
-- Table structure for table `session_beds`
--

CREATE TABLE `session_beds` (
  `id` int(11) NOT NULL,
  `schedule_session_id` int(11) DEFAULT NULL,
  `bed_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('available','unavailable','reserved') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_beds`
--

INSERT INTO `session_beds` (`id`, `schedule_session_id`, `bed_id`, `notes`, `status`) VALUES
(1, 1, 1, NULL, 'available'),
(2, 1, 2, NULL, 'available'),
(3, 1, 3, NULL, 'available'),
(4, 1, 4, NULL, 'available'),
(5, 1, 5, NULL, 'available'),
(6, 1, 6, NULL, 'available'),
(7, 1, 8, NULL, 'available'),
(8, 1, 9, NULL, 'available'),
(9, 2, 1, NULL, 'available'),
(10, 2, 2, NULL, 'available'),
(11, 2, 3, NULL, 'available'),
(12, 2, 4, NULL, 'available'),
(17, 3, 1, NULL, 'available'),
(18, 3, 2, NULL, 'available'),
(19, 3, 3, NULL, 'available'),
(20, 3, 4, NULL, 'available'),
(25, 4, 1, NULL, 'available'),
(26, 4, 2, NULL, 'available'),
(27, 4, 3, NULL, 'available'),
(28, 4, 4, NULL, 'available'),
(29, 4, 5, NULL, 'available'),
(30, 4, 6, NULL, 'available'),
(31, 4, 8, NULL, 'available'),
(32, 4, 9, NULL, 'available'),
(33, 5, 1, NULL, 'available'),
(34, 5, 2, NULL, 'available'),
(35, 5, 3, NULL, 'available'),
(36, 5, 4, NULL, 'available'),
(37, 5, 5, NULL, 'available'),
(38, 5, 6, NULL, 'available'),
(39, 5, 8, NULL, 'available'),
(40, 5, 9, NULL, 'available'),
(41, 6, 1, NULL, 'available'),
(42, 6, 2, NULL, 'available'),
(43, 6, 3, NULL, 'available'),
(44, 6, 4, NULL, 'available'),
(45, 6, 5, NULL, 'available'),
(46, 6, 6, NULL, 'available'),
(47, 6, 8, NULL, 'available'),
(48, 6, 9, NULL, 'available'),
(49, 1, 1, NULL, 'available'),
(50, 1, 2, NULL, 'available'),
(51, 1, 3, NULL, 'available'),
(52, 1, 4, NULL, 'available'),
(53, 1, 5, NULL, 'available'),
(54, 1, 6, NULL, 'available'),
(55, 1, 8, NULL, 'available'),
(56, 1, 9, NULL, 'available'),
(57, 2, 1, NULL, 'available'),
(58, 2, 2, NULL, 'available'),
(59, 2, 3, NULL, 'available'),
(60, 2, 4, NULL, 'available'),
(65, 3, 1, NULL, 'available'),
(66, 3, 2, NULL, 'available'),
(67, 3, 3, NULL, 'available'),
(68, 3, 4, NULL, 'available'),
(73, 4, 1, NULL, 'available'),
(74, 4, 2, NULL, 'available'),
(75, 4, 3, NULL, 'available'),
(76, 4, 4, NULL, 'available'),
(77, 4, 5, NULL, 'available'),
(78, 4, 6, NULL, 'available'),
(79, 4, 8, NULL, 'available'),
(80, 4, 9, NULL, 'available'),
(81, 5, 1, NULL, 'available'),
(82, 5, 2, NULL, 'available'),
(83, 5, 3, NULL, 'available'),
(84, 5, 4, NULL, 'available'),
(85, 5, 5, NULL, 'available'),
(86, 5, 6, NULL, 'available'),
(87, 5, 8, NULL, 'available'),
(88, 5, 9, NULL, 'available'),
(89, 6, 1, NULL, 'available'),
(90, 6, 2, NULL, 'available'),
(91, 6, 3, NULL, 'available'),
(92, 6, 4, NULL, 'available'),
(93, 6, 5, NULL, 'available'),
(94, 6, 6, NULL, 'available'),
(95, 6, 8, NULL, 'available'),
(96, 6, 9, NULL, 'available'),
(97, 7, 1, NULL, 'available'),
(98, 7, 2, NULL, 'available'),
(99, 7, 3, NULL, 'available'),
(100, 7, 4, NULL, 'available'),
(101, 7, 5, NULL, 'available'),
(102, 7, 6, NULL, 'available'),
(103, 7, 8, NULL, 'available'),
(104, 7, 9, NULL, 'available'),
(105, 8, 1, NULL, 'available'),
(106, 8, 2, NULL, 'available'),
(107, 8, 3, NULL, 'available'),
(108, 8, 4, NULL, 'available'),
(109, 8, 5, NULL, 'available'),
(110, 8, 6, NULL, 'available'),
(111, 8, 8, NULL, 'available'),
(112, 8, 9, NULL, 'available'),
(113, 9, 1, NULL, 'available'),
(114, 9, 2, NULL, 'available'),
(115, 9, 3, NULL, 'available'),
(116, 9, 4, NULL, 'available'),
(117, 9, 5, NULL, 'available'),
(118, 9, 6, NULL, 'available'),
(119, 9, 8, NULL, 'available'),
(120, 9, 9, NULL, 'available'),
(121, 10, 1, NULL, 'available'),
(122, 10, 2, NULL, 'available'),
(123, 10, 3, NULL, 'available'),
(124, 10, 4, NULL, 'available'),
(125, 10, 5, NULL, 'available'),
(126, 10, 6, NULL, 'available'),
(127, 10, 8, NULL, 'available'),
(128, 10, 9, NULL, 'available'),
(129, 11, 1, NULL, 'available'),
(130, 11, 2, NULL, 'available'),
(131, 11, 3, NULL, 'available'),
(132, 11, 4, NULL, 'available'),
(133, 11, 5, NULL, 'available'),
(134, 11, 6, NULL, 'available'),
(135, 11, 8, NULL, 'available'),
(136, 11, 9, NULL, 'available'),
(137, 12, 1, NULL, 'available'),
(138, 12, 2, NULL, 'available'),
(139, 12, 3, NULL, 'available'),
(140, 12, 4, NULL, 'available'),
(141, 12, 5, NULL, 'available'),
(142, 12, 6, NULL, 'available'),
(143, 12, 8, NULL, 'available'),
(144, 12, 9, NULL, 'available'),
(145, 13, 1, NULL, 'available'),
(146, 13, 2, NULL, 'available'),
(147, 13, 3, NULL, 'available'),
(148, 13, 4, NULL, 'available'),
(149, 13, 5, NULL, 'available'),
(150, 13, 6, NULL, 'available'),
(151, 13, 8, NULL, 'available'),
(152, 13, 9, NULL, 'available'),
(153, 14, 1, NULL, 'available'),
(154, 14, 2, NULL, 'available'),
(155, 14, 3, NULL, 'available'),
(156, 14, 4, NULL, 'available'),
(157, 14, 5, NULL, 'available'),
(158, 14, 6, NULL, 'available'),
(159, 14, 8, NULL, 'available'),
(160, 14, 9, NULL, 'available'),
(161, 15, 1, NULL, 'available'),
(162, 15, 2, NULL, 'available'),
(163, 15, 3, NULL, 'available'),
(164, 15, 4, NULL, 'available'),
(165, 15, 5, NULL, 'available'),
(166, 15, 6, NULL, 'available'),
(167, 15, 8, NULL, 'available'),
(168, 15, 9, NULL, 'available'),
(169, 16, 1, NULL, 'available'),
(170, 16, 2, NULL, 'available'),
(171, 16, 3, NULL, 'available'),
(172, 16, 4, NULL, 'available'),
(173, 16, 5, NULL, 'available'),
(174, 16, 6, NULL, 'available'),
(175, 16, 8, NULL, 'available'),
(176, 16, 9, NULL, 'available'),
(177, 17, 11, NULL, 'available'),
(178, 17, 12, NULL, 'available'),
(179, 17, 13, NULL, 'available'),
(180, 17, 14, NULL, 'available'),
(181, 17, 15, NULL, 'available'),
(182, 17, 16, NULL, 'available'),
(183, 17, 19, NULL, 'available'),
(184, 17, 20, NULL, 'available'),
(185, 18, 11, NULL, 'available'),
(186, 18, 12, NULL, 'available'),
(187, 18, 13, NULL, 'available'),
(188, 18, 14, NULL, 'available'),
(189, 18, 15, NULL, 'available'),
(190, 18, 16, NULL, 'available'),
(191, 18, 19, NULL, 'available'),
(192, 18, 20, NULL, 'available'),
(193, 19, 11, NULL, 'available'),
(194, 19, 12, NULL, 'available'),
(195, 19, 13, NULL, 'available'),
(196, 19, 14, NULL, 'available'),
(197, 19, 15, NULL, 'available'),
(198, 19, 16, NULL, 'available'),
(199, 19, 19, NULL, 'available'),
(200, 19, 20, NULL, 'available'),
(201, 20, 11, NULL, 'available'),
(202, 20, 12, NULL, 'available'),
(203, 20, 13, NULL, 'available'),
(204, 20, 14, NULL, 'available'),
(205, 20, 15, NULL, 'available'),
(206, 20, 16, NULL, 'available'),
(207, 20, 19, NULL, 'available'),
(208, 20, 20, NULL, 'available'),
(209, 21, 11, NULL, 'available'),
(210, 21, 12, NULL, 'available'),
(211, 21, 13, NULL, 'available'),
(212, 21, 14, NULL, 'available'),
(213, 21, 15, NULL, 'available'),
(214, 21, 16, NULL, 'available'),
(215, 21, 19, NULL, 'available'),
(216, 21, 20, NULL, 'available'),
(217, 22, 21, NULL, 'available'),
(218, 22, 22, NULL, 'available'),
(219, 22, 23, NULL, 'available'),
(220, 22, 24, NULL, 'available'),
(221, 22, 25, NULL, 'available'),
(222, 22, 26, NULL, 'available'),
(223, 22, 27, NULL, 'available'),
(224, 22, 28, NULL, 'available'),
(225, 22, 29, NULL, 'available'),
(226, 22, 30, NULL, 'available'),
(227, 22, 31, NULL, 'available'),
(228, 22, 32, NULL, 'available'),
(229, 22, 33, NULL, 'available'),
(230, 22, 34, NULL, 'available'),
(231, 22, 35, NULL, 'available'),
(232, 22, 36, NULL, 'available'),
(233, 22, 37, NULL, 'available'),
(234, 22, 38, NULL, 'available'),
(235, 22, 39, NULL, 'available'),
(236, 22, 40, NULL, 'available'),
(237, 22, 41, NULL, 'available'),
(238, 22, 42, NULL, 'available'),
(239, 22, 43, NULL, 'available'),
(240, 22, 44, NULL, 'available'),
(241, 22, 45, NULL, 'available'),
(242, 22, 46, NULL, 'available'),
(243, 22, 47, NULL, 'available'),
(244, 22, 48, NULL, 'available'),
(245, 22, 49, NULL, 'available'),
(246, 22, 50, NULL, 'available'),
(247, 22, 51, NULL, 'available'),
(248, 22, 52, NULL, 'available'),
(249, 22, 53, NULL, 'available'),
(250, 22, 54, NULL, 'available'),
(251, 22, 55, NULL, 'available'),
(252, 22, 56, NULL, 'available'),
(253, 22, 57, NULL, 'available'),
(254, 22, 58, NULL, 'available'),
(255, 22, 59, NULL, 'available'),
(256, 22, 60, NULL, 'available'),
(257, 22, 61, NULL, 'available'),
(258, 22, 62, NULL, 'available'),
(259, 22, 63, NULL, 'available'),
(260, 22, 64, NULL, 'available'),
(261, 22, 65, NULL, 'available'),
(262, 22, 66, NULL, 'available'),
(263, 22, 67, NULL, 'available'),
(264, 22, 68, NULL, 'available'),
(265, 22, 69, NULL, 'available'),
(266, 22, 70, NULL, 'available'),
(267, 23, 21, NULL, 'available'),
(268, 23, 22, NULL, 'available'),
(269, 23, 23, NULL, 'available'),
(270, 23, 24, NULL, 'available'),
(271, 23, 25, NULL, 'available'),
(272, 23, 26, NULL, 'available'),
(273, 23, 27, NULL, 'available'),
(274, 23, 28, NULL, 'available'),
(275, 23, 29, NULL, 'available'),
(276, 23, 30, NULL, 'available'),
(277, 23, 31, NULL, 'available'),
(278, 23, 32, NULL, 'available'),
(279, 23, 33, NULL, 'available'),
(280, 23, 34, NULL, 'available'),
(281, 23, 35, NULL, 'available'),
(282, 23, 36, NULL, 'available'),
(283, 23, 37, NULL, 'available'),
(284, 23, 38, NULL, 'available'),
(285, 23, 39, NULL, 'available'),
(286, 23, 40, NULL, 'available'),
(287, 23, 41, NULL, 'available'),
(288, 23, 42, NULL, 'available'),
(289, 23, 43, NULL, 'available'),
(290, 23, 44, NULL, 'available'),
(291, 23, 45, NULL, 'available'),
(292, 23, 46, NULL, 'available'),
(293, 23, 47, NULL, 'available'),
(294, 23, 48, NULL, 'available'),
(295, 23, 49, NULL, 'available'),
(296, 23, 50, NULL, 'available'),
(297, 23, 51, NULL, 'available'),
(298, 23, 52, NULL, 'available'),
(299, 23, 53, NULL, 'available'),
(300, 23, 54, NULL, 'available'),
(301, 23, 55, NULL, 'available'),
(302, 23, 56, NULL, 'available'),
(303, 23, 57, NULL, 'available'),
(304, 23, 58, NULL, 'available'),
(305, 23, 59, NULL, 'available'),
(306, 23, 60, NULL, 'available'),
(307, 23, 61, NULL, 'available'),
(308, 23, 62, NULL, 'available'),
(309, 23, 63, NULL, 'available'),
(310, 23, 64, NULL, 'available'),
(311, 23, 65, NULL, 'available'),
(312, 23, 66, NULL, 'available'),
(313, 23, 67, NULL, 'available'),
(314, 23, 68, NULL, 'available'),
(315, 23, 69, NULL, 'available'),
(316, 23, 70, NULL, 'available'),
(317, 24, 21, NULL, 'available'),
(318, 24, 22, NULL, 'available'),
(319, 24, 23, NULL, 'available'),
(320, 24, 24, NULL, 'available'),
(321, 24, 25, NULL, 'available'),
(322, 24, 26, NULL, 'available'),
(323, 24, 27, NULL, 'available'),
(324, 24, 28, NULL, 'available'),
(325, 24, 29, NULL, 'available'),
(326, 24, 30, NULL, 'available'),
(327, 24, 31, NULL, 'available'),
(328, 24, 32, NULL, 'available'),
(329, 24, 33, NULL, 'available'),
(330, 24, 34, NULL, 'available'),
(331, 24, 35, NULL, 'available'),
(332, 24, 36, NULL, 'available'),
(333, 24, 37, NULL, 'available'),
(334, 24, 38, NULL, 'available'),
(335, 24, 39, NULL, 'available'),
(336, 24, 40, NULL, 'available'),
(337, 24, 41, NULL, 'available'),
(338, 24, 42, NULL, 'available'),
(339, 24, 43, NULL, 'available'),
(340, 24, 44, NULL, 'available'),
(341, 24, 45, NULL, 'available'),
(342, 24, 46, NULL, 'available'),
(343, 24, 47, NULL, 'available'),
(344, 24, 48, NULL, 'available'),
(345, 24, 49, NULL, 'available'),
(346, 24, 50, NULL, 'available'),
(347, 24, 51, NULL, 'available'),
(348, 24, 52, NULL, 'available'),
(349, 24, 53, NULL, 'available'),
(350, 24, 54, NULL, 'available'),
(351, 24, 55, NULL, 'available'),
(352, 24, 56, NULL, 'available'),
(353, 24, 57, NULL, 'available'),
(354, 24, 58, NULL, 'available'),
(355, 24, 59, NULL, 'available'),
(356, 24, 60, NULL, 'available'),
(357, 24, 61, NULL, 'available'),
(358, 24, 62, NULL, 'available'),
(359, 24, 63, NULL, 'available'),
(360, 24, 64, NULL, 'available'),
(361, 24, 65, NULL, 'available'),
(362, 24, 66, NULL, 'available'),
(363, 24, 67, NULL, 'available'),
(364, 24, 68, NULL, 'available'),
(365, 24, 69, NULL, 'available'),
(366, 24, 70, NULL, 'available'),
(367, 25, 21, NULL, 'available'),
(368, 25, 22, NULL, 'available'),
(369, 25, 23, NULL, 'available'),
(370, 25, 24, NULL, 'available'),
(371, 25, 25, NULL, 'available'),
(372, 25, 26, NULL, 'available'),
(373, 25, 27, NULL, 'available'),
(374, 25, 28, NULL, 'available'),
(375, 25, 29, NULL, 'available'),
(376, 25, 30, NULL, 'available'),
(377, 25, 31, NULL, 'available'),
(378, 25, 32, NULL, 'available'),
(379, 25, 33, NULL, 'available'),
(380, 25, 34, NULL, 'available'),
(381, 25, 35, NULL, 'available'),
(382, 25, 36, NULL, 'available'),
(383, 25, 37, NULL, 'available'),
(384, 25, 38, NULL, 'available'),
(385, 25, 39, NULL, 'available'),
(386, 25, 40, NULL, 'available'),
(387, 25, 41, NULL, 'available'),
(388, 25, 42, NULL, 'available'),
(389, 25, 43, NULL, 'available'),
(390, 25, 44, NULL, 'available'),
(391, 25, 45, NULL, 'available'),
(392, 25, 46, NULL, 'available'),
(393, 25, 47, NULL, 'available'),
(394, 25, 48, NULL, 'available'),
(395, 25, 49, NULL, 'available'),
(396, 25, 50, NULL, 'available'),
(397, 25, 51, NULL, 'available'),
(398, 25, 52, NULL, 'available'),
(399, 25, 53, NULL, 'available'),
(400, 25, 54, NULL, 'available'),
(401, 25, 55, NULL, 'available'),
(402, 25, 56, NULL, 'available'),
(403, 25, 57, NULL, 'available'),
(404, 25, 58, NULL, 'available'),
(405, 25, 59, NULL, 'available'),
(406, 25, 60, NULL, 'available'),
(407, 25, 61, NULL, 'available'),
(408, 25, 62, NULL, 'available'),
(409, 25, 63, NULL, 'available'),
(410, 25, 64, NULL, 'available'),
(411, 25, 65, NULL, 'available'),
(412, 25, 66, NULL, 'available'),
(413, 25, 67, NULL, 'available'),
(414, 25, 68, NULL, 'available'),
(415, 25, 69, NULL, 'available'),
(416, 25, 70, NULL, 'available'),
(417, 26, 21, NULL, 'available'),
(418, 26, 22, NULL, 'available'),
(419, 26, 23, NULL, 'available'),
(420, 26, 24, NULL, 'available'),
(421, 26, 25, NULL, 'available'),
(422, 26, 26, NULL, 'available'),
(423, 26, 27, NULL, 'available'),
(424, 26, 28, NULL, 'available'),
(425, 26, 29, NULL, 'available'),
(426, 26, 30, NULL, 'available'),
(427, 26, 31, NULL, 'available'),
(428, 26, 32, NULL, 'available'),
(429, 26, 33, NULL, 'available'),
(430, 26, 34, NULL, 'available'),
(431, 26, 35, NULL, 'available'),
(432, 26, 36, NULL, 'available'),
(433, 26, 37, NULL, 'available'),
(434, 26, 38, NULL, 'available'),
(435, 26, 39, NULL, 'available'),
(436, 26, 40, NULL, 'available'),
(437, 26, 41, NULL, 'available'),
(438, 26, 42, NULL, 'available'),
(439, 26, 43, NULL, 'available'),
(440, 26, 44, NULL, 'available'),
(441, 26, 45, NULL, 'available'),
(442, 26, 46, NULL, 'available'),
(443, 26, 47, NULL, 'available'),
(444, 26, 48, NULL, 'available'),
(445, 26, 49, NULL, 'available'),
(446, 26, 50, NULL, 'available'),
(447, 26, 51, NULL, 'available'),
(448, 26, 52, NULL, 'available'),
(449, 26, 53, NULL, 'available'),
(450, 26, 54, NULL, 'available'),
(451, 26, 55, NULL, 'available'),
(452, 26, 56, NULL, 'available'),
(453, 26, 57, NULL, 'available'),
(454, 26, 58, NULL, 'available'),
(455, 26, 59, NULL, 'available'),
(456, 26, 60, NULL, 'available'),
(457, 26, 61, NULL, 'available'),
(458, 26, 62, NULL, 'available'),
(459, 26, 63, NULL, 'available'),
(460, 26, 64, NULL, 'available'),
(461, 26, 65, NULL, 'available'),
(462, 26, 66, NULL, 'available'),
(463, 26, 67, NULL, 'available'),
(464, 26, 68, NULL, 'available'),
(465, 26, 69, NULL, 'available'),
(466, 26, 70, NULL, 'available'),
(467, 27, 21, NULL, 'available'),
(468, 27, 22, NULL, 'available'),
(469, 27, 23, NULL, 'available'),
(470, 27, 24, NULL, 'available'),
(471, 27, 25, NULL, 'available'),
(472, 27, 26, NULL, 'available'),
(473, 27, 27, NULL, 'available'),
(474, 27, 28, NULL, 'available'),
(475, 27, 29, NULL, 'available'),
(476, 27, 30, NULL, 'available'),
(477, 27, 31, NULL, 'available'),
(478, 27, 32, NULL, 'available'),
(479, 27, 33, NULL, 'available'),
(480, 27, 34, NULL, 'available'),
(481, 27, 35, NULL, 'available'),
(482, 27, 36, NULL, 'available'),
(483, 27, 37, NULL, 'available'),
(484, 27, 38, NULL, 'available'),
(485, 27, 39, NULL, 'available'),
(486, 27, 40, NULL, 'available'),
(487, 27, 41, NULL, 'available'),
(488, 27, 42, NULL, 'available'),
(489, 27, 43, NULL, 'available'),
(490, 27, 44, NULL, 'available'),
(491, 27, 45, NULL, 'available'),
(492, 27, 46, NULL, 'available'),
(493, 27, 47, NULL, 'available'),
(494, 27, 48, NULL, 'available'),
(495, 27, 49, NULL, 'available'),
(496, 27, 50, NULL, 'available'),
(497, 27, 51, NULL, 'available'),
(498, 27, 52, NULL, 'available'),
(499, 27, 53, NULL, 'available'),
(500, 27, 54, NULL, 'available'),
(501, 27, 55, NULL, 'available'),
(502, 27, 56, NULL, 'available'),
(503, 27, 57, NULL, 'available'),
(504, 27, 58, NULL, 'available'),
(505, 27, 59, NULL, 'available'),
(506, 27, 60, NULL, 'available'),
(507, 27, 61, NULL, 'available'),
(508, 27, 62, NULL, 'available'),
(509, 27, 63, NULL, 'available'),
(510, 27, 64, NULL, 'available'),
(511, 27, 65, NULL, 'available'),
(512, 27, 66, NULL, 'available'),
(513, 27, 67, NULL, 'available'),
(514, 27, 68, NULL, 'available'),
(515, 27, 69, NULL, 'available'),
(516, 27, 70, NULL, 'available'),
(517, 28, 21, NULL, 'available'),
(518, 28, 22, NULL, 'available'),
(519, 28, 23, NULL, 'available'),
(520, 28, 24, NULL, 'available'),
(521, 28, 25, NULL, 'available'),
(522, 28, 26, NULL, 'available'),
(523, 28, 27, NULL, 'available'),
(524, 28, 28, NULL, 'available'),
(525, 28, 29, NULL, 'available'),
(526, 28, 30, NULL, 'available'),
(527, 28, 31, NULL, 'available'),
(528, 28, 32, NULL, 'available'),
(529, 28, 33, NULL, 'available'),
(530, 28, 34, NULL, 'available'),
(531, 28, 35, NULL, 'available'),
(532, 28, 36, NULL, 'available'),
(533, 28, 37, NULL, 'available'),
(534, 28, 38, NULL, 'available'),
(535, 28, 39, NULL, 'available'),
(536, 28, 40, NULL, 'available'),
(537, 28, 41, NULL, 'available'),
(538, 28, 42, NULL, 'available'),
(539, 28, 43, NULL, 'available'),
(540, 28, 44, NULL, 'available'),
(541, 28, 45, NULL, 'available'),
(542, 28, 46, NULL, 'available'),
(543, 28, 47, NULL, 'available'),
(544, 28, 48, NULL, 'available'),
(545, 28, 49, NULL, 'available'),
(546, 28, 50, NULL, 'available'),
(547, 28, 51, NULL, 'available'),
(548, 28, 52, NULL, 'available'),
(549, 28, 53, NULL, 'available'),
(550, 28, 54, NULL, 'available'),
(551, 28, 55, NULL, 'available'),
(552, 28, 56, NULL, 'available'),
(553, 28, 57, NULL, 'available'),
(554, 28, 58, NULL, 'available'),
(555, 28, 59, NULL, 'available'),
(556, 28, 60, NULL, 'available'),
(557, 28, 61, NULL, 'available'),
(558, 28, 62, NULL, 'available'),
(559, 28, 63, NULL, 'available'),
(560, 28, 64, NULL, 'available'),
(561, 28, 65, NULL, 'available'),
(562, 28, 66, NULL, 'available'),
(563, 28, 67, NULL, 'available'),
(564, 28, 68, NULL, 'available'),
(565, 28, 69, NULL, 'available'),
(566, 28, 70, NULL, 'available'),
(567, 29, 21, NULL, 'available'),
(568, 29, 22, NULL, 'available'),
(569, 29, 23, NULL, 'available'),
(570, 29, 24, NULL, 'available'),
(571, 29, 25, NULL, 'available'),
(572, 29, 26, NULL, 'available'),
(573, 29, 27, NULL, 'available'),
(574, 29, 28, NULL, 'available'),
(575, 29, 29, NULL, 'available'),
(576, 29, 30, NULL, 'available'),
(577, 29, 31, NULL, 'available'),
(578, 29, 32, NULL, 'available'),
(579, 29, 33, NULL, 'available'),
(580, 29, 34, NULL, 'available'),
(581, 29, 35, NULL, 'available'),
(582, 29, 36, NULL, 'available'),
(583, 29, 37, NULL, 'available'),
(584, 29, 38, NULL, 'available'),
(585, 29, 39, NULL, 'available'),
(586, 29, 40, NULL, 'available'),
(587, 29, 41, NULL, 'available'),
(588, 29, 42, NULL, 'available'),
(589, 29, 43, NULL, 'available'),
(590, 29, 44, NULL, 'available'),
(591, 29, 45, NULL, 'available'),
(592, 29, 46, NULL, 'available'),
(593, 29, 47, NULL, 'available'),
(594, 29, 48, NULL, 'available'),
(595, 29, 49, NULL, 'available'),
(596, 29, 50, NULL, 'available'),
(597, 29, 51, NULL, 'available'),
(598, 29, 52, NULL, 'available'),
(599, 29, 53, NULL, 'available'),
(600, 29, 54, NULL, 'available'),
(601, 29, 55, NULL, 'available'),
(602, 29, 56, NULL, 'available'),
(603, 29, 57, NULL, 'available'),
(604, 29, 58, NULL, 'available'),
(605, 29, 59, NULL, 'available'),
(606, 29, 60, NULL, 'available'),
(607, 29, 61, NULL, 'available'),
(608, 29, 62, NULL, 'available'),
(609, 29, 63, NULL, 'available'),
(610, 29, 64, NULL, 'available'),
(611, 29, 65, NULL, 'available'),
(612, 29, 66, NULL, 'available'),
(613, 29, 67, NULL, 'available'),
(614, 29, 68, NULL, 'available'),
(615, 29, 69, NULL, 'available'),
(616, 29, 70, NULL, 'available'),
(617, 30, 21, NULL, 'available'),
(618, 30, 22, NULL, 'available'),
(619, 30, 23, NULL, 'available'),
(620, 30, 24, NULL, 'available'),
(621, 30, 25, NULL, 'available'),
(622, 30, 26, NULL, 'available'),
(623, 30, 27, NULL, 'available'),
(624, 30, 28, NULL, 'available'),
(625, 30, 29, NULL, 'available'),
(626, 30, 30, NULL, 'available'),
(627, 30, 31, NULL, 'available'),
(628, 30, 32, NULL, 'available'),
(629, 30, 33, NULL, 'available'),
(630, 30, 34, NULL, 'available'),
(631, 30, 35, NULL, 'available'),
(632, 30, 36, NULL, 'available'),
(633, 30, 37, NULL, 'available'),
(634, 30, 38, NULL, 'available'),
(635, 30, 39, NULL, 'available'),
(636, 30, 40, NULL, 'available'),
(637, 30, 41, NULL, 'available'),
(638, 30, 42, NULL, 'available'),
(639, 30, 43, NULL, 'available'),
(640, 30, 44, NULL, 'available'),
(641, 30, 45, NULL, 'available'),
(642, 30, 46, NULL, 'available'),
(643, 30, 47, NULL, 'available'),
(644, 30, 48, NULL, 'available'),
(645, 30, 49, NULL, 'available'),
(646, 30, 50, NULL, 'available'),
(647, 30, 51, NULL, 'available'),
(648, 30, 52, NULL, 'available'),
(649, 30, 53, NULL, 'available'),
(650, 30, 54, NULL, 'available'),
(651, 30, 55, NULL, 'available'),
(652, 30, 56, NULL, 'available'),
(653, 30, 57, NULL, 'available'),
(654, 30, 58, NULL, 'available'),
(655, 30, 59, NULL, 'available'),
(656, 30, 60, NULL, 'available'),
(657, 30, 61, NULL, 'available'),
(658, 30, 62, NULL, 'available'),
(659, 30, 63, NULL, 'available'),
(660, 30, 64, NULL, 'available'),
(661, 30, 65, NULL, 'available'),
(662, 30, 66, NULL, 'available'),
(663, 30, 67, NULL, 'available'),
(664, 30, 68, NULL, 'available'),
(665, 30, 69, NULL, 'available'),
(666, 30, 70, NULL, 'available'),
(667, 31, 21, NULL, 'available'),
(668, 31, 22, NULL, 'available'),
(669, 31, 23, NULL, 'available'),
(670, 31, 24, NULL, 'available'),
(671, 31, 25, NULL, 'available'),
(672, 31, 26, NULL, 'available'),
(673, 31, 27, NULL, 'available'),
(674, 31, 28, NULL, 'available'),
(675, 31, 29, NULL, 'available'),
(676, 31, 30, NULL, 'available'),
(677, 31, 31, NULL, 'available'),
(678, 31, 32, NULL, 'available'),
(679, 31, 33, NULL, 'available'),
(680, 31, 34, NULL, 'available'),
(681, 31, 35, NULL, 'available'),
(682, 31, 36, NULL, 'available'),
(683, 31, 37, NULL, 'available'),
(684, 31, 38, NULL, 'available'),
(685, 31, 39, NULL, 'available'),
(686, 31, 40, NULL, 'available'),
(687, 31, 41, NULL, 'available'),
(688, 31, 42, NULL, 'available'),
(689, 31, 43, NULL, 'available'),
(690, 31, 44, NULL, 'available'),
(691, 31, 45, NULL, 'available'),
(692, 31, 46, NULL, 'available'),
(693, 31, 47, NULL, 'available'),
(694, 31, 48, NULL, 'available'),
(695, 31, 49, NULL, 'available'),
(696, 31, 50, NULL, 'available'),
(697, 31, 51, NULL, 'available'),
(698, 31, 52, NULL, 'available'),
(699, 31, 53, NULL, 'available'),
(700, 31, 54, NULL, 'available'),
(701, 31, 55, NULL, 'available'),
(702, 31, 56, NULL, 'available'),
(703, 31, 57, NULL, 'available'),
(704, 31, 58, NULL, 'available'),
(705, 31, 59, NULL, 'available'),
(706, 31, 60, NULL, 'available'),
(707, 31, 61, NULL, 'available'),
(708, 31, 62, NULL, 'available'),
(709, 31, 63, NULL, 'available'),
(710, 31, 64, NULL, 'available'),
(711, 31, 65, NULL, 'available'),
(712, 31, 66, NULL, 'available'),
(713, 31, 67, NULL, 'available'),
(714, 31, 68, NULL, 'available'),
(715, 31, 69, NULL, 'available'),
(716, 31, 70, NULL, 'available'),
(717, 32, 21, NULL, 'available'),
(718, 32, 22, NULL, 'available'),
(719, 32, 23, NULL, 'available'),
(720, 32, 24, NULL, 'available'),
(721, 32, 25, NULL, 'available'),
(722, 32, 26, NULL, 'available'),
(723, 32, 27, NULL, 'available'),
(724, 32, 28, NULL, 'available'),
(725, 32, 29, NULL, 'available'),
(726, 32, 30, NULL, 'available'),
(727, 32, 31, NULL, 'available'),
(728, 32, 32, NULL, 'available'),
(729, 32, 33, NULL, 'available'),
(730, 32, 34, NULL, 'available'),
(731, 32, 35, NULL, 'available'),
(732, 32, 36, NULL, 'available'),
(733, 32, 37, NULL, 'available'),
(734, 32, 38, NULL, 'available'),
(735, 32, 39, NULL, 'available'),
(736, 32, 40, NULL, 'available'),
(737, 32, 41, NULL, 'available'),
(738, 32, 42, NULL, 'available'),
(739, 32, 43, NULL, 'available'),
(740, 32, 44, NULL, 'available'),
(741, 32, 45, NULL, 'available'),
(742, 32, 46, NULL, 'available'),
(743, 32, 47, NULL, 'available'),
(744, 32, 48, NULL, 'available'),
(745, 32, 49, NULL, 'available'),
(746, 32, 50, NULL, 'available'),
(747, 32, 51, NULL, 'available'),
(748, 32, 52, NULL, 'available'),
(749, 32, 53, NULL, 'available'),
(750, 32, 54, NULL, 'available'),
(751, 32, 55, NULL, 'available'),
(752, 32, 56, NULL, 'available'),
(753, 32, 57, NULL, 'available'),
(754, 32, 58, NULL, 'available'),
(755, 32, 59, NULL, 'available'),
(756, 32, 60, NULL, 'available'),
(757, 32, 61, NULL, 'available'),
(758, 32, 62, NULL, 'available'),
(759, 32, 63, NULL, 'available'),
(760, 32, 64, NULL, 'available'),
(761, 32, 65, NULL, 'available'),
(762, 32, 66, NULL, 'available'),
(763, 32, 67, NULL, 'available'),
(764, 32, 68, NULL, 'available'),
(765, 32, 69, NULL, 'available'),
(766, 32, 70, NULL, 'available'),
(767, 33, 21, NULL, 'available'),
(768, 33, 22, NULL, 'available'),
(769, 33, 23, NULL, 'available'),
(770, 33, 24, NULL, 'available'),
(771, 33, 25, NULL, 'available'),
(772, 33, 26, NULL, 'available'),
(773, 33, 27, NULL, 'available'),
(774, 33, 28, NULL, 'available'),
(775, 33, 29, NULL, 'available'),
(776, 33, 30, NULL, 'available'),
(777, 33, 31, NULL, 'available'),
(778, 33, 32, NULL, 'available'),
(779, 33, 33, NULL, 'available'),
(780, 33, 34, NULL, 'available'),
(781, 33, 35, NULL, 'available'),
(782, 33, 36, NULL, 'available'),
(783, 33, 37, NULL, 'available'),
(784, 33, 38, NULL, 'available'),
(785, 33, 39, NULL, 'available'),
(786, 33, 40, NULL, 'available'),
(787, 33, 41, NULL, 'available'),
(788, 33, 42, NULL, 'available'),
(789, 33, 43, NULL, 'available'),
(790, 33, 44, NULL, 'available'),
(791, 33, 45, NULL, 'available'),
(792, 33, 46, NULL, 'available'),
(793, 33, 47, NULL, 'available'),
(794, 33, 48, NULL, 'available'),
(795, 33, 49, NULL, 'available'),
(796, 33, 50, NULL, 'available'),
(797, 33, 51, NULL, 'available'),
(798, 33, 52, NULL, 'available'),
(799, 33, 53, NULL, 'available'),
(800, 33, 54, NULL, 'available'),
(801, 33, 55, NULL, 'available'),
(802, 33, 56, NULL, 'available'),
(803, 33, 57, NULL, 'available'),
(804, 33, 58, NULL, 'available'),
(805, 33, 59, NULL, 'available'),
(806, 33, 60, NULL, 'available'),
(807, 33, 61, NULL, 'available'),
(808, 33, 62, NULL, 'available'),
(809, 33, 63, NULL, 'available'),
(810, 33, 64, NULL, 'available'),
(811, 33, 65, NULL, 'available'),
(812, 33, 66, NULL, 'available'),
(813, 33, 67, NULL, 'available'),
(814, 33, 68, NULL, 'available'),
(815, 33, 69, NULL, 'available'),
(816, 33, 70, NULL, 'available'),
(817, 34, 21, NULL, 'available'),
(818, 34, 22, NULL, 'available'),
(819, 34, 23, NULL, 'available'),
(820, 34, 24, NULL, 'available'),
(821, 34, 25, NULL, 'available'),
(822, 34, 26, NULL, 'available'),
(823, 34, 27, NULL, 'available'),
(824, 34, 28, NULL, 'available'),
(825, 34, 29, NULL, 'available'),
(826, 34, 30, NULL, 'available'),
(827, 34, 31, NULL, 'available'),
(828, 34, 32, NULL, 'available'),
(829, 34, 33, NULL, 'available'),
(830, 34, 34, NULL, 'available'),
(831, 34, 35, NULL, 'available'),
(832, 34, 36, NULL, 'available'),
(833, 34, 37, NULL, 'available'),
(834, 34, 38, NULL, 'available'),
(835, 34, 39, NULL, 'available'),
(836, 34, 40, NULL, 'available'),
(837, 34, 41, NULL, 'available'),
(838, 34, 42, NULL, 'available'),
(839, 34, 43, NULL, 'available'),
(840, 34, 44, NULL, 'available'),
(841, 34, 45, NULL, 'available'),
(842, 34, 46, NULL, 'available'),
(843, 34, 47, NULL, 'available'),
(844, 34, 48, NULL, 'available'),
(845, 34, 49, NULL, 'available'),
(846, 34, 50, NULL, 'available'),
(847, 34, 51, NULL, 'available'),
(848, 34, 52, NULL, 'available'),
(849, 34, 53, NULL, 'available'),
(850, 34, 54, NULL, 'available'),
(851, 34, 55, NULL, 'available'),
(852, 34, 56, NULL, 'available'),
(853, 34, 57, NULL, 'available'),
(854, 34, 58, NULL, 'available'),
(855, 34, 59, NULL, 'available'),
(856, 34, 60, NULL, 'available'),
(857, 34, 61, NULL, 'available'),
(858, 34, 62, NULL, 'available'),
(859, 34, 63, NULL, 'available'),
(860, 34, 64, NULL, 'available'),
(861, 34, 65, NULL, 'available'),
(862, 34, 66, NULL, 'available'),
(863, 34, 67, NULL, 'available'),
(864, 34, 68, NULL, 'available'),
(865, 34, 69, NULL, 'available'),
(866, 34, 70, NULL, 'available');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `designation` varchar(128) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `user_id`, `designation`, `gender`) VALUES
(1, 1003, 'Nurse', 'female'),
(2, 1004, 'Technician', 'male');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `first_name` varchar(128) DEFAULT NULL,
  `last_name` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile_no` varchar(16) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_deleted` tinyint(1) DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password`, `mobile_no`, `is_active`, `is_deleted`, `last_login_at`) VALUES
(1000, 1000, 'System', 'Admin', 'system.admin@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94111111111', 1, 0, '2025-04-27 16:26:58'),
(1001, 1000, 'Suwan', 'Rathnayake', 'Suwan.Rathnayake@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94779124893', 1, 0, '2023-06-19 10:30:00'),
(1002, 1000, 'Yohan', 'Hirimuthugoda', 'Yohan.Hirimuthugoda@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278824', 1, 0, '2023-06-18 14:45:00'),
(1003, 1001, 'Suwan', 'Rathnayake', 'suwan.ratnayake@gmail.com', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94779124893', 1, 0, '2025-04-12 18:43:36'),
(1004, 1001, 'Yohan', 'Hirimuthugoda', 'yohandh@gmail.com', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278824', 1, 0, '2025-04-04 10:45:00'),
(1005, 1002, 'Harshani', 'Fernando', 'harshani.fernando@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278830', 1, 0, NULL),
(1006, 1003, 'Yohan', 'Hirimuthugoda', 'yohan.dh@gmail.com', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278840', 1, 0, NULL),
(1007, 1000, 'John', 'Doe', 'john@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278824', 1, 0, NULL),
(1008, 1000, 'QA', 'Admin', 'qa.admin@dialyzeease.org', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '1234567890', 1, 1, NULL),
(1020, 1003, 'Suwan', 'Ratnayake', 's.uwan.r.atnayake@gmail.com', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94777278824', 1, 0, NULL),
(1026, 1003, 'Suwan', 'Fernando', 'suwa.n.ratnayak.e@gmail.com', '$2a$10$FqRUYCmePez4G9idFhhbO.HWrq5BYLwPWfMCkGIq/d/suouBvdrkG', '94779124893', 1, 0, NULL),
(1027, 1000, 'Sudath', 'Perera', 'sudath.perera@dialyzeease.org', '$2a$10$Be232apAPq/aaBNTzuZIBu65hXBBSSVSwOsKVQ5LSOm8kHoiKdy2e', '94777278824', 1, 0, NULL),
(1028, 1002, 'Dr.', 'A.L.M. Nazar', 'alm.nazar@gmail.com', '$2a$10$QBlUq7SRqA3TcnBS4zktwONrAAVTieyEQiYkLKFa6EITcp8M/3rNS', '0777278832', 1, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_appointments_schedule_session_id` (`schedule_session_id`),
  ADD KEY `idx_appointments_bed_id` (`bed_id`),
  ADD KEY `idx_appointments_patient_id` (`patient_id`),
  ADD KEY `idx_appointments_staff_id` (`staff_id`),
  ADD KEY `idx_appointments_doctor_id` (`doctor_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_logs_changed_by_id` (`changed_by_id`);

--
-- Indexes for table `beds`
--
ALTER TABLE `beds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_beds_center_id` (`center_id`);

--
-- Indexes for table `centers`
--
ALTER TABLE `centers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_centers_name` (`name`),
  ADD KEY `idx_centers_manage_by_id` (`manage_by_id`);

--
-- Indexes for table `center_hours`
--
ALTER TABLE `center_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_center_hours_center_id` (`center_id`);

--
-- Indexes for table `center_users`
--
ALTER TABLE `center_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_center_users_center_id` (`center_id`),
  ADD KEY `idx_center_users_user_id` (`user_id`);

--
-- Indexes for table `ckd_records`
--
ALTER TABLE `ckd_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ckd_records_patient_id` (`patient_id`),
  ADD KEY `idx_ckd_records_recorded_by_id` (`recorded_by_id`);

--
-- Indexes for table `ckd_stages`
--
ALTER TABLE `ckd_stages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dialysis_histories`
--
ALTER TABLE `dialysis_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dialysis_histories_appointment_id` (`appointment_id`),
  ADD KEY `idx_dialysis_histories_patient_id` (`patient_id`),
  ADD KEY `idx_dialysis_histories_staff_id` (`staff_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_doctors_user_id` (`user_id`);

--
-- Indexes for table `education_materials`
--
ALTER TABLE `education_materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_recipient_id` (`recipient_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_patients_user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `schedule_sessions`
--
ALTER TABLE `schedule_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_schedule_sessions_center_id` (`center_id`),
  ADD KEY `idx_schedule_sessions_session_id` (`session_id`),
  ADD KEY `idx_schedule_sessions_created_by_id` (`created_by_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sessions_center_id` (`center_id`),
  ADD KEY `idx_sessions_doctor_id` (`doctor_id`),
  ADD KEY `idx_sessions_created_by_id` (`created_by_id`);

--
-- Indexes for table `session_beds`
--
ALTER TABLE `session_beds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_session_beds_schedule_session_id` (`schedule_session_id`),
  ADD KEY `idx_session_beds_bed_id` (`bed_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_staff_user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `beds`
--
ALTER TABLE `beds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `centers`
--
ALTER TABLE `centers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `center_hours`
--
ALTER TABLE `center_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT for table `center_users`
--
ALTER TABLE `center_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ckd_records`
--
ALTER TABLE `ckd_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ckd_stages`
--
ALTER TABLE `ckd_stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dialysis_histories`
--
ALTER TABLE `dialysis_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `education_materials`
--
ALTER TABLE `education_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1004;

--
-- AUTO_INCREMENT for table `schedule_sessions`
--
ALTER TABLE `schedule_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `session_beds`
--
ALTER TABLE `session_beds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=867;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1029;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`schedule_session_id`) REFERENCES `schedule_sessions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`bed_id`) REFERENCES `beds` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `appointments_ibfk_5` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`changed_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `beds`
--
ALTER TABLE `beds`
  ADD CONSTRAINT `beds_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `centers`
--
ALTER TABLE `centers`
  ADD CONSTRAINT `fk_centers_manage_by` FOREIGN KEY (`manage_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `center_hours`
--
ALTER TABLE `center_hours`
  ADD CONSTRAINT `center_hours_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `center_users`
--
ALTER TABLE `center_users`
  ADD CONSTRAINT `center_users_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `center_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `ckd_records`
--
ALTER TABLE `ckd_records`
  ADD CONSTRAINT `ckd_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `ckd_records_ibfk_2` FOREIGN KEY (`recorded_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `dialysis_histories`
--
ALTER TABLE `dialysis_histories`
  ADD CONSTRAINT `dialysis_histories_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `dialysis_histories_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `dialysis_histories_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `schedule_sessions`
--
ALTER TABLE `schedule_sessions`
  ADD CONSTRAINT `schedule_sessions_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `schedule_sessions_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `schedule_sessions_ibfk_3` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `sessions_ibfk_3` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `session_beds`
--
ALTER TABLE `session_beds`
  ADD CONSTRAINT `session_beds_ibfk_1` FOREIGN KEY (`schedule_session_id`) REFERENCES `schedule_sessions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `session_beds_ibfk_2` FOREIGN KEY (`bed_id`) REFERENCES `beds` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
