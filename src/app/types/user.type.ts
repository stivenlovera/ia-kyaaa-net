export interface IUser {
    id: number
    full_name: string
    nick: string
    email: string
    password: string
    remember_token: string | null
}