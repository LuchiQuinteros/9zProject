export default {
    name: 'member',
    title: 'Member',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Nombre',
            type: 'string',
            readOnly: true,
        },
        {
            name: 'birthdate',
            title: 'Fecha de nacimiento',
            type: 'date',
            readOnly: true,
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            readOnly: true,
        },
        {
            name: 'nationality', 
            title: 'Nacionalidad',
            type: 'string',
            readOnly: true,
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
        },
    },
}