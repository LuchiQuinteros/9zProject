export default {
    name: 'match',
    title: 'Match',
    type: 'document',
    fields: [
        {
            name: 'date',
            title: 'Fecha',
            type: 'string',
        },
        {
            name: 'time',
            title: 'Hora',
            type: 'string',
        },
        {
            name: 'tournament',
            title: 'Torneo',
            type: 'string',
        },
        {
            name: 'team1',
            title: 'Equipo1',
            type: 'reference',
            weak: true,
            to: [{type: 'team'}]
        },
        {
            name: 'team2',
            title: 'Equipo2',
            type: 'reference',
            weak: true,
            to: [{type: 'team'}]
        },
        {
            name: 'game', 
            title: 'Juego',
            type: 'reference',
            weak: true,
            to: [{type: 'game'}],
        },
        {
            name: 'result1',
            title: 'Resultado equipo 1',
            type: 'string',
            initialValue: '0',
        },
        {
            name: 'result2',
            title: 'Resultado equipo 2',
            type: 'string',
            initialValue: '0'
        },
        {
            name: 'teamMember', 
            title: 'Jugador',
            type: 'reference',
            weak: true,
            to: [{type: 'teamMember'}],
        },
        {
            name: 'position',
            title: 'Posición',
            type: 'string',
        },
        {
            name: 'streamUrl',
            title: 'Url de Transmisión',
            type: 'string',
        }
    ],
    preview: {
        select: {
            title: 'date',
            subtitle: 'time',
            media: 'game.logo'
        },
    },
}