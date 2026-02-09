export interface IPack {
    name: string;
    pack_id: number;
    description: string;
    code: string;
    pages: {
        url_tumb: string;
        url_premium: string;
    }[];
} 