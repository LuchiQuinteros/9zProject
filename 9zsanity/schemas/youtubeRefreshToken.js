export default {
    name: 'youtubeRefreshToken',
    title: 'YoutubeRefreshToken',
    type: 'document',
    fields: [
        {
            name: 'refreshToken',
            title: 'Refresh Token',
            type: 'string',
        },
    ],
    preview: {
        select: {
            title: 'refreshToken',
        },
    },
}