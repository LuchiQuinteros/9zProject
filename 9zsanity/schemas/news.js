export default {
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Fecha',
      type: 'string',
    },
    {
      name: 'cover_image',
      title: 'Imagen de portada',
      type: 'image',
    },
    {
      name: 'title',
      title: 'Titulo',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitulo',
      type: 'string',
    },
    {
      name: 'subheader',
      title: 'Bajada',
      type: 'blockContent',
    },
    {
      name: 'resume',
      title: 'Resumen',
      type: 'blockContent',
    },
    {
      name: 'content',
      title: 'Contenido',
      type: 'blockContent',
    },
    {
      name: 'readingTime',
      title: 'Tiempo de lectura',
      type: 'number',
    },
    {
      name: 'urlNew',
      title: 'Url de noticia',
      type: 'string',
    },
    {
      name: 'teamMember',
      title: 'Miembro de equipo',
      // A reference is a way to point to another document
      type: 'reference',
      weak: true,
      // This reference is only allowed to point to a document of the type person,
      // we could list more types, but let's keep this simple:
      to: [{type: 'teamMember'}]
    },
    {
      name: 'game', 
      title: 'Juego',
      type: 'reference',
      weak: true,
      to: [{type: 'game'}],
    },
      {
        name: 'category',
        title: 'Categoría',
        type: 'reference',
        weak: true,
        to: [{type: 'categoryNews'}]
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'date',
      },
    },
  }
  