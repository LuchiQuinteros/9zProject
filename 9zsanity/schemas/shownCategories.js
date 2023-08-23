export default {
    name: 'shownCategories',
    title: 'Shown Categories',
    type: 'document',
    fields: [
        {
            name: 'category1',
            title: 'Categoría 1',
            type: 'reference',
            weak: true,
            to: [{type: 'categoryNews'}],
        },
        {
            name: 'category2',
            title: 'Categoría 2',
            type: 'reference',
            weak: true,
            to: [{type: 'categoryNews'}],
        },
        {
            name: 'category3',
            title: 'Categoría 3',
            type: 'reference',
            weak: true,
            to: [{type: 'categoryNews'}],
        },
    ],
}