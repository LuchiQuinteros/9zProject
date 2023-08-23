export default {
  name: 'sponsors',
  title: 'Sponsors',
  type: 'document',
  fields: [
    {
      name: 'pageName',
      title: 'Página/Sección',
      type: 'string',
    },
    {
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nombre',
              type: 'string'
            },
            {
              name: 'logo',
              title: 'Logo',
              type: 'image'
            },
          ]
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'pageName',
    },
  },
}
