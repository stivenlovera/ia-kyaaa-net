// Ids de las tablas `page_type` y `type` (ver data-base/population.sql, sección #POBLACION).
export const PAGE_TYPE = {
    FREE: 1,
    BUY: 2,
} as const;

export const PACK_TYPE = {
    PAID: 1,
    FREE: 2,
} as const;

// Ids de la tabla `state_pack` (ver data-base/population.sql).
export const STATE_PACK = {
    PUBLISHED: 1,
    COMING_SOON: 2,
    DRAFT: 3,
} as const;
