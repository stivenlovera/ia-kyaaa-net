export interface ILabel{
    label_id: number;
    name: string;
    slug: string;
    total: number;
}

export interface IAdminLabel {
    label_id: number;
    name: string;
    slug: string;
    state: number;
    update_at: Date | null;
}

export interface IAdminLabelPage {
    labels: IAdminLabel[];
    total: number;
}

export interface IFormLabel {
    label_id?: number;
    name: string;
    slug: string;
    state: number;
}