export default {
    name: 'achievement',
    title: 'Achievement',
    type: 'document',
    fields: [
        {
            name: 'date',
            title: 'Fecha',
            type: 'string',
        },
        {
            name: 'position',
            title: 'Posicion',
            type: 'string',
        },
        {
            name: 'tournament',
            title: 'Torneo',
            type: 'string',
        },
        {
            name: 'game', 
            title: 'Juego',
            type: 'reference',
            weak: true,
            to: [{type: 'game'}],
        },
    ],
    preview: {
        select: {
            title: 'tournament',
            subtitle: 'date',
            media: 'game.logo'
        },
    },
}