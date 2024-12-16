import axios from "axios";

// Replace this with your Facebook App credentials
const FACEBOOK_APP_ID = "your_facebook_app_id";
const FACEBOOK_APP_SECRET = "your_facebook_app_secret";

/**
 * Fetch Facebook Friends using the Graph API.
 * @param {string} facebookID - The Facebook User ID.
 * @param {string} accessToken - The Facebook User Access Token.
 * @returns {Array} List of friends from Facebook.
 */
export async function fetchFacebookFriends(facebookID, accessToken) {
  try {
    const url = `https://graph.facebook.com/${facebookID}/friends?access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching Facebook friends:", error.message);
    return [];
  }
}

/**
 * Get a long-lived access token using a short-lived one.
 * @param {string} shortLivedToken - The short-lived user access token.
 * @returns {string} Long-lived token or null.
 */
export async function getLongLivedAccessToken(shortLivedToken) {
  try {
    const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;
    const response = await axios.get(url);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching long-lived token:", error.message);
    return null;
  }
}
