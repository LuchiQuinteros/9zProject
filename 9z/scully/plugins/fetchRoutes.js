const scully = require("@scullyio/scully");
async function fetchRoutes(route, config = {}) {
    var _a;
    const queryUrl = 'https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=';
    const query = `*[_type == 'news']{
      title
    }`;
    const url = `${queryUrl}${encodeURIComponent(query)}`;
    const response = await scully.httpGetJson(url);
    let handledRoutes = [];
    for (let post of response.result) {
        post.newTitle = (_a = post === null || post === void 0 ? void 0 : post.title) === null || _a === void 0 ? void 0 : _a.split(' ').join('-');
        post.newTitle = getName(post.newTitle);
        handledRoutes.push({ route: '/noticia/' + post.newTitle });
    }
    return Promise.resolve(handledRoutes);
}
scully.registerPlugin('router', 'posts', fetchRoutes);
async function fetchRoutesPlayers(route, config = {}) {
    const queryUrl = 'https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=';
    const query = `*[_type == 'teamMember']{
      slug
    }`;
    const url = `${queryUrl}${encodeURIComponent(query)}`;
    const response = await scully.httpGetJson(url);
    let handledRoutes = [];
    for (let player of response.result) {
        handledRoutes.push({ route: '/jugador/' + player.slug });
    }
    return Promise.resolve(handledRoutes);
}
scully.registerPlugin('router', 'players', fetchRoutesPlayers);
async function fetchRoutesTeams(route, config = {}) {
    let teams = ['csgo-main', 'csgo-academy', 'sim-racing', 'valorant', 'valorant-fem'];
    let handledRoutes = [];
    for (let team of teams) {
        handledRoutes.push({ route: '/equipo/' + team });
    }
    return Promise.resolve(handledRoutes);
}
scully.registerPlugin('router', 'teams', fetchRoutesTeams);
async function fetchRoutesTerms(route, config = {}) {
    let terms = ['termsAndConditions', 'privacyPolicy', 'fanContentPolicy'];
    let handledRoutes = [];
    for (let page of terms) {
        handledRoutes.push({ route: '/terms/' + page });
    }
    return Promise.resolve(handledRoutes);
}
scully.registerPlugin('router', 'terms', fetchRoutesTerms);
const config = {
    '/noticia/:title': {
        type: 'posts',
    },
    '/jugador/:name': {
        type: 'players',
    },
    '/equipo/:game': {
        type: 'teams',
    },
    '/terms/:content': {
        type: 'terms'
    }
};
function getName(name) {
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // name = name.replace(/&nbsp;|\u00a0/gi,"")
    return name.toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .replace('"', '')
        .replace(':', '-');
}
//# sourceMappingURL=fetchRoutes.js.map