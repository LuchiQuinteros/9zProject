import { ScullyConfig } from '@scullyio/scully';
import './scully/plugins/fetchRoutes'
import '@scullyio/scully-plugin-puppeteer';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'web9z',
  outDir: './dist/static',
  routes: {
    '/jugador/:name': {
      type: 'players'
    },
    '/equipo/:game': {
      type: 'teams'
    },
    '/terms/:content': {
      type: 'terms'
    },
    '/noticia/:title': {
      type: 'posts',
      // handle: {
      //   url: `https://3u58m366.apicdn.sanity.io/v2021-12-12/data/query/production?query=*[_type == 'posts']{title}`,
      //   property: 'slug',
      //   headers: {
      //     expectedContentType: 'text/plain',
      //   },
      //   resultsHandler: (response: any) => {
      //     // response = JSON.parse(response);
      //     let slugs = [];
      //     for (let post of response) {
      //       let slug = post.title.split(' ').join('-');
      //       slugs.push(slug)
      //     }
      //     return slugs;
      //   },
      // }
    },
  },
  puppeteerLaunchOptions: {
    args: ['--no-sandbox'],
  },
};
