export default {
    name: 'home',
    title: 'Home',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Título',
            type: 'string',
        },
        {
            name: 'heroImage',
            title: 'Imagen Hero Desktop (1920 x 1080)',
            type: 'image',
        },
        {
            name: 'heroImageMob',
            title: 'Imagen Hero Mobile (1280 x 720)',
            type: 'image',
        },
        {
            name: 'titleCTA',
            title: 'Título Botón CTA',
            type: 'string'
        },
        {
            name: 'localRedirect',
            title: 'Redirección local',
            type: 'boolean'
        },
        {
            name: 'urlCTA',
            title: 'Redireccón Botón CTA',
            type: 'string'
        }
    ],
}