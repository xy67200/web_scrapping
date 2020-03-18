const cheerio = require('cheerio');
const rp = require('request-promise');
const newsModel = require('../model/news.model');
const crontab = require('node-crontab');
var moment = require('moment');

const requestPromiseRetry = require('request-promise-retry');

const rp1 = requestPromiseRetry(rp)


const elwatan = ["https://www.elwatan.com/category/edition/actualite",
    "https://www.elwatan.com/category/edition/sports",
    "https://www.elwatan.com/category/edition/economie",
    "https://www.elwatan.com/category/edition/culture",
    "https://www.elwatan.com/category/edition/international",
    "https://www.elwatan.com/category/pages-hebdo/sante"],

    alg24 = ["https://www.alg24.net/category/algerie/en-direct/#",
        "https://www.alg24.net/category/sante-bien-etre/",
        "https://www.alg24.net/category/sports/",
        "https://www.alg24.net/category/technologie/",
        "https://www.alg24.net/category/economie/"],

    dzvid = ["https://www.dzvid.com/rubrique/actu/",
        "https://www.dzvid.com/rubrique/culture/ ",
        "https://www.dzvid.com/rubrique/politique/",
        "https://www.dzvid.com/rubrique/economie/",
        "https://www.dzvid.com/rubrique/bien-etre/",
        "https://www.dzvid.com/rubrique/monde/"],

    Algerie360 = ["https://www.algerie360.com/category/algerie/politique/",
        "https://www.algerie360.com/category/economie/",
        "https://www.algerie360.com/category/international/",
        "https://www.algerie360.com/category/sport/",
        "https://www.algerie360.com/category/high-tech/"],

    algerieeco = ["https://www.algerie-eco.com/eco-en-continu/",
        "https://www.algerie-eco.com/category/energie/",
        "https://www.algerie-eco.com/category/entreprises/",
        "https://www.algerie-eco.com/category/finance/",
        "https://www.algerie-eco.com/category/tic/",
        "https://www.algerie-eco.com/category/contributions/",
        "https://www.algerie-eco.com/category/interviews/"],

    dia = ["http://dia-algerie.com/category/actualite/",
        "http://dia-algerie.com/category/culture/",
        "http://dia-algerie.com/category/economie/",
        "http://dia-algerie.com/category/diplomatie/",
        "http://dia-algerie.com/category/monde/",
        "http://dia-algerie.com/category/sports/",
        "http://dia-algerie.com/category/politique/",],

    dzairdaily = [
        "https://www.dzairdaily.com/actualite/",
        "https://www.dzairdaily.com/politique/",
        "https://www.dzairdaily.com/economie/",
        "https://www.dzairdaily.com/societe-culture/",
        "https://www.dzairdaily.com/foot/"
    ],

    inter_lignes = ["https://www.inter-lignes.com/Cat/politique/",
        "https://www.inter-lignes.com/Cat/economie/",
        "https://www.inter-lignes.com/Cat/monde/",
        "https://www.inter-lignes.com/Cat/culture/",
        "https://www.inter-lignes.com/Cat/sport/"],

    reporters = ["https://www.reporters.dz/actualite/",
        "https://www.reporters.dz/economie/",
        "https://www.reporters.dz/culture/",
        "https://www.reporters.dz/sport/"
    ],

    algeriepart = ["https://algeriepart.com/category/a-la-une/",
        "https://algeriepart.com/category/international/",
        "https://algeriepart.com/category/politique/",
        "https://algeriepart.com/category/economie/ ",
        "https://algeriepart.com/category/culture/",],

    tsa = ["https://www.tsa-algerie.com/",
        "https://www.tsa-algerie.com/politique/",
        "https://www.tsa-algerie.com/economie/",
        "https://www.tsa-algerie.com/international/",
        "https://www.tsa-algerie.com/sport/",
        "https://www.tsa-algerie.com/culturemedias-technologies/"],

    liberte_algerie = ["https://www.liberte-algerie.com/a-la-une",
        "https://www.liberte-algerie.com/culture",
        "https://www.liberte-algerie.com/sport",
        "https://www.liberte-algerie.com/liberte-eco",
        'https://www.liberte-algerie.com/auto',
        'https://www.liberte-algerie.com/radar',],

    lesoirdalgerie = ["https://www.lesoirdalgerie.com/actualites",
        "https://www.lesoirdalgerie.com/sports",
        "https://www.lesoirdalgerie.com/supplement-tic",
        "https://www.lesoirdalgerie.com/culture",
        "https://www.lesoirdalgerie.com/monde",
        "https://www.lesoirdalgerie.com/regions",
        "https://www.lesoirdalgerie.com/societe",
        "https://www.lesoirdalgerie.com/periscoop",
        "https://www.lesoirdalgerie.com/femme-magazine",],

    dzfoot = [
        "http://www.dzfoot.com/category/football-en-algerie",
        "http://www.dzfoot.com/category/verts-deurope",
        "http://www.dzfoot.com/category/divers"
    ],

    ennaharonline = ["https://www.ennaharonline.com/%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a/",
        "https://www.ennaharonline.com/%d8%a3%d8%ae%d8%a8%d8%a7%d8%b1-%d8%a7%d9%84%d8%ac%d8%b2%d8%a7%d8%a6%d8%b1/",
        "https://www.ennaharonline.com/%d9%81%d9%86-%d9%88%d8%ab%d9%82%d8%a7%d9%81%d8%a9/",
        "https://www.ennaharonline.com/%d8%a3%d8%ae%d8%a8%d8%a7%d8%b1-%d8%a7%d9%84%d8%b9%d8%a7%d9%84%d9%85/",
        "https://www.ennaharonline.com/%d8%a7%d9%84%d8%b1%d9%8a%d8%a7%d8%b6%d8%a9/",],


    echoroukonline_ar = [
        "https://www.echoroukonline.com/el-jazaair/",
        "https://www.echoroukonline.com/iktisad/",
        "https://www.echoroukonline.com/world/",
        "https://www.echoroukonline.com/sport/montakhab-watani/",
        "https://www.echoroukonline.com/sport/riyada-mahalia/",
        "https://www.echoroukonline.com/sport/riyada-alamia/",
        "https://www.echoroukonline.com/sport/mohtarifon/",
        "https://www.echoroukonline.com/sport/motafarikat/",
        "https://www.echoroukonline.com/sport/mohtarifon/",
        "https://www.echoroukonline.com/sport/mina-dakira/",
        "https://www.echoroukonline.com/society/",
        "https://www.echoroukonline.com/takafa-art/",
        "https://www.echoroukonline.com/monawaat/",
    ],

    echoroukonline_fr = [
        "https://www.echoroukonline.com/fr/actualite/",
        "https://www.echoroukonline.com/fr/economie/",
        "https://www.echoroukonline.com/fr/international/",
        "https://www.echoroukonline.com/fr/sport-fr/",

    ],

    elbilad = ["http://www.elbilad.net/article/index?id=20",
        "http://www.elbilad.net/article/index?id=14",
        "http://www.elbilad.net/article/index?id=19",
        "http://www.elbilad.net/article/index?id=23",
        "http://www.elbilad.net/article/index?id=22",
        "http://www.elbilad.net/article/index?id=26",
        "http://www.elbilad.net/article/index?id=24",
        "http://www.elbilad.net/article/index?id=28",],

    elkhabar = ["https://www.elkhabar.com/press/category/28/%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D9%88%D8%B7%D9%86/",
        "https://www.elkhabar.com/press/category/36/%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85/",
        "https://www.elkhabar.com/press/category/38/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/",
        "https://www.elkhabar.com/press/category/27/%D9%85%D8%AC%D8%AA%D9%85%D8%B9/",
        "https://www.elkhabar.com/press/category/204/%D8%AB%D9%82%D8%A7%D9%81%D8%A9-2/",],

    dzayerinfo = ["http://dzayerinfo.com/ar/category/%d9%81%d9%8a-%d8%a7%d9%84%d9%88%d8%a7%d8%ac%d9%87%d8%a9/",
        "http://dzayerinfo.com/ar/category/%d8%a7%d9%84%d8%ad%d8%af%d8%ab-%d8%a7%d9%84%d8%ac%d8%b2%d8%a7%d8%a6%d8%b1%d9%8a/",
        "http://dzayerinfo.com/ar/category/%d8%a3%d8%ad%d9%88%d8%a7%d9%84-%d8%b9%d8%b1%d8%a8%d9%8a%d8%a9/",
        "http://dzayerinfo.com/ar/category/%d8%a7%d9%84%d8%ac%d8%b2%d8%a7%d8%a6%d8%b1-%d9%85%d9%86-%d8%a7%d9%84%d8%af%d8%a7%d8%ae%d9%84/",
        "http://dzayerinfo.com/ar/category/%d8%b1%d9%8a%d8%a7%d8%b6%d8%a9/"]


