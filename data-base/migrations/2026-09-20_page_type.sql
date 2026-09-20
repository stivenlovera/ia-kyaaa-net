-- Acceso por página: cada página es gratis (page_type 1) o de pago (page_type 2).
-- Un pack de pago muestra solo sus páginas gratis hasta que el usuario compra;
-- un pack gratuito (pack_type 2) muestra todas. Ver src/app/repositories/pages.repository.ts.
--
-- Ejecutar una sola vez sobre una base que aún no tenga page.page_type_id.

ALTER TABLE `page`
  ADD COLUMN `page_type_id` int NOT NULL DEFAULT 2 AFTER `num`,
  ADD KEY `page_type_id` (`page_type_id`),
  ADD CONSTRAINT `page_ibfk_2` FOREIGN KEY (`page_type_id`) REFERENCES `page_type` (`page_type_id`),
  ADD UNIQUE KEY `uq_page_pack_num` (`pack_id`, `num`);

-- Pack 1 "te encontre": gratuito, todas sus páginas son gratis.
UPDATE `pack_type` SET `type_id` = 2 WHERE `pack_id` = 1;
UPDATE `page` SET `page_type_id` = 1 WHERE `pack_id` = 1;

-- Pack 2 "nicoAnal": de pago, solo estas páginas son gratis.
UPDATE `page` SET `page_type_id` = 1
 WHERE `pack_id` = 2
   AND CAST(`num` AS UNSIGNED) IN (1,2,4,5,8,9,15,16,19,20,22,24,28,30,36,39,40,43,46,48,51,52,56,59);
