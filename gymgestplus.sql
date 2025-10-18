-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-10-2025 a las 21:43:08
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
(1, 'Dylan ', 'cuwajdms@gmail.com', 16, 'Masculino', 'lol', 'xd', NULL, NULL, NULL, '2025-10-18 16:44:20');

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
(1, 'Dylan ', 'dylanrojas072017@gmail.com', 16, 'Masculino', 'si', 'no', '2025-10-18 16:42:56'),
(2, 'hola', 'dreorweoro@gmail.com', 16, 'Masculino', 'weoweo', 'sdjsdjjd', '2025-10-18 18:55:04'),
(3, 'jose', 'dreorweoro@gmail.com', 20, 'Masculino', 'todas', 'ninguno', '2025-10-18 19:32:22');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clienteperso`
--

INSERT INTO `clienteperso` (`id`, `name`, `email`, `edad`, `sexo`, `condicionesmedicas`, `trainingob`, `antropometrics`, `trainingplan`, `assignedcoach`, `eatplan`, `drugplan`, `created_at`) VALUES
(1, 'asdasdasdasd', 'dasdasdasdasdasdasdas@gmail.com', 16, 'Masculino', 'si', 'no', 'link', 'link', 'link', 'link', 'link', '2025-10-18 19:34:35');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(8, 'Dylan', 'dylan', 'dylanrojas072017@gmail.com', '$2b$10$ZqG2UuqR/A1bHJbQVvyxlOcpAfouQGXx3w821pxtlw.9oI2QknqLq', NULL, NULL),
(9, 'hola', 'si', 'cuwajdms@gmail.com', '$2b$10$umRftKN8504FX9W2OpCbXOLCF5DxK3OgaFCFwWaYushyB4WyOgnOa', NULL, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `clientebasico`
--
ALTER TABLE `clientebasico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clienteperso`
--
ALTER TABLE `clienteperso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `clientesemi`
--
ALTER TABLE `clientesemi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  MODIFY `id_entrenador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
