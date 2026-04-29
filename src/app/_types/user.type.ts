export interface JWTPayload {
    user_id: number;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'moderator';
}

export interface IUser {
    user_id: number
    email: string
    name: string
    nick: string
    password: string
    create_at?: Date
    update_at?: Date
}

/* export interface IFormLogin {
    email: string
    password: string
}

export const initialStateFormLogin: IFormLogin = {
    email: 'stivenlovera@gmail.com',
    password: 'molomix654'
} */

export interface IErrorsFormRegister {
    name?: string | null
    email?: string | null
    password?: string | null
    confirm_password?: string | null
    term_use?: string | null
}

export interface IFieldsFormRegister {
    name?: string
    email?: string 
    password?: string 
    confirm_password?: string
    term_use?: boolean
}

export interface IFormRegister {
    errors?: IErrorsFormRegister
    success: boolean
    fields: IFieldsFormRegister
}

export const initialStateFormRegister: IFormRegister = {
    errors: {},
    success: false,
    fields: {
        name: 'ali stiven lovera huarachi',
        email: 'stivenlovera@gmail.com',
        password: '12345',
        confirm_password: '12345',
        term_use: true,
    }
}

export interface IErrorsFormLogin {
    email?: string | null
    password?: string | null
}

export interface IFieldsFormLogin {
    email?: string 
    password?: string 
}

export interface IFormLogin {
    errors?: IErrorsFormLogin
    success: boolean
    fields: IFieldsFormLogin
}


export const initialStateFormLogin: IFormLogin = {
    errors: {},
    success: false,
    fields: {
        email: "stivenlovera@gmail.com",
        password: "12345"
    },
}
