export interface IAuthor {
    author_id: number;
    name: string;
    slug: string;
    total: number;
}

export interface IAdminAuthor {
    author_id: number;
    name: string;
    slug: string;
    state: number;
    update_at: Date | null;
}

export interface IAdminAuthorPage {
    authors: IAdminAuthor[];
    total: number;
}

export interface IFormAuthor {
    author_id?: number;
    name: string;
    slug: string;
    state: number;
}