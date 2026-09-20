export interface IPagePack {
    name: string,
    description: string,
    pack_id: number,
    code: string,
    pages: IPage[]
    /** Total de páginas del pack, incluidas las bloqueadas para este usuario. */
    total: number
    /** Páginas gratis del pack (todas si el pack es gratuito). */
    free: number
    /** El pack es gratuito (pack_type gratis). */
    is_free: boolean
    /** true si el usuario ve todo el pack (pack gratuito o comprado). */
    full_access: boolean
}

export interface IPage {
    num: string
    page_size: IPageSize[]
}

export interface IPageSize {
    size: ISize
}

export interface ISize {
    name: string
    extension: string
}

export interface Size {
    name: "tumb" | "medium" | "web" | "premium-web" | "meta"
}