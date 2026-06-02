export interface IPagePack {
    name: string,
    description: string,
    pack_id: number,
    code: string,
    pages: IPage[]
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