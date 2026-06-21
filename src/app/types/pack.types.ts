import { ICountTag } from "../[locale]/pack/_components/card-section";
import { IPage } from "./page.types";

export interface IListPacks {
    name: string;
    code: string;
    pack_id: number;
    description: string;
    portada: {
        num: string,
        extension: string
        name: string
    }
}

export interface INewPacksAuth extends IListPacks {
    buy: boolean
    like: boolean
    favorite: boolean
}


export interface IPackInfo {
    name: string
    description: string
    pack_id: number
    code: string
    price_list: number
    update_at: Date | null
    portada: {
        num: string,
        extension: string
        name: string
    }
    pack_serie: PackSerie[]
    pack_types: PackType[]
    pack_character: PackCharacter[]
    pack_label: PackLabel[]
    pack_authors: PackAuthor[]
    pack_languages: PackLanguage[]
}

export interface IPackInfoPage extends IPackInfo {
    total_characters: ICountTag[] | null
    total_series: ICountTag[] | null
    total_labels: ICountTag[] | null
    total_authors: ICountTag[] | null
    pages: IPage[]
    buy: boolean
    like: boolean
    favorite: boolean
}

export interface Page {
    num: string
    page_size: PageSize[]
}

export interface PageSize {
    size: Size
}

export interface Size {
    extension: string
    name: string
}

export interface PackSerie {
    serie: Serie
}

export interface Serie {
    name: string
    serie_id: number
}

export interface PackType {
    type: Type
}

export interface Type {
    name: string
    type_id: number
}

export interface PackCharacter {
    character: Character
}

export interface Character {
    name: string
    character_id: number
}

export interface PackLabel {
    label: Label
}

export interface Label {
    name: string
    label_id: number
}

export interface PackAuthor {
    author: Author
}

export interface Author {
    name: string
    author_id: number
}

export interface PackLanguage {
    language: Language
}

export interface Language {
    name: string
    language_id: number
}