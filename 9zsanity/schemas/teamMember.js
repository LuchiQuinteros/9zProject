export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
    name: 'name',
    title: 'Nombre',
    type: 'string',
    },
    {
    name: 'slug',
    title: 'Slug',
    type: 'string',
    options: {
      source: 'name',
      maxLength: 96,
    },
    },
    {
    name: 'picture',
    title: 'Foto',
    type: 'image',
    },
    {
    name: 'description',
    title: 'Descripción',
    type: 'blockContent',
    },
    {
    name: 'nationality',
    title: 'Nacionalidad',
    type: 'string',
    },
    {
    name: 'age',
    title: 'Edad',
    type: 'number',
    },
    {
    name: 'game',
    title: 'Juego',
    type: 'reference',
    weak: true,
    to: [{type: 'game'}],
    },
    {
    name: 'role',
    title: 'Rol',
    type: 'string',
    options: {
      list: [
      { title: 'Jugador', value: 'player' },
      { title: 'Head Coach', value: 'headCoach' },
      { title: 'Coach', value: 'coach' },
      { title: 'Analista', value: 'analyst' },
      { title: 'Corredor', value: 'runner' },
      { title: 'Manager', value: 'manager' },
      { title: 'Streamer', value: 'ambassador' },
      ],
    },
    },
    {
    name: 'team',
    title: 'Equipo',
    type: 'string',
    options: {
      list: [
      { title: 'Main', value: 'main'},
      { title: 'Academy', value: 'academy'},
      ],
    },
    },
    {
    name: 'category',
    title: 'Categoría',
    type: 'string',
    options: {
      list: [
      { title: 'PUBG Mobile', value: 'pubgMobile' },
      { title: 'CS2', value: 'cs2' },
      { title: 'CS2 Academy', value: 'cs2Academy' },
      { title: 'Valorant', value: 'valorant' },
      { title: 'Streamers', value: 'streamers' },
      ],
    },
    },
    {
    name: 'twitch',
    title: 'Twitch',
    type: 'string'
    },
    {
    name: 'instagram',
    title: 'Instagram',
    type: 'string'
    },
    {
    name: 'twitter',
    title: 'Twitter',
    type: 'string'
    },
  ],
  preview: {
    select: {
    title: 'slug',
    subtitle: 'name',
    media: 'picture',
    },
  },
  }