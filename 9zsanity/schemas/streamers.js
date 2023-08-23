export default {
    name: 'streamers',
    title: 'Streamers',
    type: 'document',
    fields: [
        {
            name: 'username',
            title: 'Nombre de usuario',
            type: 'string',
        },
    ],
    preview: {
        select: {
            title: 'username',
        },
    },
}