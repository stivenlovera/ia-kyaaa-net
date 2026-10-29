-- Nueva relación pack -> state_pack: un catálogo de estados de pack (además del
-- flag booleano existente pack.state), a completar según los estados que se
-- necesiten (p. ej. borrador, publicado, archivado). Ver prisma/schema.prisma
-- (modelo State_Pack) y src/app/repositories/pack.repository.ts.
--
-- Ejecutar una sola vez sobre una base que aún no tenga pack.state_pack_id.
-- state_pack_id queda opcional (NULL) para no romper los packs existentes;
-- no se seedean filas en state_pack porque los nombres de estado aún no están definidos.

CREATE TABLE `state_pack` (
  `state_pack_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`state_pack_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `pack`
  ADD COLUMN `state_pack_id` int DEFAULT NULL AFTER `state`,
  ADD KEY `state_pack_id` (`state_pack_id`),
  ADD CONSTRAINT `pack_ibfk_1` FOREIGN KEY (`state_pack_id`) REFERENCES `state_pack` (`state_pack_id`);
