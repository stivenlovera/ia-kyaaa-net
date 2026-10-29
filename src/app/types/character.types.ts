export interface ICharacter {
    character_id: number;
    name: string;
    slug: string;
    total: number;
}

export interface IAdminCharacter {
    character_id: number;
    name: string;
    slug: string;
    state: number;
    update_at: Date | null;
}

export interface IAdminCharacterPage {
    characters: IAdminCharacter[];
    total: number;
}

export interface IFormCharacter {
    character_id?: number;
    name: string;
    slug: string;
    state: number;
}