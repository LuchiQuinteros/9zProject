const fetch = require("node-fetch");

require("dotenv").config();
const {
  API_URL_TWITTER,
  ACCOUNT_ID_TWITTER,
  TOKEN_TWITTER
} = process.env;

exports.handler = async (event) => {
  try {
    let params = {
        exclude: 'replies',
        expansions: 'author_id',
        'user.fields': 'profile_image_url',
        'tweet.fields': 'created_at',
        max_results: '30',
      };
    
    let query = Object.keys(params)
                 .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                 .join('&');
    
    let response = await fetch(`${API_URL_TWITTER}/users/${ACCOUNT_ID_TWITTER}/tweets?${query}`, {
      method: "GET",
      headers: {
        'Authorization': TOKEN_TWITTER,
      },
    });

    response = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "Operation Success", response: response }),
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};