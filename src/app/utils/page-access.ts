// Ids de las tablas `page_type` y `type` (ver data-base/schema.sql, sección #POBLACION).
export const PAGE_TYPE = {
    FREE: 1,
    BUY: 2,
} as const;

export const PACK_TYPE = {
    PAID: 1,
    FREE: 2,
} as const;
