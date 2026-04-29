export interface IPack {
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