// crontab.scheduleJob('*/5 * * * *', getElwatanResponse = (req, res) => {
//     new Promise((reject, resolve) => {
//         elwatan.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     // console.log("html", html);
//                     const $ = cheerio.load(html);
//                     const articalLength = $('h3 > a').length
//                     const category1 = $('.bc-item > strong').text();
//                     function category() {
//                         switch (category1) {
//                             case "Actualité":
//                                 return 'news'
//                                 break;
//                             case "Sports":
//                                 return 'sport'
//                                 break;
//                             case "Economie":
//                                 return 'business'
//                                 break;
//                             case "Culture":
//                                 return 'culture'
//                                 break;
//                             case "International":
//                                 return 'international'
//                                 break;
//                             case "Santé":
//                                 return 'health'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }
//                     // console.log(articalUrls);
//                     $('.p p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     // console.log(articalUrls);
//                     console.log('scraping!');

//                     // console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseelwatanData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log("ERROR ELWATAN1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParseelwatanData = async function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             const Articles = {
//                 source: {
//                     id: "elwatan",
//                     name: "El Watan",
//                 },
//                 title: cheerio('.title-21', html).text(),
//                 urlToImage: cheerio('.attachment-post-thumbnail', html).attr('src'),
//                 author: cheerio('.author-tp-2 > a', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('.texte > p', html).text().trim(),
//                 url: url.linkUrl,
//                 description: url.description,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             // console.log("articals---------",Articals)
//             return Articles
//         })
//         .catch(function (err) {
//             console.log('ERROR ELWATAN2')
//             //handle error
//         });
// };




