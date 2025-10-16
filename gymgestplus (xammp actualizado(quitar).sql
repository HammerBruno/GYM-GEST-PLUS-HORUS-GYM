-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-10-2025 a las 21:08:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `entrenador`
--

CREATE TABLE `entrenador` (
  `id_entrenador` int(11) NOT NULL,
  `Nombre_Entrenador` varchar(100) NOT NULL,
  `username` varchar(16) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrenador`
--

INSERT INTO `entrenador` (`id_entrenador`, `Nombre_Entrenador`, `username`, `Correo`, `password`, `reset_token`, `token_expiry`) VALUES
(6, 'dylan', 'DylanRojas7', 'dylanrojas072017@gmail.com', '$2b$10$Dl4wWSJF9Ntmt6GkGde2R./n5AuEWyg4oXMlX1Crfq.Oil.syCgo.', NULL, NULL),
(7, 'angela ', 'gise', 'gisefonseca@hotmail.com', '$2b$10$fwPCTgQn9iAbLTjpXoSoAuoPfTG2e3qdCNme2nd6ARq..dnFGDBY.', '69ec47cd771f9cabc24ab1074761501cd4ab4f281d44329521cad54c1dc4b38c', '2025-10-06 14:26:11'),
(9, 'angelaasd', 'fdsfsdg', 'gisefonseca@hotmail.comfdsf', '$2b$10$ys4iURjK1hXT56w4yaTcqu3V0tmz2eY560k3TRyGmsmNybc5IYW9O', NULL, NULL),
(10, 'dfsfsd', 'dsfsdg', 'sadas@ds', '$2b$10$Pbm212MhmyShGvNABb95MOq/vopZ.mc67j8WSzoPe.U9vZQphHS4W', NULL, NULL),
(11, 'luia', 'luisa', 'asd@luisa', '$2b$10$2kqtxWEr1eU0EUq.ERgUNOBZa0kptrcn80gcRv8dFzogGg74dMgLu', NULL, NULL),
(12, 'fdsfas', 'dasf', 'asdas@dfsdfsdg', '$2b$10$/43xKPqrUoTT52raBIOHjOi5lf/lYdU78BJpRh3.KKoJ78Qw90hbO', NULL, NULL);

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `entrenador`
--
ALTER TABLE `entrenador`
  MODIFY `id_entrenador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
