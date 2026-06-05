export interface INewPacks {
    name: string;
    code: string;
    pack_id: number;
    description: string;
    pages: {
        page_size: {
            size: {
                name: string;
                extension: string;
            };
        }[];
        num: string;
    }[];
}

export interface INewPacksAuth extends INewPacks {
    buy: boolean
    like: boolean
    favorite: boolean
}
