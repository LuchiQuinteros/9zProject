export default {
  name: 'legal',
  title: 'Legales',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'termsAndConditions',
      title: 'Términos y condiciones',
      type: 'blockContent',
    },
    {
      name: 'privacyPolicy',
      title: 'Políticas de privacidad',
      type: 'blockContent',
    },
    {
      name: 'fanContentPolicy',
      title: 'Políticas de privacidad del Fan',
      type: 'blockContent',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
  