export interface ListMenu {
    name: string
    url: string
}
export const initialStateMenu: ListMenu[] = [
    {
        name: 'Nuevo',
        url: '/'
    },
    {
        name: 'Galeria',
        url: '/galery'
    },
    {
        name: 'Vota y participa',
        url: '/participate'
    },
   
    /* {
        name: 'Favoritos',
        url: ''
    },
    {
        name: 'Notificaciones',
        url: ''
    } */
]