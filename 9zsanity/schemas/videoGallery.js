export default {
  name: 'videoGallery',
  title: 'Galerías de Videos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: '3 videos destacados', value: 'cards' },
          { title: 'Slider', value: 'slider' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    },
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          title: 'video',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Título',
              type: 'string'
            },
            {
              name: 'tag',
              title: 'Tag',
              type: 'string'
            },
            {
              name: 'preview',
              title: 'Vista previa',
              type: 'image'
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string'
            }
          ]
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
}
