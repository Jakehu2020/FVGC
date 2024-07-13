const cheerio = require('cheerio');
const axios = require("axios");

async function get() {
    let res = await axios.get('https://www.merriam-webster.com/word-of-the-day');
    const $ = cheerio.load(res.data)
    let word = $('title').text().toString();
    word = word.substring(17, word.length - 49);

    let desc = $('.wod-definition-container').find('p').html().toString().split("// ")[0];
    let ex = $('.wotd-examples').find("p").html().toString();
    let didyouknow = $('.did-you-know-wrapper').find('p').html().toString();

    return [word, desc, ex, didyouknow];
}

module.exports = get;