// crontab.scheduleJob('*/5 * * * *', getAlg24Response = (req, res) => {
//     // getAlg24Response = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         alg24.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('h1.page-title', html).text();
//                     // const description = cheerio('div.taxonomy-description', html).text();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const linkUrl = cheerio('h3 > a', html)[i].attribs.href;
//                         articalUrls.push(linkUrl);
//                     }
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsealg24Data(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         newsModel.findOne({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     console.log("NEWS NOT FIND")
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(articals,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     console.log("errr", err)
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", articals);
//                                                     // res.status(200).json({ totalResult: articals.length, artical: news })
//                                                     // resolve({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParsealg24Data =async function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             const Articles = {
//                 title: cheerio('h1.entry-title', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('span.meta-author > a', html).text().trim(),
//                 // publishedAt: cheerio('.date-tp-4', html).text().trim(),
//                 content: cheerio('.entry-content p', html).text().trim(),
//                 // description: description,
//                 url: url,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             return Articles
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle Error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getdzvidResponse = (req, res) => {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         dzvid.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     const $ = cheerio.load(html);
//                     const articalLength = cheerio('div.mvp-blog-story-in', html).length;
//                     // console.log(articalLength);
//                     const category1 = cheerio('span.mvp-feat1-pop-head', html).text();
//                     function category() {
//                         switch (category1) {
//                             case "Actu":
//                                 return 'news'
//                                 break;
//                             case "Sports":
//                                 return 'sport'
//                                 break;
//                             case "Économie":
//                                 return 'business'
//                                 break;
//                             case "Culture":
//                                 return 'culture'
//                                 break;
//                             case "Monde":
//                                 return 'international'
//                                 break;
//                             case "Bien-être":
//                                 return 'Health'
//                                 break;
//                             case "Politique":
//                                 return 'politique'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     const articalUrlsHead = {
//                         linkUrl: cheerio('.mvp-widget-feat2-left > a', html).attr('href'),
//                         description: cheerio('.mvp-feat1-feat-text > p', html).text(),
//                     };
//                     console.log(articalUrlsHead);
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('li.mvp-blog-story-wrap> a', html)[i].attribs.href,

//                         }
//                         articalUrls.push(obj);
//                     }

//                     $('div > div.mvp-blog-story-in > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text();
//                     });
//                     // console.log("articalurls===>", articalUrls)
//                     articalUrls.push(articalUrlsHead);
//                     console.log("articalurls===>", articalUrls)
//                     console.log('scraping!');

//                     // console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsedzvidData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         if (artical) {
//                             newsModel.find({ title: artical.title })
//                                 .exec((err, foundNews) => {
//                                     if (err) {
//                                         reject({ status: 500, message: 'Internal Serevr Error' });
//                                     } else if (foundNews && foundNews.length) {
//                                         console.log("foundNews:", foundNews)
//                                         reject({ status: 401, message: 'news already created' });
//                                     } else {
//                                         if (artical.title && artical.content) {
//                                             newsModel.create(artical,
//                                                 function (err, news) {
//                                                     if (err) {
//                                                         res.status(500).json({ message: 'News Not Created' })
//                                                     } else {
//                                                         console.log("presidants====>", news);
//                                                         // res.status(200).json({totalResult: articals.length, artical: news })
//                                                         // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                     }
//                                                 })
//                                         }
//                                     }
//                                 })
//                         }
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("ERROR dzvid1");
//                 });
//         })
//     })
// })

// const getParsedzvidData = async function (url, category, description) {
//     console.log("urlllll=====>", url, category)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             const Articles = {
//                 source: {
//                     id: "dzvid",
//                     name: "DZVID",
//                 },
//                 title: cheerio('h1.mvp-post-title', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('data-lazy-src'),
//                 author: cheerio('.author-name > a', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('#mvp-content-main', html).text(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             return Articles
//         })
//         .catch(function (err) {
//             console.log("ERROR dzvid2")
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getAlgerie360Response = (req, res) => {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         Algerie360.forEach(async data => {
//             var url = data
//           await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     const $ = cheerio.load(html);
//                     const articalLength = cheerio('div > article', html).length
//                     const category1 = cheerio('.page-title', html).text();

//                     function category() {
//                         switch (category1) {
//                             case "A la une":
//                                 return 'news'
//                                 break;
//                             case "Sport":
//                                 return 'sport'
//                                 break;
//                             case "Economie":
//                                 return 'business'
//                                 break;
//                             case "Culture":
//                                 return 'culture'
//                                 break;
//                             case "International":
//                                 return 'international'
//                                 break;
//                             case "High-Tech":
//                                 return 'science'
//                                 break;
//                             case "Politique":
//                                 return 'politique'
//                                 break;
//                         }
//                     }
//                     var category = category();

//                     // const description = cheerio("div.entry__excerpt > p", html).text();
//                     // console.log(description);

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h2 > a', html)[i].attribs.href,
//                             // urlToImage: cheerio('div.entry__img-holder.post-list__img-holder.card__img-holder > img ', html).attr('data-src')

//                         }
//                         articalUrls.push(obj);
//                     }

//                     console.log('scraped');

//                     $('div.entry__excerpt > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text();
//                     });
//                     $('div.entry__img-holder.post-list__img-holder.card__img-holder > img').each(function (i, elem) {
//                         articalUrls[i].urlToImage = $(this).attr('data-src');
//                     });

//                     // console.log(articalUrls);
//                     // console.log(articalLength);
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseAlgerie360Data(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log("ERROR algerie360-1");
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParseAlgerie360Data =async function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//              const Articles = {
//                 // const Articles = {
//                 source: {
//                     id: "algerie360",
//                     name: "Algérie 360",
//                 },
//                 title: cheerio('h1.thumb-entry-title', html).text().trim(),
//                 urlToImage: url.urlToImage,
//                 author: cheerio('span.meta-author > a', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 description: url.description,
//                 content: cheerio('.entry__article-wrap', html).text().trim(),
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             }
//             return Articles
//             // }
//         })
//         .catch(function (err) {
//             console.log("ERROR algerie360-2")
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getalgerieecoResponse = (req, res) => {
//     new Promise((reject, resolve) => {
//         algerieeco.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     const $ = cheerio.load(html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category1 = cheerio('h1', html).text().trim();

//                     function category() {
//                         switch (category1) {
//                             case "Eco en continu":
//                                 return 'news'
//                                 break;
//                             case "Entreprises-Management":
//                                 return 'business'
//                                 break;
//                             case "énergie":
//                                 return 'business'
//                                 break;
//                             case "Banques-Finances":
//                                 return 'business'
//                                 break;
//                             case "Interviews":
//                                 return 'business'
//                                 break;
//                             case "Contributions":
//                                 return 'business'
//                                 break;
//                             case "économie numérique":
//                                 return 'business'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     // console.log(articalLength);

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href
//                         }
//                         articalUrls.push(obj);
//                     }

//                     $('div.td-excerpt').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     // console.log("articalurls===>", articalUrls)

//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsealgerieecoData(url, category);
//                         })
//                     );

//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals.title)
//                     articals.forEach(artical => {
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log("ERROR algeco-1");
//                 });
//         })
//     })
// })

// const getParsealgerieecoData = async function (url, category) {
//     // console.log("urlllll=====>", url, category)
//    return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//              const Articles =  {
//                 source: {
//                     id: "algerieeco",
//                     name: "Algérie Eco",
//                 },
//                 title: cheerio('h1.entry-title', html).text(),
//                 urlToImage: cheerio('img.entry-thumb', html).attr('src'),
//                 author: cheerio('.td-post-author-name', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             return Articles;
//         })
//         .catch(function (err) {
//             console.log("ERROR algeco-2")
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getdiaResponse = (req, res) => {
//     new Promise((reject, resolve) => {
//         dia.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     // console.log("html", html);
//                     const articalLength = cheerio('h4 > a', html).length;
//                      const category1 = cheerio('.active > a > span', html).text();
//                       function category() {
//                         switch (category1) {
//                             case "ActualitéActualité":
//                                 return 'news'
//                                 break;
//                             case "SportSport":
//                                 return 'sport'
//                                 break;
//                             case "EconomieEconomie":
//                                 return 'business'
//                                 break;
//                             case "CultureCulture":
//                                 return 'culture'
//                                 break;
//                             case "MondeMonde":
//                                 return 'international'
//                                 break;
//                             case "DiplomatieDiplomatie":
//                                 return 'politique'
//                                 break;
//                             case "PolitiquePolitique":
//                                 return 'politique'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                     	 const obj = {
//                             linkUrl: cheerio('h4 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj); 
//                     }
//                     console.log("articalurls===>", articalUrls,category1)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsediaData(url,category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("articals=====>", articals, articals.length)
//                     articals.forEach(artical => {
//                         if (artical) {
//                             newsModel.find({ title: artical.title })
//                                 .exec((err, foundNews) => {
//                                     if (err) {
//                                         reject({ status: 500, message: 'Internal Serevr Error' });
//                                     } else if (foundNews && foundNews.length) {
//                                         console.log("foundNews:", foundNews)
//                                         reject({ status: 401, message: 'news already created' });
//                                     } else {
//                                         if (artical.title && artical.content) {
//                                             newsModel.create(artical,
//                                                 function (err, news) {
//                                                     if (err) {
//                                                         res.status(500).json({ message: 'News Not Created' })
//                                                     } else {
//                                                         console.log("presidants====>", news);
//                                                         // res.status(200).json({totalResult: articals.length, artical: news })
//                                                         // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                     }
//                                                 })
//                                         }
//                                     }
//                                 })
//                         }
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("DIA ERROR1",err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParsediaData = async function (url,category) {
//     console.log("urlllll=====>", url)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             const $ = cheerio.load(html);
//             const date = $("div > div.qode-post-text > div > div.qode-post-text-main > div.qode-post-info-after-title > div.qode-post-info-date.entry-date.published.updated > a").text().trim();
//             moment.locale('fr')
//             var newDate = moment(date, "lll").format();
//               const Articles = {
//               	  source: {
//                     id: "dia",
//                     name: "DIA",
//                 },
//                 title: cheerio('h2.entry-title', html).text().trim(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('.qode-post-info-author > span', html).text().trim(),
//                 publishedAt: newDate,
//                 content: cheerio('p >span', html).text().trim(),
//                 url: url,
//                 category: {
//                     category: category
//                 },
//                  country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             return Articles
//         })
//         .catch(function (err) {
//             console.log("ERROR DIA2",err)
//             //handle error
//         });
// };



// crontab.scheduleJob('*/5 * * * *', getInterLignesResponse = (req, res) => {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         inter_lignes.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     const $ = cheerio.load(html);
//                     const articalLength = cheerio('div.mvp-blog-story-in > div > h2', html).length
//                     const category1 = cheerio('h1.mvp-feat1-pop-head', html).text();

//                     function category() {
//                         switch (category1) {
//                             case "Politique":
//                                 return 'politique'
//                                 break;
//                             case "Economie":
//                                 return 'business'
//                                 break;
//                             case "Monde":
//                                 return 'international'
//                                 break;
//                             case "Culture":
//                                 return 'culture'
//                                 break;
//                             case "Sport":
//                                 return 'sport'
//                                 break;
//                         }
//                     }
//                     var category = category();

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('li.mvp-blog-story-wrap > a', html)[i].attribs.href
//                         }
//                         articalUrls.push(obj);
//                     }

//                     $('div.mvp-blog-story-text > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });


//                     console.log('scrapped');

//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getInterLignesData(url, category);
//                         })
//                     );

//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err inter1");
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getInterLignesData = async function (url, category) {
//     // console.log("urlllll=====>", url, category)
//    return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             const Articles = {
//                 source: {
//                     id: "interlignes",
//                     name: "Interlignes",
//                 },
//                 title: cheerio('.entry-title', html).text(),
//                 urlToImage: cheerio("#mvp-post-feat-img > picture > img", html).attr('data-lazy-src'),
//                 author: cheerio('#mvp-post-head > div > div.mvp-author-info-text.left.relative > div.mvp-author-info-name.left.relative > span > ', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('.theiaPostSlider_slides p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             return Articles
//         })
//         .catch(function (err) {
//             console.log("errr=====>inter2")
//             //handle error
//         });
// };

//FORGET REPORTER
// crontab.scheduleJob('*/5 * * * *', getreportersResponse = (req, res) => {
//     getreportersResponse = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         reporters.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }
//                     var $ = cheerio.load(html);
//                     $('.td-excerpt').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsedreportersData(url);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("Parsedreporters1");
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })


// const getParsedreportersData = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             console.log("HTML+===========>", html)
//             return {
//                 title: cheerio('h1.entry-title', html).text(),
//                 urlToImage: cheerio('img.entry-thumb', html).attr('src'),
//                 author: cheerio('.td-post-author-name a', html).text().trim(),
//                 publishedAt: cheerio('span >time', html).text().trim(),
//                 content: cheerio('.td-post-content p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: cheerio('.entry-category a', html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("Parsedreporters2")
//         });
// };

crontab.scheduleJob('*/5 * * * *', getalgeriepartResponse = (req, res) => {
    // getalgeriepartResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        algeriepart.forEach(async data => {
            var url = data
            await rp1({
                url: url, timeout: '15000', headers: {
                    'User-Agent': 'Request-Promise'
                }
            })
                .then(function (html) {
                    // console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const category1 = cheerio('h1', html).text();

                    // console.log(articalLength);

                    function category() {
                        switch (category1) {
                            case "A la une":
                                return 'news'
                                break;
                            case "Economie":
                                return 'business'
                                break;
                            case "International":
                                return 'international'
                                break;
                            case "Culture":
                                return 'culture'
                                break;
                            case "Politique":
                                return 'politic'
                                break;
                        }
                    }
                    var category = category();


                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const obj = {
                            linkUrl: cheerio('h3 > a', html)[i].attribs.href
                        }
                        // const linkUrl = cheerio('h3 > a', html)[i].attribs.href;
                        articalUrls.push(obj);
                    }

                    // var $ = cheerio.load(html);
                    // $('div.td-excerpt').each(function (i, elem) {
                    //     articalUrls[i].description = $(this).text().trim();
                    // });
                    // console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getParsealgeriepartData(url, category);
                        })
                    );
                    // console.log("articalurls===>", articalUrls)
                    console.log('scrapped')
                })
                .then(function (articals) {
                    console.log("atricals-=======>", articals)
                    articals.forEach(artical => {
                        console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
                        newsModel.find({ title: artical.title })
                            .exec((err, foundNews) => {
                                if (err) {
                                    reject({ status: 500, message: 'Internal Serevr Error' });
                                } else if (foundNews && foundNews.length) {
                                    console.log("foundNews:", foundNews)
                                    reject({ status: 401, message: 'news already created' });
                                } else {
                                    if (artical.title && artical.content) {
                                        newsModel.create(artical,
                                            function (err, news) {
                                                if (err) {
                                                    res.status(500).json({ message: 'News Not Created' })
                                                } else {
                                                    console.log("presidants====>", news);
                                                    // res.status(200).json({totalResult: articals.length, artical: news })
                                                    // res.send({ status: 'ok', totalResult: articals.length, artical: news })
                                                }
                                            })
                                    }
                                }
                            })
                    })
                })

                .catch(function (err) {
                    console.log("err-algeriepart1", err);
                    // res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getParsealgeriepartData = async function (url, category) {
    // console.log("urlllll=====>", url, category)
     return await rp1({
        url: url.linkUrl, timeout: '15000', headers: {
            'User-Agent': 'Request-Promise'
        }
    })
        .then(function (html) {
             const Articles =  {
                source: {
                    id: "algeriepart",
                    name: "Algérie Part",
                },
                title: cheerio('h1.entry-title', html).text(),
                urlToImage: cheerio('img.entry-thumb', html).attr('src'),
                author: cheerio('div.td-post-author-name > a', html).text().trim(),
                publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
                content: cheerio('.td-post-content p', html).text().trim(),
                description: '',
                url: url.linkUrl,
                category: {
                    category: category
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                }
            };
            return Articles
        })
        .catch(function (err) {
            console.log("errr=====>algeriepart2")
            //handle error
        });
};

// crontab.scheduleJob('*/5 * * * *', gettsaResponse = (req, res) => {
//     // gettsaResponse = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         tsa.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);
//                     //issue with the length must to take the number of href givethe righ number of articles
//                     const articalLength = cheerio('.category__upper > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article > a', html).length
//                     const articalLength1 = cheerio('.category__bottom>div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article> div > h1 > a', html).length
//                     const category1 = cheerio('div.category__upper > div > div > h1 > span', html).text();

//                     // console.log(articalLength);

//                     function category() {
//                         switch (category1) {
//                             case "Économie":
//                                 return 'business'
//                                 break;
//                             case "International":
//                                 return 'international'
//                                 break;
//                             case "Culture, Médias, Technologies":
//                                 return 'culture'
//                                 break;
//                             case "Politique":
//                                 return 'politic'
//                                 break;
//                             case "Sport":
//                                 return 'sport'
//                                 break;
//                         }
//                     }
//                     var category = category();

//                     console.log(category);

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {

//                             linkUrl: cheerio('.category__upper > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);

//                     }

//                     $('.category__upper > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     // console.log("articalurls===>", articalUrls)

//                     const articalUrls1 = [];
//                     for (let i = 0; i < articalLength1; i++) {
//                         const obj = {

//                             linkUrl1: cheerio('.category__bottom>div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article> div > h1 > a', html)[i].attribs.href,
//                         }
//                         articalUrls1.push(obj);

//                     }

//                     $('.category__bottom > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li> article > div > p').each(function (i, elem) {
//                         articalUrls1[i].description = $(this).text().trim();
//                     });

//                     // console.log("articalurls1===>", articalUrls1)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsetsaData(url, category);
//                         }),
//                         articalUrls1.map(function (url) {
//                             return getParsetsaData1(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err-tsa1");
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParsetsaData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 source: {
//                     id: "tsa",
//                     name: "TSA",
//                 },
//                 title: cheerio('.article__title', html).text(),
//                 urlToImage: cheerio("meta[property='og:image']", html).attr("content"),
//                 author: cheerio('.article__meta-author', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('.article__content > p', html).text(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// const getParsetsaData1 = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl1)
//         .then(function (html) {
//             return {
//                 source: {
//                     id: "tsa",
//                     name: "TSA",
//                 },
//                 title: cheerio('.article__title', html).text(),
//                 urlToImage: cheerio("meta[property='og:image']", html).attr("content"),
//                 author: cheerio('.article__meta-author', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 content: cheerio('.article__content > p', html).text(),
//                 description: url.description,
//                 url: url.linkUrl1,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             // console.log(Article1)
//         })
//         .catch(function (err) {
//             console.log("errr=====> tsa3 ")
//             //handle error
//         });
// };


// crontab.scheduleJob('*/5 * * * *', getLiberteAlgerieResponse = (req, res) => {
//     // getLiberteAlgerieResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         liberte_algerie.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     // console.log("html", html);
//                     const articalLength = cheerio('#tab-PostsList > ul > li', html).length
//                     const category1 = cheerio('h1', html).text();
//                     //
//                     // console.log(category1);
//                     // console.log(articalLength);

//                     function category() {
//                         switch (category1) {
//                             case "A la une ":
//                                 return 'news'
//                                 break;
//                             case "Auto ":
//                                 return 'auto'
//                                 break;
//                             case "Culture ":
//                                 return 'culture'
//                                 break;
//                             case "LIBERTE Éco ":
//                                 return 'business'
//                                 break;
//                             case "Sport ":
//                                 return 'sport'
//                                 break;
//                             case "Radar ":
//                                 return 'news'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     // console.log(category);


//                     const articalUrls = [];

//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: 'https://www.liberte-algerie.com' + cheerio('#tab-PostsList > ul > li > div.right-side > a', html)[i].attribs.href
//                         }
//                         articalUrls.push(obj);
//                     }
//                     // console.log("articalurls===>", articalUrls)
//                     var $ = cheerio.load(html)
//                     $('#tab-PostsList > ul > li> div.right-side > strong').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     // console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseLiberteAlgerieData(url, category);
//                         })
//                     );
//                     console.log("scraped");
//                 })
//                 .then(function (articals) {
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--liberte1");
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParseLiberteAlgerieData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             const date = $("div.left-area > div > span:nth-child(2)").text();
//             const time = $('#side-post > div.left-area > div > span:nth-child(3)').text();
//             const datetime = date + time;
//             moment.locale('fr')
//             var newDate = moment(datetime, 'DD-MM-YYYY HH:mm').format();

//             return {
//                 source: {
//                     id: "liberte-algerie",
//                     name: "Liberté Algérie",
//                 },
//                 title: cheerio('#main-post > span > h1', html).text(),
//                 urlToImage: cheerio('img.post-image', html).attr('src'),
//                 author: cheerio('#side-post > div > div > p > a', html).text().trim(),
//                 publishedAt: newDate,
//                 content: cheerio('#text_core>p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>liberte1")
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getLesoirdalgerieResponse = (req, res) => {
//     // getLesoirdalgerieResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         lesoirdalgerie.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     // console.log("html", html);
//                     const articalLength = cheerio('div.item-container', html).length
//                     const category1 = cheerio('.breadcrumb > span:nth-child(3)', html).text();

//                     // console.log(category1);
//                     console.log(articalLength);

//                     function category() {
//                         switch (category1) {
//                             case "Actualités":
//                                 return 'news'
//                                 break;
//                             case "Société":
//                                 return 'society'
//                                 break;
//                             case "Régions":
//                                 return 'news'
//                                 break;
//                             case "Monde":
//                                 return 'international'
//                                 break;
//                             case "Supplément TIC":
//                                 return 'science'
//                                 break;
//                             case "Femme Magazine":
//                                 return 'entertainement'
//                                 break;
//                             case "Sports":
//                                 return 'sport'
//                                 break;
//                             case "Périscoop":
//                                 return 'news'
//                                 break;
//                             case "Culture":
//                                 return 'culture'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     console.log(category);

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: "https://www.lesoirdalgerie.com" + cheerio('div.item-container > a', html)[i].attribs.href,

//                         }
//                         articalUrls.push(obj);
//                     }
//                     var $ = cheerio.load(html)
//                     $('div.item-container > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });


//                     console.log("articalurls===>", articalUrls)

//                     var $ = cheerio.load(html)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseLesoirdalgerieData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err-lesoir1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParseLesoirdalgerieData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html)
//             const date = $(".published").find('br').get(0).nextSibling.nodeValue;
//             const output = date.trim();
//             const ret = output.replace('le ', '');
//             const ret1 = ret.replace(', ', '');
//             moment.locale('fr')
//             var newDate = moment(ret1, 'DD.MM.YYYY HH:mm').format();
//             return {
//                 source: {
//                     id: "lesoirdalgerie",
//                     name: "Le soir d'Algérie",
//                 },
//                 title: cheerio('.black-text', html).text(),
//                 urlToImage: "https://www.lesoirdalgerie.com" + cheerio('div.picture > img', html).attr('data-original'),
//                 author: cheerio('.published > a', html).text().trim(),
//                 publishedAt: newDate,
//                 content: cheerio('.article-details > div > p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>lesoir2", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getDzfootResponse = (req, res) => {
//     // getDzfootResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         dzfoot.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     // console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = 'sport';
//                     const articalUrls = [];
//                     const json = [];
//                     var $ = cheerio.load(html);

//                     console.log(articalLength);

//                     // console.log("json=======>",json)
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }
//                     $('p.post-excerpt').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     console.log("articalurls===>", articalUrls)

//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseDzfootData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("articals", articals)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--dzfoot1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParseDzfootData = function (url, category) {
//     // console.log("urlllll=====>", url.linkUrl, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             const date = $(".meta > li:nth-child(2)").text();
//             moment.locale('fr')
//             var newDate = moment(date, 'LLL').format();
//             return {
//                 source: {
//                     id: "dzfoot",
//                     name: "Dz Foot",
//                 },
//                 title: cheerio('div.post-content > h1', html).text().trim(),
//                 urlToImage: cheerio("meta[name='twitter:image:src']", html).attr("content"),
//                 author: cheerio('.meta > li:nth-child(1)', html).text().trim(),
//                 publishedAt: newDate,
//                 content: cheerio('div.post-content > div.post-body > p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getennaharonlineResponse = (req, res) => {
//     console.log("=========");
//     new Promise((reject, resolve) => {
//         ennaharonline.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);
//                     //issue with the length must to take the number of href givethe righ number of articles
//                     const articalLength = cheerio('.general-section__large-articles-list > li', html).length
//                     const category1 = cheerio('.category-title > span', html).text();

//                     console.log(articalLength);

//                     function category() {
//                         switch (category1) {
//                             case "الوطني":
//                                 return 'news'
//                                 break;
//                             case "أخبار الجزائر":
//                                 return 'news'
//                                 break;
//                             case "الرياضة":
//                                 return 'sport'
//                                 break;
//                             case "فن وثقافة":
//                                 return 'culture'
//                                 break;
//                             case "أخبار العالم":
//                                 return 'international'
//                                 break;


//                         }
//                     }
//                     console.log(category1);
//                     console.log(category);

//                     var category = category();

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {

//                             linkUrl: cheerio('article > div > h2 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }

//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseennaharonlineData(url, category);
//                         })
//                     );
//                 }).then(function (articals) {
//                     console.log("atricals-=======>", articals.category)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--ennar1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParseennaharonlineData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             const date = $("meta[property='article:published_time']").attr("content");
//             return {
//                 source: {
//                     id: "ennarharonline",
//                     name: "Ennahar Online",
//                 },
//                 title: cheerio('.full-article__title', html).text(),
//                 urlToImage: cheerio('article > div.full-article__featured-image > img', html).attr("data-cfsrc"),
//                 author: cheerio('.full-article__author > span > em', html).text().trim(),
//                 publishedAt: date,
//                 content: cheerio('.full-article__content', html).text(),
//                 description: '',
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 }
//             };

//         })
//         .catch(function (err) {
//             console.log("errr2=====> ennar2", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getelkhabarResponse = (req, res) => {
//     // console.log("=========")
//     new Promise((reject, resolve) => {
//         elkhabar.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);
//                     //issue with the length must to take the number of href givethe righ number of articles
//                     const articalLength = cheerio('.category_wrapper.stuff_container.blue_category.category_container a.main_article', html).length
//                     const category1 = cheerio('.category_wrapper.stuff_container.blue_category.category_container h3.category_title a', html).text();


//                     console.log(articalLength);

//                     function category() {
//                         switch (category1) {
//                             case "أخبار الوطن":
//                                 return 'news'
//                                 break;
//                             case "مجتمع":
//                                 return 'society'
//                                 break;
//                             case "رياضة":
//                                 return 'sport'
//                                 break;
//                             case "ثقافة":
//                                 return 'culture'
//                                 break;
//                                 العالم
//                             case "العالم":
//                                 return 'international'
//                                 break;


//                         }
//                     }
//                     var category = category();
//                     console.log(category1);
//                     console.log(category);


//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {

//                             linkUrl: "https://www.elkhabar.com" + cheerio('.category_wrapper.stuff_container.blue_category.category_container a.main_article', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }

//                     $('.category_wrapper.stuff_container.blue_category.category_container a.main_article div.details div.description').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     //
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseelkhabarData(url, category);
//                         })
//                     );
//                 }).then(function (articals) {
//                     console.log("atricals-=======>", articals.category)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--elkhabar1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParseelkhabarData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {

//             moment.locale('fr');
//             const date = cheerio(".relative_time").attr('datetime');
//             newDate = moment(date).format();

//             return {
//                 source: {
//                     id: "elkhabar",
//                     name: "El Khabar",
//                 },
//                 title: cheerio('#article_title', html).text(),
//                 urlToImage: "https://www.elkhabar.com" + cheerio('#article_img > img:nth-child(1)', html).attr("src"),
//                 author: '',
//                 publishedAt: newDate,
//                 content: cheerio('#article_body_content', html).text(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 }
//             };
//             // console.log(Article)
//         })
//         .catch(function (err) {
//             console.log("errr2=====> elkhabar2", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getdzlayerResponse = (req, res) => {
//     new Promise((reject, resolve) => {
//         dzayerinfo.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('.active', html).text().trim();
//                     const articalUrls = [];

//                     // console.log("json=======>",json)
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                         }
//                         if (obj.linkUrl) {
//                             articalUrls.push(obj);
//                         }
//                     }
//                     var $ = cheerio.load(html);
//                     $('.entry-content > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return parsedzlayerResponse(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("articals", articals)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 }).catch(function (err) {
//                     console.log("err", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const parsedzlayerResponse = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             const date = $("meta[property='article:published_time']").attr("content");
//             return {
//                 // document.querySelector("h2.property-price a").textContent.trim() )
//                 title: cheerio('.entry-header > h1 ', html).text().trim(),
//                 urlToImage: cheerio('.single-featured-image > img', html).attr('src'),
//                 author: cheerio('.meta-author > a ', html).text().trim(),
//                 publishedAt: date,
//                 content: cheerio('.entry-content > p', html).text().trim(),
//                 // description: cheerio('.post-excerpt', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: cheerio('.post-cat-wrap > a', html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 },
//                 source: {
//                     id: 'dzayerinfo',
//                     name: 'dzayerinfo'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getelbiladResponse = (req, res) => {
//     // console.log("=========")
//     new Promise((reject, resolve) => {
//         elbilad.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);

//                     const articalLength = cheerio('div.post', html).length
//                     // const category1 = cheerio('#rss_bar > h1 > a', html).text();

//                     console.log(articalLength);
//                     function category() {
//                         console.log(url);
//                         switch (url) {
//                             case "http://www.elbilad.net/article/index?id=20":
//                                 return "news"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=14":
//                                 return "sport"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=19":
//                                 return "news"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=23":
//                                 return "news"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=22":
//                                 return "international"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=26":
//                                 return "news"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=24":
//                                 return "society"
//                                 break;
//                             case "http://www.elbilad.net/article/index?id=28":
//                                 return "news"
//                                 break;
//                         }
//                     }

//                     var category = category();
//                     console.log(category);

//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {

//                             linkUrl: "http://www.elbilad.net" + cheerio('#vertical_right > div > div.typo > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }
//                     $('div.post > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     // console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseElbiladData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals.category)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--elbilad1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParseElbiladData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             const date = $("#post_conteur > span:nth-child(2)").text();
//             const ret = date.replace('| ', '');
//             moment.locale('fr')
//             var newDate = moment(date, "HH:mm YYYY-MM-DD").format();

//             return {
//                 source: {
//                     id: "elbilad",
//                     name: "El bilad",
//                 },
//                 title: cheerio('#flash_post_head > div > h1', html).text(),
//                 urlToImage: cheerio('#post_banner > img', html).attr('data-cfsrc'),
//                 author: cheerio('#post_conteur > span:nth-child(5)', html).text().trim(),
//                 publishedAt: newDate,
//                 content: cheerio('#text_space', html).text(),
//                 description: '',
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 }
//             };

//         })
//         .catch(function (err) {
//             console.log("errr2=====> elbilad2", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getechoroukonlinefrResponse = (req, res) => {
//     // console.log("=========")
//     new Promise((reject, resolve) => {
//         echoroukonline_fr.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);
//                     //issue with the length must to take the number of href givethe righ number of articles
//                     const articalLength = cheerio('div.acategory__list > ul > li', html).length
//                     // .article-head__breadcrumbs > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)
//                     const category1 = cheerio('.article-head__breadcrumbs > li > a > span', html).text();

//                     console.log(articalLength);
//                     console.log(category1);
//                     function category() {
//                         switch (category1) {
//                             case "FrançaisEconomie":
//                                 return 'business'
//                                 break;
//                             case "FrançaisInternational":
//                                 return 'international'
//                                 break;
//                             case "FrançaisActualité":
//                                 return 'news'
//                                 break;
//                             case "FrançaisSport":
//                                 return 'sport'
//                                 break;
//                         }


//                     }
//                     var category = category();
//                     console.log(category);
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('.acategory__list > ul> li > article> div > div > h2 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);

//                     }
//                     //
//                     $('.acategory__list > ul > li > article > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     console.log("articalurls===>", articalUrls)

//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseechoroukonlinefrData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals.category)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--echouroukfr1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// })

// const getParseechoroukonlinefrData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 source: {
//                     id: "echoroukonline",
//                     name: "Echorouk Online",
//                 },
//                 title: cheerio('.title--latin-middle > em', html).text(),
//                 urlToImage: cheerio('.zoom-image', html).attr('href'),
//                 author: cheerio('.article-head__author > div > em > a', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 description: url.description,
//                 content: cheerio('.the-content', html).text(),
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 }
//             };
//             console.log(Article)
//         })
//         .catch(function (err) {
//             console.log("errr=====>echouroukfr2 ", err)
//             //handle error
//         });
// };


// crontab.scheduleJob('*/5 * * * *', getechoroukonlinearResponse = (req, res) => {
//     // getechoroukonlinearResponse = function (req, res) {
//     // console.log("=========")
//     new Promise((reject, resolve) => {
//         echoroukonline_ar.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     var $ = cheerio.load(html);
//                     // console.log("html", html);
//                     //issue with the length must to take the number of href givethe righ number of articles
//                     const articalLength = cheerio('div.acategory__list > ul > li', html).length
//                     // .article-head__breadcrumbs > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)
//                     const category1 = cheerio('.article-head__breadcrumbs > li > a > span', html).text();

//                     console.log(articalLength);
//                     console.log(category1);
//                     function category() {
//                         switch (category1) {
//                             case "قضايا المجتمع":
//                                 return 'society'
//                                 break;
//                             case "الإقتصاد":
//                                 return 'business'
//                                 break;
//                             case "العالم":
//                                 return 'international'
//                                 break;
//                             case "ثقافة وفن":
//                                 return 'culture'
//                                 break;
//                             case "الجزائر":
//                                 return 'news'
//                                 break;
//                             case "منوعات":
//                                 return 'divers'
//                                 break;
//                             case "المنتخب الوطني":
//                                 return 'sport'
//                                 break;
//                             case "رياضة محلية":
//                                 return 'sport'
//                                 break;
//                             case "رياضة عالمية":
//                                 return 'sport'
//                                 break;
//                             case "محترفون":
//                                 return 'sport'
//                                 break;
//                             case "متفرقات":
//                                 return 'sport'
//                                 break;
//                             case "من الذاكرة":
//                                 return 'sport'
//                                 break;
//                         }
//                     }
//                     var category = category();
//                     console.log(category);
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('.acategory__list > ul> li > article> div > div > h2 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);

//                     }
//                     //
//                     $('.acategory__list > ul > li > article > div > p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });

//                     console.log("articalurls===>", articalUrls)

//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseechoroukonlineData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals.category)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if (artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                                 } else {
//                                                     console.log("presidants====>", news);
//                                                     // res.status(200).json({totalResult: articals.length, artical: news })
//                                                     // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err--echououkar1", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const getParseechoroukonlineData = function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 source: {
//                     id: "echoroukonline",
//                     name: "Echorouk Online",
//                 },
//                 title: cheerio('.title--sub', html).text() + "11" + cheerio('.title--middle > em', html).text(),
//                 urlToImage: cheerio('.zoom-image', html).attr('href'),
//                 author: cheerio('.article-head__author > div > em > a', html).text().trim(),
//                 publishedAt: cheerio("meta[property='article:published_time']", html).attr("content"),
//                 description: url.description,
//                 content: cheerio('.the-content', html).text(),
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 }
//             };
//             // console.log(Article)
//         })
//         .catch(function (err) {
//             console.log("errr=====> echouroukar2 ", err)
//             //handle error
//         });
// };


// getCountryWiseData = function (req, res) {
//     newsModel.find({ 'country.country': req.params.country }).exec((err, data) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else {
//             res.send({ status: 200, message: 'Country Wise News Get Succesfully', data: data })
//         }
//     });
// };



// getLanguageWiseData = function (req, res) {
//     newsModel.find({ 'country.lang': req.params.lang }).exec((err, data) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else {
//             res.send({ status: 200, message: 'Language Wise News Get Succesfully', data: data })
//         }
//     });
// };

// getCategoryWiseData = function (req, res) {
//     newsModel.find({ 'category.category': req.params.category }).exec((err, data) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else {
//             res.send({ status: 200, message: 'Category Wise News Get Succesfully', data: data })
//         }
//     });
// };

// crontab.scheduleJob('0 56 15 * * *', deleteBlankRecord = (req, res) => {

// });


// /**
//  * News Title Wise get data
// s */
// getNewsByTitle = function (req, res) {
//     console.log("TILTE:", req.body.title)
//     newsModel.find({ title: req.body.title }).exec((err, data) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else {
//             console.log("LENGTH:", data.length)
//             res.send({ status: 200, message: 'Title Wise News Get Succesfully', data: data })
//         }
//     });
// }


// /** 
//  * Country & category wise get news  
//  */
// getNewsByCategoryAndCountry = function (req, res) {
//     console.log("QUERY:", req.query.country, req.query.category)
//     newsModel.find({ $and: [{ 'category.category': req.query.category }, { 'country.country': req.query.country }] }).exec((err, news) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else if (news && news.length) {
//             console.log("LENGTH:", news.length)
//             res.send({ status: 200, message: 'Category & Country Wise News Get Succesfully', data: news })
//         } else {
//             res.send({ status: 500, message: 'News Not Found' });
//         }
//     })
// }

// /**
//  * latest3Days news
//  */
// getLatestNews = function (req, res) {
//     const date = new Date;
//     let d = new Date();
//     let threeDaysPrevious = d.setDate(d.getDate() - 3);
//     threeDaysPrevious = new Date(threeDaysPrevious).toISOString();
//     console.log("PREVIOUS:", threeDaysPrevious)
//     console.log("DATE:", date)
//     newsModel.find({ publishedAt: { $gt: threeDaysPrevious } }).exec((err, news) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serever Error' });
//         } else {
//             res.send({ status: 200, message: 'Latest News Get Successfully', data: news });
//         }
//     })
// }

// /**
//  * get latest threedays new with category and country
//  */
// getLatestNewsWithCategoryAndCountry = function (req, res) {
//     let d = new Date();
//     let threeDaysPrevious = d.setDate(d.getDate() - 3);
//     threeDaysPrevious = new Date(threeDaysPrevious).toISOString();
//     console.log("PREVIOUS:", threeDaysPrevious)
//     console.log("QUERY:", req.query.country, req.query.category)
//     newsModel.find({ $and: [{ 'category.category': req.query.category }, { 'country.country': req.query.country }, { publishedAt: { $gt: threeDaysPrevious } }] }).exec((err, news) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else if (news && news.length) {
//             console.log("LENGTH:", news.length)
//             res.send({ status: 200, message: 'Category & Country Wise News Get Succesfully', data: news })
//         } else {
//             res.send({ status: 500, message: 'News Not Found' });
//         }
//     })
// }



// crontab.scheduleJob('*/5 * * * *', getdzairdailyResponse = (req, res) => {
//     // getdzairdailyResponse = function (req, res) {
//     console.log("=========")

//     new Promise((reject, resolve) => {
//         dzairdaily.forEach(async data => {
//             var url = data
//             await rp1({
//                 url: url, timeout: '15000', headers: {
//                     'User-Agent': 'Request-Promise'
//                 }
//             })
//                 .then(function (html) {
//                     const $ = cheerio.load(html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category1 = cheerio('h2.page-heading__title', html).text();
//                     // const category1 = $('.bc-item > strong').text();
//                     function category() {
//                         switch (category1) {
//                             case "Actualité":
//                                 return 'news'
//                                 break;
//                             case "Foot":
//                                 return 'sport'
//                                 break;
//                             case "Économie":
//                                 return 'business'
//                                 break;
//                             case "Société et Culture":
//                                 return 'culture'
//                                 break;
//                             case "Politique":
//                                 return 'politique'
//                                 break;

//                         }
//                     }
//                     var category = category();
//                     console.log(category);
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                         }
//                         articalUrls.push(obj);
//                     }
//                     // var $ = cheerio.load(html);
//                     $('.excerpt').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     console.log(articalUrls);
//                     // $('.p p').each(function (i, elem) {
//                     //     articalUrls[i].description = $(this).text().trim();
//                     // });

//                     // console.log(articalUrls);
//                     console.log('scraping!');

//                     // console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsedzairdailyData(url, category);
//                         })
//                     );
//                 }).then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         // console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
//                         if (artical) {
//                             newsModel.find({ title: artical.title })
//                                 .exec((err, foundNews) => {
//                                     if (err) {
//                                         reject({ status: 500, message: 'Internal Serevr Error' });
//                                     } else if (foundNews && foundNews.length) {
//                                         console.log("foundNews:", foundNews)
//                                         reject({ status: 401, message: 'news already created' });
//                                     } else {
//                                         if (artical.title && artical.content) {
//                                             newsModel.create(artical,
//                                                 function (err, news) {
//                                                     if (err) {
//                                                         res.status(500).json({ message: 'News Not Created' })
//                                                     } else {
//                                                         console.log("presidants====>", news);
//                                                         // res.status(200).json({totalResult: articals.length, artical: news })
//                                                         // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                                     }
//                                                 })
//                                         }
//                                     }
//                                 })
//                         }
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log('ERROR ELWATAN1')
//                     // if (err.cause.code === 'ETIMEDOUT') { console.log("error Elwatan1 ETIMEDOUT ", err.options.url) }
//                     // else {console.log('ERROR Elwatan1', err)}
//                 })
//         })
//     })
// })
// //
// const getParsedzairdailyData = async function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return await rp1({
//         url: url.linkUrl, timeout: '15000', headers: {
//             'User-Agent': 'Request-Promise'
//         }
//     })
//         .then(function (html) {
//             // console.log("html=============>",html)
//             var $ = cheerio.load(html);
//             const date = $("meta[property='article:published_time']").attr("content");
//             const Articles = {
//                 title: cheerio('h1.entry-title', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('span.entry-author', html).text().trim(),
//                 publishedAt: date,
//                 content: cheerio('.entry-content p ,.entry-content h4', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source: {
//                     id: "dzairdaily",
//                     name: "Dzair Daily",
//                 },
//             };
//             return Articles
//         })
//         .catch(function (err) {
//             // if (err.cause.code === 'ETIMEDOUT') { console.log("error Elwatan2 ETIMEDOUT ", err.options.url) }
//             // else {console.log('ERROR Elwatan2', err)}
//             console.log('ERROR Elwatan2', err);

//         });
// };




module.exports = {
    // getElwatanResponse: getElwatanResponse,
    // getAlg24Response: getAlg24Response,
    // getdzvidResponse: getdzvidResponse,
    // getAlgerie360Response: getAlgerie360Response,
    // getalgerieecoResponse: getalgerieecoResponse,
    // getdiaResponse: getdiaResponse,
    // getdzairdailyResponse: getdzairdailyResponse,
    // getInterLignesResponse: getInterLignesResponse,
    // getreportersResponse: getreportersResponse,
    getalgeriepartResponse: getalgeriepartResponse,
    // gettsaResponse: gettsaResponse,
    // getLiberteAlgerieResponse: getLiberteAlgerieResponse,
    // getLesoirdalgerieResponse: getLesoirdalgerieResponse,
    // getDzfootResponse: getDzfootResponse,
    // getennaharonlineResponse: getennaharonlineResponse,
    // getechoroukonlinefrResponse: getechoroukonlinefrResponse,
    // getechoroukonlinearResponse: getechoroukonlinearResponse,
    // getelbiladResponse: getelbiladResponse,
    // getelkhabarResponse: getelkhabarResponse,
    // getdzlayerResponse: getdzlayerResponse,
    // getCountryWiseData: getCountryWiseData,
    // getLanguageWiseData: getLanguageWiseData,
    // getCategoryWiseData: getCategoryWiseData,
    // deleteBlankRecord: deleteBlankRecord,
    // getNewsByTitle: getNewsByTitle,
    // getNewsByCategoryAndCountry: getNewsByCategoryAndCountry,
    // getLatestNews: getLatestNews,
    // getLatestNewsWithCategoryAndCountry: getLatestNewsWithCategoryAndCountry
}




