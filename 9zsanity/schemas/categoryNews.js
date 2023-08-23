export default {
  name: 'categoryNews',
  title: 'CategoryNews',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titulo',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
