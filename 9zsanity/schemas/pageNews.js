export default {
    name: 'pageNews',
    title: 'Página de noticias',
    type: 'document',
    fields: [
      {
          name: 'heroImage',
          title: 'Imagen Hero Desktop (1920 x 1080)',
          type: 'image',
      },
      {
        name: 'heroNews',
        title: 'Noticias del Hero',
        type: 'reference',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [
              { type: 'news', title: 'Noticia' }
            ]
          }
        ]
      },
      {
        name: 'featuredNews',
        title: 'Noticias destacadas (Solo 3)',
        type: 'reference',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [
              { type: 'news', title: 'Noticia' }
            ]
          }
        ]
      },
      {
        name: 'bannerNew', 
        title: 'Noticia de Banner',
        type: 'reference',
        weak: true,
        to: [{type: 'news'}],
      },
    ],
    preview: {
      media: 'heroImage',
    },
}