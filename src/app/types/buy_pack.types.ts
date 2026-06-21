export interface IBuyPack {
    user_id: number;
    pack_id: number;
}


export interface IPayPalToken {
    scope: string
    access_token: string
    token_type: string
    app_id: string
    expires_in: number
    nonce: string
}

export interface IPayPalCheckOrder {
    id: string
    status: string
    links: IPayPalCheckOrderLink[]
}

export interface IPayPalCheckOrderLink {
    href: string
    rel: string
    method: string
}
