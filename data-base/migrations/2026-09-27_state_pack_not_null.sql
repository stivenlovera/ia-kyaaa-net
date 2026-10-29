-- Completa 2026-09-27_state_pack.sql: asigna "publicado" (state_pack_id 1) a los packs
-- existentes y vuelve la columna obligatoria con ese mismo valor por defecto.
--
-- Ejecutar una sola vez, después de 2026-09-27_state_pack.sql, y con state_pack ya poblada
-- (ver data-base/population.sql) para que el id 1 exista.

UPDATE `pack` SET `state_pack_id` = 1;

-- MariaDB no permite MODIFY sobre una columna con FK activa (error 1832):
-- se quita la constraint, se cambia la columna y se vuelve a crear igual que antes.
ALTER TABLE `pack`
  DROP FOREIGN KEY `pack_ibfk_1`;

ALTER TABLE `pack`
  MODIFY COLUMN `state_pack_id` int NOT NULL DEFAULT '1';

ALTER TABLE `pack`
  ADD CONSTRAINT `pack_ibfk_1` FOREIGN KEY (`state_pack_id`) REFERENCES `state_pack` (`state_pack_id`);
