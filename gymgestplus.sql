-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-10-2025 a las 06:21:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gymgestplus`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clienteacom`
--

CREATE TABLE `clienteacom` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `condicionesmedicas` varchar(255) DEFAULT NULL,
  `trainingob` varchar(255) DEFAULT NULL,
  `antropometrics` text DEFAULT NULL,
  `trainingplan` text DEFAULT NULL,
  `assignedcoach` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clienteacom`
--

INSERT INTO `clienteacom` (`id`, `name`, `email`, `edad`, `sexo`, `condicionesmedicas`, `trainingob`, `antropometrics`, `trainingplan`, `assignedcoach`, `created_at`) VALUES
(3, 'asdasddasadsasdds', 'oi12983123i@gmail.com', 20, 'Femenino', '123123123', '123123123123', '12312321', '1233123123123', 'el dylan', '2025-10-23 01:36:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientebasico`
--

CREATE TABLE `clientebasico` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `condicionesmedicas` varchar(255) DEFAULT NULL,
  `trainingob` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientebasico`
--

INSERT INTO `clientebasico` (`id`, `name`, `email`, `edad`, `sexo`, `condicionesmedicas`, `trainingob`, `created_at`) VALUES
(4, 'dassdaasd', 'ddasdasdasd@gmail.com', 23, 'Masculino', 'todas', 'si', '2025-10-23 01:31:58'),
(5, 'Salomé', 'salito19009@gmail.com', 20, 'Femenino', '', '', '2025-10-23 03:47:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clienteperso`
--

CREATE TABLE `clienteperso` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `condicionesmedicas` varchar(255) DEFAULT NULL,
  `trainingob` varchar(255) DEFAULT NULL,
  `antropometrics` text DEFAULT NULL,
  `trainingplan` text DEFAULT NULL,
  `assignedcoach` varchar(50) DEFAULT NULL,
  `eatplan` text DEFAULT NULL,
  `drugplan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clienteperso`
--

INSERT INTO `clienteperso` (`id`, `name`, `email`, `edad`, `sexo`, `condicionesmedicas`, `trainingob`, `antropometrics`, `trainingplan`, `assignedcoach`, `eatplan`, `drugplan`, `created_at`, `peso`, `altura`) VALUES
(2, 'hola', 'dasdasdasdasdasdasdas123@gmail.com', 20, 'Masculino', 'todaas', 'mejorar', 'hola', 'hola', 'el dylan', 'si', 'no', '2025-10-23 00:49:11', NULL, NULL),
(3, 'ofsprin', 'ofrprinoficial@gmail.com', 30, 'Masculino', 'todas', 'si', 'no', 'hola', 'el dylan', 'si', 'hola', '2025-10-23 01:13:58', 70.00, 170.00),
(4, 'Jose Luis', 'mellamojose@gmail.com', 20, 'Femenino', 'adsasdads', 'asddasda', 'adsasdd', 'addas', 'el dylan', 'adasdd', 'adasdasd', '2025-10-23 01:15:42', 70.00, 170.00),
(5, 'wdsdaasdasda', 'adsasdasd@gmail.com', 56, 'Masculino', 'asdasd', 'asdadsasd', 'asddasasd', 'asdasdasdasddas', 'nilson', 'asdasdasd', 'asdasdasd', '2025-10-23 01:23:20', 70.00, 180.00),
(6, 'Jose Luis', 'mellamojose@gmail.com', 20, 'Masculino', 'dasdasd', 'asdasdasd', 'asdasdas', 'dasdasdasdasd', 'el dylan', 'asdasdasd', 'asdasdasdas', '2025-10-23 01:39:47', 70.00, 170.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientesemi`
--

CREATE TABLE `clientesemi` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `condicionesmedicas` varchar(255) DEFAULT NULL,
  `trainingob` varchar(255) DEFAULT NULL,
  `antropometrics` text DEFAULT NULL,
  `trainingplan` text DEFAULT NULL,
  `assignedcoach` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `eatplan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientesemi`
--

INSERT INTO `clientesemi` (`id`, `name`, `email`, `edad`, `sexo`, `condicionesmedicas`, `trainingob`, `antropometrics`, `trainingplan`, `assignedcoach`, `created_at`, `peso`, `altura`, `eatplan`) VALUES
(1, 'Jose Luis', 'mellamojose@gmail.com', 20, 'Masculino', 'asdsad', 'asddasdsdas', 'asdasdasd', 'asdasdasdasd', 'el dylan', '2025-10-23 01:46:14', 70.00, 170.00, '4234234234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenador`
--

CREATE TABLE `entrenador` (
  `id_entrenador` int(11) NOT NULL,
  `Nombre_Entrenador` varchar(100) NOT NULL,
  `username` varchar(16) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expiry` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrenador`
--

INSERT INTO `entrenador` (`id_entrenador`, `Nombre_Entrenador`, `username`, `Correo`, `password`, `reset_token`, `token_expiry`) VALUES
(10, 'Wholesome', 'Wholesome', 'Wholesome@gmail.com', '$2b$10$j/LAFNQT/jj2W.P9tSgUaO0VrDT7Y3qRYzV4q3oGnzw2oMpB1sb3e', NULL, NULL),
(11, 'Hola ', 'Hola', 'nathanriotgames@gmail.com', '$2b$10$rjCvwamoQtlJxLvf/hKEhOQERbITvfK2sGwz1kP6DKHEdVq3iCSka', NULL, NULL),
(13, 'Salomé', 'Salo', 'salito19009@gmail.com', '$2b$10$bivsyJZw5GUxQP139dQ7TehqyDrmMSGteqys.Mr5m1PH0ysoo2OnO', NULL, NULL),
(14, 'Jorge', 'Jorge', 'jorgesolisarevalogato2017@gmail.com', '$2b$10$pK7Y5Z4Kuuhf941RHID4X.QVWnH.8P2WmoCVjZHGPJzYYgExVrnb.', NULL, NULL),
(15, 'dasda', 'dylan', 'dylanrojas072017@gmail.com', '$2b$10$6f7XJQF9qW2eQjn1.bgg4.Ah4z3t0uW0oE.OFPVdKG3ym6zzL99qO', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clienteacom`
--
ALTER TABLE `clienteacom`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientebasico`
--
ALTER TABLE `clientebasico`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clienteperso`
--
ALTER TABLE `clienteperso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientesemi`
--
ALTER TABLE `clientesemi`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  ADD PRIMARY KEY (`id_entrenador`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clienteacom`
--
ALTER TABLE `clienteacom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientebasico`
--
ALTER TABLE `clientebasico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clienteperso`
--
ALTER TABLE `clienteperso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `clientesemi`
--
ALTER TABLE `clientesemi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  MODIFY `id_entrenador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
