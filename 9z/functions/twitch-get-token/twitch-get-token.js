const fetch = require("node-fetch");

require("dotenv").config();
const {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET
} = process.env;

const API_ENDPOINT = `https://id.twitch.tv/oauth2/token`;

exports.handler = async (event) => {
  try {
    let body = {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
    };

    var formBody = [];

    for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    
    let response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
    });
    
    response = await response.json();
    
    console.log(response);
    return {
        statusCode: 200,
        body: JSON.stringify({ data:  { status: "Operation Success", response: response }}),
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};