export default {
    name: 'game',
    title: 'Game',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Nombre',
            type: 'string',
        },
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
        },
    ],
    preview: {
        select: {
            title: 'name',
            media: 'logo',
        },
    },
}