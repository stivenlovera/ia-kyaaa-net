export interface IPack {
    pack_id: number;
    name: string;
    description: string;
    code: string;
    pages: {
        num: string;
        page_size: {
            size: {
                name: string;
                extension: string;
            };
        }[];
    }[];
}