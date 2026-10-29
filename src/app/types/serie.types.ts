export interface ISerie {
    serie_id: number;
    name: string;
    slug: string;
    total: number;
}

export interface IAdminSerie {
    serie_id: number;
    name: string;
    slug: string;
    state: number;
    update_at: Date | null;
}

export interface IAdminSeriePage {
    series: IAdminSerie[];
    total: number;
}

export interface IFormSerie {
    serie_id?: number;
    name: string;
    slug: string;
    state: number;
}