-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: plcmonitor
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alarmas`
--

DROP TABLE IF EXISTS `alarmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarmas` (
  `id_alarma` int NOT NULL AUTO_INCREMENT,
  `id_elevador` int NOT NULL,
  `codigo_alarma` varchar(30) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text,
  `nivel` enum('media','alta','critica') NOT NULL,
  `estado` enum('activa','atendida','cerrada') NOT NULL DEFAULT 'activa',
  `fecha_inicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  `atendida_por` int DEFAULT NULL,
  `comentarios` text,
  PRIMARY KEY (`id_alarma`),
  KEY `id_elevador` (`id_elevador`),
  KEY `atendida_por` (`atendida_por`),
  CONSTRAINT `alarmas_ibfk_1` FOREIGN KEY (`id_elevador`) REFERENCES `elevadores` (`id_elevador`),
  CONSTRAINT `alarmas_ibfk_2` FOREIGN KEY (`atendida_por`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarmas`
--

LOCK TABLES `alarmas` WRITE;
/*!40000 ALTER TABLE `alarmas` DISABLE KEYS */;
INSERT INTO `alarmas` VALUES (1,1,'AL-001','Alarma de falla','Se detecto una falla en el sistema del elevador.','alta','activa','2026-07-13 10:34:43',NULL,NULL,NULL),(2,1,'AL-002','Error de comunicacion','No se ha podido establecer comunicacion con el PLC.','critica','atendida','2026-07-13 10:34:43',NULL,5,'Se reinicio la conexion y se restablecio el servicio.'),(3,1,'AL-003','Modo mantenimiento','El elevador ingreso a modo mantenimiento.','media','cerrada','2026-07-13 10:34:43',NULL,2,'Mantenimiento preventivo finalizado.');
/*!40000 ALTER TABLE `alarmas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elevadores`
--

DROP TABLE IF EXISTS `elevadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elevadores` (
  `id_elevador` int NOT NULL AUTO_INCREMENT,
  `nombre_elevador` varchar(100) NOT NULL,
  `ubicacion` varchar(150) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `estado_general` enum('activo','detenido','mantenimiento','falla') NOT NULL DEFAULT 'activo',
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_elevador`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elevadores`
--

LOCK TABLES `elevadores` WRITE;
/*!40000 ALTER TABLE `elevadores` DISABLE KEYS */;
INSERT INTO `elevadores` VALUES (1,'Elevador A','Edificio principal - Planta baja','Elevador principal de monitoreo','activo','2026-07-13 10:34:43');
/*!40000 ALTER TABLE `elevadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `id_elevador` int NOT NULL,
  `tipo_evento` varchar(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text,
  `prioridad` enum('baja','media','alta','critica') NOT NULL DEFAULT 'baja',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `registrado_por` int DEFAULT NULL,
  `origen` varchar(50) DEFAULT 'sistema',
  PRIMARY KEY (`id_evento`),
  KEY `id_elevador` (`id_elevador`),
  KEY `registrado_por` (`registrado_por`),
  CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_elevador`) REFERENCES `elevadores` (`id_elevador`),
  CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,1,'estado','Inicio de operacion','El elevador inicio su operacion correctamente.','baja','2026-07-13 10:34:43',5,'sistema'),(2,1,'evento','Nuevo recorrido registrado','Se completo un recorrido del piso 1 al piso 3.','baja','2026-07-13 10:34:43',1,'PLC'),(3,1,'mantenimiento','Modo mantenimiento activado','El elevador fue colocado temporalmente en modo mantenimiento.','media','2026-07-13 10:34:43',2,'sistema'),(4,1,'alarma','Falla detectada','Se detecto una anomalia en el sistema de puertas.','alta','2026-07-13 10:34:43',2,'PLC'),(5,1,'sistema','Perdida de comunicacion','Se perdio momentaneamente la comunicacion con el PLC.','critica','2026-07-13 10:34:43',5,'sistema');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intentos_acceso`
--

DROP TABLE IF EXISTS `intentos_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intentos_acceso` (
  `id_intento` int NOT NULL AUTO_INCREMENT,
  `username_ingresado` varchar(50) NOT NULL,
  `ip_origen` varchar(45) DEFAULT NULL,
  `resultado` enum('exitoso','fallido') NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `detalle` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_intento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intentos_acceso`
--

LOCK TABLES `intentos_acceso` WRITE;
/*!40000 ALTER TABLE `intentos_acceso` DISABLE KEYS */;
INSERT INTO `intentos_acceso` VALUES (1,'operador1','192.168.1.10','exitoso','2026-07-13 10:34:43','Inicio de sesion correcto'),(2,'admin1','192.168.1.20','exitoso','2026-07-13 10:34:43','Inicio de sesion correcto'),(3,'usuario_invalido','192.168.1.30','fallido','2026-07-13 10:34:43','Credenciales incorrectas');
/*!40000 ALTER TABLE `intentos_acceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturas_plc`
--

DROP TABLE IF EXISTS `lecturas_plc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecturas_plc` (
  `id_lectura` bigint NOT NULL AUTO_INCREMENT,
  `id_elevador` int NOT NULL,
  `id_variable` int NOT NULL,
  `valor_texto` varchar(100) DEFAULT NULL,
  `valor_numerico` decimal(10,2) DEFAULT NULL,
  `valor_booleano` tinyint(1) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `origen_dato` varchar(50) DEFAULT 'PLC',
  PRIMARY KEY (`id_lectura`),
  KEY `id_elevador` (`id_elevador`),
  KEY `id_variable` (`id_variable`),
  CONSTRAINT `lecturas_plc_ibfk_1` FOREIGN KEY (`id_elevador`) REFERENCES `elevadores` (`id_elevador`),
  CONSTRAINT `lecturas_plc_ibfk_2` FOREIGN KEY (`id_variable`) REFERENCES `variables_plc` (`id_variable`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturas_plc`
--

LOCK TABLES `lecturas_plc` WRITE;
/*!40000 ALTER TABLE `lecturas_plc` DISABLE KEYS */;
INSERT INTO `lecturas_plc` VALUES (1,1,1,NULL,3.00,NULL,'2026-07-13 10:34:43','PLC'),(2,1,2,'subiendo',NULL,NULL,'2026-07-13 10:34:43','PLC'),(3,1,3,'cerradas',NULL,NULL,'2026-07-13 10:34:43','PLC'),(4,1,4,NULL,4.80,NULL,'2026-07-13 10:34:43','PLC'),(5,1,5,'activo',NULL,NULL,'2026-07-13 10:34:43','PLC'),(6,1,6,NULL,NULL,1,'2026-07-13 10:34:43','PLC'),(7,1,7,NULL,NULL,0,'2026-07-13 10:34:43','PLC');
/*!40000 ALTER TABLE `lecturas_plc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_elevador` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `prioridad` enum('baja','media','alta','critica') NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_elevador` (`id_elevador`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_elevador`) REFERENCES `elevadores` (`id_elevador`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,1,1,'Estado','Elevador en funcionamiento','El elevador inicio su operacion correctamente y se encuentra disponible para su monitoreo.','baja',0,'2026-07-13 10:34:43'),(2,2,1,'Alarma','Alarma de falla','Se detecto una falla en el sistema del elevador. Se recomienda revisar el historial de eventos y realizar una inspeccion.','alta',0,'2026-07-13 10:34:43'),(3,3,1,'Mantenimiento','Mantenimiento activo','El elevador ha sido colocado en modo mantenimiento. Algunas funciones permanecen deshabilitadas mientras dure esta condicion.','media',1,'2026-07-13 10:34:43'),(4,5,1,'Sistema','Error de comunicacion','No se ha podido establecer comunicacion con el PLC. Verifique la conexion y el estado del controlador.','critica',0,'2026-07-13 10:34:43'),(5,5,1,'Sistema','Error del sistema','Se presento un problema al acceder a la base de datos. Intente nuevamente o contacte al administrador.','alta',0,'2026-07-13 10:34:43');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `nivel_acceso` varchar(20) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Operador','Monitorea estado en tiempo real y alarmas','basico'),(2,'Tecnico de mantenimiento','Revisa fallas, historial y diagnostico','medio'),(3,'Supervisor de operaciones','Consulta indicadores y desempeno general','medio'),(4,'Ingeniero de automatizacion','Analiza variables PLC y tendencias','medio-alto'),(5,'Administrador del sistema','Gestiona usuarios, roles, parametros y seguridad','alto');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `correo` varchar(120) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `username` (`username`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan','Lopez','Martinez','juan.operador@plcmonitor.com','operador1','hash_demo_123',1,'activo','2026-07-13 10:34:43',NULL),(2,'Maria','Hernandez','Soto','maria.mantenimiento@plcmonitor.com','mantenimiento1','hash_demo_123',2,'activo','2026-07-13 10:34:43',NULL),(3,'Carlos','Ramirez','Diaz','carlos.supervisor@plcmonitor.com','supervisor1','hash_demo_123',3,'activo','2026-07-13 10:34:43',NULL),(4,'Ana','Torres','Gomez','ana.automatizacion@plcmonitor.com','ingeniero1','hash_demo_123',4,'activo','2026-07-13 10:34:43',NULL),(5,'Luis','Fernandez','Ruiz','luis.admin@plcmonitor.com','admin1','hash_demo_123',5,'activo','2026-07-13 10:34:43',NULL),(6,'Osmar','Olmedo','Rdz','osmar@admin.com','Admin2','1234',6,'activo','2026-07-16 00:00:00',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variables_plc`
--

DROP TABLE IF EXISTS `variables_plc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variables_plc` (
  `id_variable` int NOT NULL AUTO_INCREMENT,
  `nombre_variable` varchar(100) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `tipo_dato` enum('entero','decimal','booleano','texto') NOT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_variable`),
  UNIQUE KEY `nombre_variable` (`nombre_variable`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variables_plc`
--

LOCK TABLES `variables_plc` WRITE;
/*!40000 ALTER TABLE `variables_plc` DISABLE KEYS */;
INSERT INTO `variables_plc` VALUES (1,'posicion_actual','Piso actual del elevador','entero','piso','posicion',1),(2,'direccion_movimiento','Direccion actual del elevador','texto',NULL,'movimiento',1),(3,'estado_puertas','Estado actual de las puertas','texto',NULL,'puertas',1),(4,'tiempo_recorrido','Tiempo de recorrido entre pisos','decimal','seg','rendimiento',1),(5,'estado_operacion','Estado general de operacion','texto',NULL,'estado',1),(6,'senal_seguridad','Estado de la senal de seguridad','booleano',NULL,'seguridad',1),(7,'modo_mantenimiento','Indica si el elevador esta en mantenimiento','booleano',NULL,'mantenimiento',1);
/*!40000 ALTER TABLE `variables_plc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-23 16:07:50
