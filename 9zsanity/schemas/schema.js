// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import categoryNews from './categoryNews'
import blockContent from './blockContent'
import teamMember from './teamMember'
import news from './news'
import game from './game'
import match from './match'
import member from './member'
import team from './team'
import achievement from './achievement'
import shownCategories from './shownCategories'
import youtubeRefreshToken from './youtubeRefreshToken'
import twitchAccessToken from './twitchAccessToken'
import home from './home'
import socialnetwork from './socialnetwork'
import streamers from './streamers'
import sponsors from './sponsors'
import videoGallery from './videoGallery'
import pageNews from './pageNews'
import legal from './legal'

import localeString from './locale/String'
import localeText from './locale/Text'
import localeBlockContent from './locale/BlockContent'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    home,
    videoGallery,
    sponsors,
    socialnetwork,
    streamers,
    game,
    team,
    match,
    teamMember,
    pageNews,
    news,
    legal,
    achievement,
    member,
    shownCategories,
    categoryNews,
    youtubeRefreshToken,
    twitchAccessToken,
    blockContent,
    localeText,
    localeBlockContent,
    localeString,
  ]),
})
