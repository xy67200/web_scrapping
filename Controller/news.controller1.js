
const cheerio = require('cheerio');
const rp = require('request-promise');
const newsModel = require('../model/news.model');
const crontab = require('node-crontab');
const async = require("async");


const elwatan = ["https://www.elwatan.com/category/edition/actualite",
    "https://www.elwatan.com/category/edition/sport",
    "https://www.elwatan.com/category/edition/economie",
    "https://www.elwatan.com/category/edition/culture",
    "https://www.elwatan.com/category/edition/international",
    "https://www.elwatan.com/category/pages-hebdo/sante"],   //DONE

    alg24 = ["https://www.alg24.net/category/algerie/en-direct/#",
        "https://www.alg24.net/category/sante-bien-etre/",
        "https://www.alg24.net/category/sports/",
        "https://www.alg24.net/category/technologie/",
        "https://www.alg24.net/category/economie/"],  //NOT FOUND

    dzvid = ["https://www.dzvid.com/rubrique/actu/",
        "https://www.dzvid.com/rubrique/culture/",
        "https://www.dzvid.com/rubrique/politique/",
        "https://www.dzvid.com/rubrique/economie/",
        "https://www.dzvid.com/rubrique/bien-etre/",
        "https://www.dzvid.com/rubrique/monde/"], //BLANK

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
        "https://www.algerie-eco.com/category/interviews/"], //Done(pAt)

    dia = ["http://dia-algerie.com/category/actualite/",
        "http://dia-algerie.com/category/culture/",
        "http://dia-algerie.com/category/economie/",
        "http://dia-algerie.com/category/diplomatie/",
        "http://dia-algerie.com/category/monde/",
        "http://dia-algerie.com/category/sports/",
        "http://dia-algerie.com/category/politique/",], //DONE(DESC)

    dzairdaily = ["https://www.dzairdaily.com/actualite/",
        "https://www.dzairdaily.com/politique/",
        "https://www.dzairdaily.com/economie/",
        "https://www.dzairdaily.com/societe-culture/",
        "https://www.dzairdaily.com/foot/"],

    inter_lignes = ["https://www.inter-lignes.com/Cat/politique/",
        "https://www.inter-lignes.com/Cat/economie/",
        "https://www.inter-lignes.com/Cat/monde/",
        "https://www.inter-lignes.com/Cat/culture/",
        "https://www.inter-lignes.com/Cat/sport/"], //BLANK

    reporters = ["https://www.reporters.dz/actualite/",
        "https://www.reporters.dz/economie/",
        "https://www.reporters.dz/culture/",
        "https://www.reporters.dz/sport/"   //Done
    ],

    algeriepart = ["https://algeriepart.com/category/a-la-une/",
        "https://algeriepart.com/category/international/",
        "https://algeriepart.com/category/politique/",
        "https://algeriepart.com/category/economie/ "], //Done

    tsa = ["https://www.tsa-algerie.com/",
        "https://www.tsa-algerie.com/politique/",
        "https://www.tsa-algerie.com/economie/",
        "https://www.tsa-algerie.com/international/",
        "https://www.tsa-algerie.com/sport/",
        "https://www.tsa-algerie.com/sport/",
        // "https://www.tsa-algerie.com/culturemedias-technologies/"
    ],

    liberte_algerie = ["https://www.liberte-algerie.com/a-la-une",
        "https://www.liberte-algerie.com/culture",
        "https://www.liberte-algerie.com/sport",
        "https://www.liberte-algerie.com/liberte-eco"],

    lesoirdalgerie = ["https://www.lesoirdalgerie.com/actualites",
        "https://www.lesoirdalgerie.com/sports",
        "https://www.lesoirdalgerie.com/supplement-tic",
        "https://www.lesoirdalgerie.com/culture"],

    dzfoot = [
        "http://www.dzfoot.com/category/football-en-algerie",
        "http://www.dzfoot.com/category/verts-deurope",
        "http://www.dzfoot.com/category/divers"
    ],

    ennaharonline = ["https://www.ennaharonline.com/%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a/",
        " https://www.ennaharonline.com/%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a/",
        "https://www.ennaharonline.com/%d8%a7%d9%84%d8%b1%d9%8a%d8%a7%d8%b6%d8%a9/"],

    elkhabar = ["https://www.elkhabar.com/press/category/28/%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D8%A7%D9%84%D9%88%D8%B7%D9%86/",
        "https://www.elkhabar.com/press/category/36/%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85/",
        "https://www.elkhabar.com/press/category/38/%D8%B1%D9%8A%D8%A7%D8%B6%D8%A9/",
        "https://www.elkhabar.com/press/category/27/%D9%85%D8%AC%D8%AA%D9%85%D8%B9/",
        "https://www.elkhabar.com/press/category/204/%D8%AB%D9%82%D8%A7%D9%81%D8%A9-2/"],

    algeriescoop = ["https://dzair-tube.com/category/%d8%a7%d9%84%d8%b1%d9%8a%d8%a7%d8%b6%d8%a9/",
        "https://dzair-tube.com/category/%d9%85%d9%86%d9%88%d8%b9%d8%a7%d8%aa/%d8%a7%d9%84%d8%b3%d9%8a%d8%a7%d8%b3%d9%8a/",
        "https://dzair-tube.com/category/%d9%85%d9%86%d9%88%d8%b9%d8%a7%d8%aa/%d8%a7%d9%84%d8%a7%d9%82%d8%aa%d8%b5%d8%a7%d8%af/",
        "https://dzair-tube.com/category/%d8%a7%d9%84%d9%85%d8%ad%d9%84%d9%8a/",
        "https://dzair-tube.com/category/%d9%85%d9%86%d9%88%d8%b9%d8%a7%d8%aa/%d8%a7%d9%84%d8%af%d9%88%d9%84%d9%8a/"],

    elbilad = ["http://www.elbilad.net/article/index?id=20",
        "http://www.elbilad.net/article/index?id=14",
        "http://www.elbilad.net/article/index?id=17",
        "https://www.elbilad.net/article/index?id=15"],

    dzayerinfo = ["http://dzayerinfo.com/ar/category/%d9%81%d9%8a-%d8%a7%d9%84%d9%88%d8%a7%d8%ac%d9%87%d8%a9/",
        "http://dzayerinfo.com/ar/category/%d8%a7%d9%84%d8%ad%d8%af%d8%ab-%d8%a7%d9%84%d8%ac%d8%b2%d8%a7%d8%a6%d8%b1%d9%8a/",
        "http://dzayerinfo.com/ar/category/%d8%a3%d8%ad%d9%88%d8%a7%d9%84-%d8%b9%d8%b1%d8%a8%d9%8a%d8%a9/",
        "http://dzayerinfo.com/ar/category/%d8%a7%d9%84%d8%ac%d8%b2%d8%a7%d8%a6%d8%b1-%d9%85%d9%86-%d8%a7%d9%84%d8%af%d8%a7%d8%ae%d9%84/",
        "http://dzayerinfo.com/ar/category/%d8%b1%d9%8a%d8%a7%d8%b6%d8%a9/"]

// crontab.scheduleJob('*/5 * * * *', getElwatanResponse = (req, res) => {
//     // getElwatanResponse = (req, res) => {
//         new Promise((reject, resolve) => {
//             elwatan.forEach(data => {
//                 var url = data
//                 rp(url)
//                     .then(function (html) {
//                         console.log("html", html);
//                         const articalLength = cheerio('h3 > a', html).length
//                         const category = cheerio('.bc-item > strong', html).text();
//                         const articalUrls = [];
//                         for (let i = 0; i < articalLength; i++) {
//                             const obj = {
//                                 linkUrl: cheerio('h3 > a', html)[i].attribs.href,
//                             }
//                             articalUrls.push(obj);
//                         }
//                         var $ = cheerio.load(html);
//                         $('.p p').each(function (i, elem) {
//                             articalUrls[i].description = $(this).text().trim();
//                         });
//                         // console.log("articalurls===>", articalUrls)
//                         return Promise.all(
//                             articalUrls.map(function (url) {
//                                 return getParseelwatanData(url, category);
//                             })
//                         );
//                     })
//                     .then(function (articals) {
//                         articals.forEach(artical => {
//                             console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if(artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                             } else {
//                                                 console.log("presidants====>", news);
//                                                 // res.status(200).json({totalResult: articals.length, artical: news })
//                                                 // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                             }
//                                         })
//                                     } 
//                                 }
//                             })
//                         })
//                     })
//                     .catch(function (err) {
//                         console.log("err", err);
//                         // res.send({ "err": "errr" })
//                         //handle error
//                     });
//             })
//         })
//     // }
// })

// const getParseelwatanData = function (url, category) {
//     // console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 title: cheerio('.title-21', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('.author-tp-2 > a', html).text().trim(),
//                 publishedAt: cheerio('.date-tp-4', html).text().trim(),
//                 content: cheerio('p', html).text().trim(),
//                 url: url.linkUrl,
//                 description: url.description,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source: {
//                     id: 'elwatan',
//                     name: 'elwatan'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('0 58 12 * * *', getResponse = (req, res) => {
// crontab.scheduleJob('*/5 * * * *', getAlg24Response = (req, res) => {
// // getAlg24Response = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         alg24.forEach(data => {
//             var url = data
//             rp(url)
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
//                     newsModel.findOne({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 console.log("NEWS NOT FIND")
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(articals,
//                                         function (err, news) {
//                                             if (err) {
//                                                 console.log("errr", err)
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                             } else {
//                                             console.log("presidants====>", articals);
//                                             // res.status(200).json({ totalResult: articals.length, artical: news })
//                                             // resolve({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 }
//                             }
//                         })
//                         })
//                 })

//                 .catch(function (err) {
//                     console.log("err", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// // }
// })

// const getParsealg24Data = function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return rp(url)
//         .then(function (html) {
//             return {
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
//                 },
//                 source: {
//                     id: 'alg24',
//                     name: 'alg24'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getdzvidResponse = (req, res) => {
// // getdzvidResponse = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         dzvid.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('span.mvp-feat1-pop-head', html).text();
//                     const description = cheerio('p.mvp-blog-story-text left relative', html).text();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const linkUrl = cheerio('.mvp-widget-feat2-right-main left relative > a', html)[i].attribs.href;
//                         articalUrls.push(linkUrl);
//                     }
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParsedzvidData(url, category, description);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                     })

//                     .catch(function (err) {
//                     console.log("err", err);
//                     res.send({ "err": "errr" })
//                     //handle error
//                 });
//             })
//     })
// // }
// })

// const getParsedzvidData = function (url, category, description) {
//     console.log("urlllll=====>", url, category)
//     return rp(url)
//         .then(function (html) {
//             return {
//                 title: cheerio('h1.mvp-post-title', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio(',mvp-author-info-name > p', html).text().trim(),
//                 publishedAt: cheerio('.mvp-post-date > time', html).text().trim(),
//                 content: cheerio('.mvp-content-main p,.mvp-content-main h4 ,.mvp-content-main h3', html).text().trim(),
//                 description: description,
//                 url: url,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source: {
//                     id: 'dzvid',
//                     name: 'dzvid'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getAlgerie360Response = (req, res) => {
// // getAlgerie360Response = function (req, res) {
//     console.log("=========")
//     new Promise((reject, resolve) => {
//         Algerie360.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('.blog__content > h1', html).text();
//                     const description = cheerio(".entry__excerpt p", html).text();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h2 > a', html)[i].attribs.href,
//                             urlToImage: cheerio('.blocactucat > img ', html).attr('src')
//                         }
//                         articalUrls.push(obj);
//                     }
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseAlgerie360Data(url, category, description);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     console.log("atricals-=======>", articals, articals.length)
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log("err", err);
//                     res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// // } 
// })

// const getParseAlgerie360Data = function (url, category, description) {
//     console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 title: cheerio('#titrepost h1', html).text(),
//                 urlToImage: url.urlToImage,
//                 author: cheerio('span.meta-author > a', html).text().trim(),
//                 publishedAt: cheerio('.datearti', html).text().trim(),
//                 content: cheerio('.epostwhite p >strong,.epostwhite p', html).text().trim(),
//                 description: description,
//                 url: url.linkUrl,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source: {
//                     id: 'algerie360',
//                     name: 'algerie360'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getalgerieecoResponse = (req, res) => {
// // getalgerieecoResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         algerieeco.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('h1', html).text();
//                     // const description = cheerio('.td-excerpt',html).text().trim();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('h3 > a', html)[i].attribs.href
//                         }
//                         articalUrls.push(obj);
//                     }
//                     var $ = cheerio.load(html);
//                     $('.td-excerpt').each(function (i, elem) {
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
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                 })
//                 .catch(function (err) {
//                     console.log("err", err);
//                 });
//         })
//     })
// // }
// })

// const getParsealgerieecoData = function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 title: cheerio('h1.entry-title', html).text(),
//                 urlToImage: cheerio('img.entry-thumb', html).attr('src'),
//                 author: cheerio('.td-post-author-name', html).text().trim(),
//                 publishedAt: cheerio('.td-module-meta-info .td-post-date > time', html).text().trim(),
//                 content: cheerio('p', html).text().trim(),
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
//                     id: 'algerieeco',
//                     name: 'algerieeco'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getdiaResponse = (req, res) => {
getdiaResponse = async  function (req, res) {
    new Promise((reject, resolve) => {
        dia.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h4 > a', html).length
                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const linkUrl = cheerio('h4 > a', html)[i].attribs.href;
                        articalUrls.push(linkUrl);
                    }
                    console.log("articalurls===>", articalUrls)
let response = await.Promise.all(articalUrls.map(url=>request.get(url)))
let $$ = response.map()
                    async.forEachOfSeries(articalUrls, (url, index, callback) => {
                        console.log("in async serease=========>", url)
                        // getParsediaData(url);
                        rp(url)
                            .then(async function (html) {
                                let news = {
                                    title: cheerio('h2.entry-title', html).text().trim(),
                                    urlToImage: cheerio('img.wp-post-image', html).attr('src'),
                                    author: cheerio('.qode-post-info-author > span', html).text().trim(),
                                    publishedAt: cheerio('.qode-post-info-date a', html).text().trim(),
                                    content: cheerio('p >span', html).text().trim(),
                                    url: url,
                                    category: {
                                        category: cheerio('span.qode-category-name', html).text().trim()
                                    },
                                    country: {
                                        country: 'DZ',
                                        lang: 'fr'
                                    },
                                    source: {
                                        id: 'dia',
                                        name: 'dia'
                                    }
                                };

                                // await function newsFun(news){
                                //     console.log("=================")
                                //     console.log("NEWS AFTER AWAIT",news)
                                //     console.log("=================")
                                // });
                            })
                            .catch(function (err) {
                                console.log("errr=====>", err)
                                //handle error
                            });
                        callback();
                    })
                    // return Promise.all(
                    //     articalUrls.map(function (url) {
                    //         return getParsediaData(url);
                    //     })
                    // );
                })
                .then(function (articals) {
                    console.log("articals=====>", articals, articals.length)
                    articals.forEach(artical => {
                        console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
                        if (artical) {
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
                        }
                    })
                })

                .catch(function (err) {
                    console.log("err", err);
                    // res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
}

function newsFun(news){
    return news;
}
// })

// const getParsediaData = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url)
//         .then(function (html) {
//             return {
//                 title: cheerio('h2.entry-title', html).text().trim(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('.qode-post-info-author > span', html).text().trim(),
//                 publishedAt: cheerio('.qode-post-info-date a', html).text().trim(),
//                 content: cheerio('p >span', html).text().trim(),
//                 url: url,
//                 category: {
//                     category: cheerio('span.qode-category-name', html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source: {
//                     id: 'dia',
//                     name: 'dia'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

crontab.scheduleJob('*/5 * * * *', getdzairdailyResponse = (req, res) => {
    // getdzairdailyResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        dzairdaily.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const category = cheerio('h2.page-heading__title', html).text();
                    // const description = cheerio('.excerpt',html).text().trim();
                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const obj = {
                            linkUrl: cheerio('h3 > a', html)[i].attribs.href
                        }
                        articalUrls.push(obj);
                    }
                    var $ = cheerio.load(html);
                    $('.excerpt').each(function (i, elem) {
                        articalUrls[i].description = $(this).text().trim();
                    });
                    console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getParsedzairdailyData(url, category);
                        })
                    );
                })
                .then(function (articals) {
                    console.log("atricals-=======>", articals, articals.length)
                    articals.forEach(artical => {
                        console.log("AAAAAAAAAAAAAAAAAAAA:", artical)
                        if (artical) {
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
                        }
                    })
                })

                .catch(function (err) {
                    console.log("err", err);
                    // res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getParsedzairdailyData = function (url, category) {
    console.log("urlllll=====>", url, category)
    return rp(url.linkUrl)
        .then(function (html) {
            return {
                title: cheerio('h1.entry-title', html).text(),
                urlToImage: cheerio('img.wp-post-image', html).attr('src'),
                author: cheerio('span.entry-author', html).text().trim(),
                publishedAt: cheerio('.entry-meta >time', html).text().trim(),
                content: cheerio('.entry-content p ,.entry-content h4', html).text().trim(),
                description: url.description,
                url: url.linkUrl,
                category: {
                    category: category
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                },
                source: {
                    id: 'dzairdaily',
                    name: 'dzairdaily'
                }
            };
        })
        .catch(function (err) {
            console.log("errr=====>", err)
            //handle error
        });
};

crontab.scheduleJob('*/5 * * * *', getInterLignesResponse = (req, res) => {
    // getInterLignesResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        inter_lignes.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const category = cheerio('h1.mvp-feat1-pop-head', html).text();

                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const linkUrl = cheerio('a', html)[i].attribs.href;
                        const description = cheerio('p.mvp-blog-story-text left relative', html).text().trim();
                        articalUrls.push(linkUrl, description);
                    }
                    console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getInterLignesData(url, category);
                        })
                    );
                })
                .then(function (articals) {
                    console.log("atricals-=======>", articals, articals.length)
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
                    console.log("err", err);
                    res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getInterLignesData = function (url, category) {
    console.log("urlllll=====>", url, category)
    return rp(url)

        .then(function (html) {
            return {
                title: cheerio('h2.mvp-stand-title', html).text(),
                urlToImage: cheerio('img.lazyloaded', html).attr('src'),
                author: cheerio('.author-name a', html).text().trim(),
                publishedAt: cheerio('.post-date', html).text().trim(),
                content: cheerio('.theiaPostSlider_slides p', html).text().trim(),
                description: description,
                url: url,
                category: {
                    category: category
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                },
                source: {
                    id: 'inter-lignes',
                    name: 'inter-lignes'
                }
            };
        })
        .catch(function (err) {
            console.log("errr=====>", err)
            //handle error
        });
};

crontab.scheduleJob('*/5 * * * *', getreportersResponse = (req, res) => {
    // getreportersResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        reporters.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const obj = {
                            linkUrl: cheerio('h3 > a', html)[i].attribs.href,
                        }
                        articalUrls.push(obj);
                    }
                    var $ = cheerio.load(html);
                    $('.td-excerpt').each(function (i, elem) {
                        articalUrls[i].description = $(this).text().trim();
                    });
                    console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getParsedreportersData(url);
                        })
                    );
                })
                .then(function (articals) {
                    console.log("atricals-=======>", articals, articals.length)
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
                    console.log("err", err);
                    res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getParsedreportersData = function (url) {
    console.log("urlllll=====>", url)
    return rp(url.linkUrl)
        .then(function (html) {
            return {
                title: cheerio('h1.entry-title', html).text(),
                urlToImage: cheerio('img.entry-thumb', html).attr('src'),
                author: cheerio('.td-post-author-name a', html).text().trim(),
                publishedAt: cheerio('span >time', html).text().trim(),
                content: cheerio('.td-post-content p', html).text().trim(),
                description: url.description,
                url: url.linkUrl,
                category: {
                    category: cheerio('.entry-category a', html).text().trim()
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                },
                source: {
                    id: 'reporters',
                    name: 'reporters'
                }
            };
        })
        .catch(function (err) {
            console.log("errr=====>", err)
        });
};

crontab.scheduleJob('*/5 * * * *', getalgeriepartResponse = (req, res) => {
    // getalgeriepartResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        algeriepart.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const category = cheerio('h1', html).text();
                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const obj = {
                            linkUrl: cheerio('h3 > a', html)[i].attribs.href
                        }
                        // const linkUrl = cheerio('h3 > a', html)[i].attribs.href;
                        articalUrls.push(obj);
                    }
                    var $ = cheerio.load(html);
                    $('div.td-excerpt').each(function (i, elem) {
                        articalUrls[i].description = $(this).text().trim();
                    });
                    console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getParsealgeriepartData(url, category);
                        })
                    );
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
                    console.log("err", err);
                    res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getParsealgeriepartData = function (url, category) {
    console.log("urlllll=====>", url, category)
    return rp(url.linkUrl)
        .then(function (html) {
            return {
                title: cheerio('h1.entry-title', html).text(),
                urlToImage: cheerio('img.entry-thumb', html).attr('src'),
                author: cheerio('.td-post-author-name > a', html).text().trim(),
                publishedAt: cheerio('span >time', html).text().trim(),
                content: cheerio('.td-post-content p', html).text().trim(),
                description: url.description,
                url: url.linkUrl,
                category: {
                    category: category
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                },
                source: {
                    id: 'algeriepart',
                    name: 'algeriepart'
                }

            };
        })
        .catch(function (err) {
            console.log("errr=====>", err)
            //handle error
        });
};

crontab.scheduleJob('*/5 * * * *', gettsaResponse = (req, res) => {
    // gettsaResponse = function (req, res) {
    console.log("=========")
    new Promise((reject, resolve) => {
        tsa.forEach(data => {
            var url = data
            rp(url)
                .then(function (html) {
                    console.log("html", html);
                    const articalLength = cheerio('h3 > a', html).length
                    const category = cheerio('section-title > span', html).text();
                    const articalUrls = [];
                    for (let i = 0; i < articalLength; i++) {
                        const linkUrl = cheerio('h1 > a', html)[i].attribs.href;
                        articalUrls.push(linkUrl);
                    }
                    console.log("articalurls===>", articalUrls)
                    return Promise.all(
                        articalUrls.map(function (url) {
                            return getParsetsaData(url, category);
                        })
                    );
                })
                .then(function (articals) {
                    console.log("atricals-=======>", articals.category)
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
                    console.log("err", err);
                    // res.send({ "err": "errr" })
                    //handle error
                });
        })
    })
    // }
})

const getParsetsaData = function (url, category) {
    console.log("urlllll=====>", url, category)
    return rp(url)
        .then(function (html) {
            return {
                title: cheerio('.article__title', html).text(),
                urlToImage: cheerio('img.i-amphtml-fill-content i-amphtml-replaced-content', html).attr('src'),
                author: cheerio('.article__meta-author', html).text().trim(),
                publishedAt: cheerio('.article__meta-time time', html).text().trim(),
                description: cheerio('.article__content p', html).text().trim(),
                url: url,
                category: {
                    category: category
                },
                country: {
                    country: 'DZ',
                    lang: 'fr'
                },
                source: {
                    id: 'tsa',
                    name: 'tsa'
                }
            };
        })
        .catch(function (err) {
            console.log("errr=====>", err)
            //handle error
        });
};

// crontab.scheduleJob('*/5 * * * *', getLiberteAlgerieResponse = (req, res) => {
// // getLiberteAlgerieResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         liberte_algerie.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('h1', html).text();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: cheerio('li.mvp-blog-story-wrap a', html)[i].attribs.href
//                         }
//                         articalUrls.push(obj);
//                     }
//                     var $ = cheerio.load(html)
//                     $('.mvp-blog-story-text p').each(function (i, elem) {
//                         articalUrls[i].description = $(this).text().trim();
//                     });
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseLiberteAlgerieData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                         })

//                         .catch(function (err) {
//                             console.log("err", err);
//                     res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// // }
// })

// const getParseLiberteAlgerieData = function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 title: cheerio('.span-8 span,.span-8 h4', html).text(),
//                 urlToImage: cheerio('img.post-image', html).attr('src'),
//                 author: cheerio('.date-heure > a', html).text().trim(),
//                 publishedAt: cheerio('.date-heure >span', html).text().trim(),
//                 content: cheerio('p', html).text().trim(),
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
//                     id: 'liberte-algerie',
//                     name: 'liberte-algerie'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getLesoirdalgerieResponse = (req, res) => {
// // getLesoirdalgerieResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         lesoirdalgerie.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('.type-date span', html).text();
//                     const articalUrls = [];
//                     for (let i = 0; i < articalLength; i++) {
//                         const linkUrl = cheerio('.item-container a', html)[i].attribs.href;
//                         articalUrls.push(linkUrl);
//                     }
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return getParseLesoirdalgerieData(url, category);
//                         })
//                     );
//                 })
//                 .then(function (articals) {
//                     articals.forEach(artical => {
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err", err);
//                     res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// // }
// })

// const getParseLesoirdalgerieData = function (url, category) {
//     console.log("urlllll=====>", url, category)
//     return rp(url)
//         .then(function (html) {
//             return {
//                 title: cheerio('.title-21', html).text(),
//                 urlToImage: cheerio('img.wp-post-image', html).attr('src'),
//                 author: cheerio('.author-tp-2 > a', html).text().trim(),
//                 publishedAt: cheerio('.date-tp-4', html).text().trim(),
//                 description: cheerio('p', html).text().trim(),
//                 url: url,
//                 category: {
//                     category: category
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'fr'
//                 },
//                 source:{
//                     id: 'lesoirdalgerie',
//                     name: 'lesoirdalgerie'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getDzfootResponse = (req, res) => {
// // getDzfootResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         dzfoot.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('h3 > a', html).length
//                     const category = cheerio('h1.big-cat-title', html).text().trim();
//                     const articalUrls = [];
//                     const json = [];
//                     var $ = cheerio.load(html);

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
//                         console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                     newsModel.find({ title: artical.title })
//                         .exec((err, foundNews) => {
//                             if (err) {
//                                 reject({ status: 500, message: 'Internal Serevr Error' });
//                             } else if (foundNews && foundNews.length) {
//                                 console.log("foundNews:", foundNews)
//                                 reject({ status: 401, message: 'news already created' });
//                             } else {
//                                 if(artical.title && artical.content) {
//                                     newsModel.create(artical,
//                                         function (err, news) {
//                                             if (err) {
//                                                 res.status(500).json({ message: 'News Not Created' })
//                                         } else {
//                                             console.log("presidants====>", news);
//                                             // res.status(200).json({totalResult: articals.length, artical: news })
//                                             // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                         }
//                                     })
//                                 } 
//                             }
//                         })
//                     })
//                 })

//                 .catch(function (err) {
//                     console.log("err", err);
//                     res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
// // }
// })

// const getParseDzfootData = function (url, category) {
//     // console.log("urlllll=====>", url.linkUrl, category)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 title: cheerio('h1.title', html).text().trim(),
//                 urlToImage: cheerio('img.lazy', html).attr('src'),
//                 author: cheerio('.meta', html).children().first().text().trim(),
//                 publishedAt: cheerio('.meta', html).children().last().text().trim(),
//                 content: cheerio('p', html).text().trim(),
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
//                     id: 'dzfoot',
//                     name: 'dzfoot'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//             //handle error
//         });
// };

// crontab.scheduleJob('*/5 * * * *', getennaharonlineResponse = (req, res) => {
//     // getennaharonlineResponse = function (req, res) {
//         new Promise((reject, resolve) => {
//             ennaharonline.forEach(data => {
//                 var url = data
//                 rp(url)
//                     .then(function (html) {
//                         console.log("html", html);
//                         const articalLength = cheerio('h2 > a', html).length
//                         // const category = cheerio('h2 .category-title span', html).text().trim();
//                         const articalUrls = [];
//                         const json = [];
//                         var $ = cheerio.load(html);

//                         // console.log("json=======>",json)
//                         for (let i = 0; i < articalLength; i++) {
//                             const obj = {
//                                 linkUrl: cheerio('h2 > a', html)[i].attribs.href,
//                             }
//                             if(obj.linkUrl) {
//                             articalUrls.push(obj);
//                             }
//                         }
//                         // $('p>font').each(function (i, elem) {
//                         //     articalUrls[i].description = $(this).text().trim();
//                         // });
//                         console.log("articalurls===>", articalUrls)
//                         return Promise.all(
//                             articalUrls.map(function (url) {
//                                 return parseennaharonlineResponse(url);
//                             })
//                         );
//                     })
//                     .then(function (articals) {
//                         console.log("articals", articals)
//                         articals.forEach(artical => {
//                             console.log("AAAAAAAAAAAAAAAAAAAA:",artical)
//                         newsModel.find({ title: artical.title })
//                             .exec((err, foundNews) => {
//                                 if (err) {
//                                     reject({ status: 500, message: 'Internal Serevr Error' });
//                                 } else if (foundNews && foundNews.length) {
//                                     console.log("foundNews:", foundNews)
//                                     reject({ status: 401, message: 'news already created' });
//                                 } else {
//                                     if(artical.title && artical.content) {
//                                         newsModel.create(artical,
//                                             function (err, news) {
//                                                 if (err) {
//                                                     res.status(500).json({ message: 'News Not Created' })
//                                             } else {
//                                                 console.log("presidants====>", news);
//                                                 // res.status(200).json({totalResult: articals.length, artical: news })
//                                                 // res.send({ status: 'ok', totalResult: articals.length, artical: news })
//                                             }
//                                         })
//                                     } 
//                                 }
//                             })
//                         })
//                     })

//                     .catch(function (err) {
//                         console.log("err", err);
//                         // res.send({ "err": "errr" })
//                         //handle error
//                     });
//             })
//         })
//     // }
//     })

// const parseennaharonlineResponse = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 // document.querySelector("h2.property-price a").textContent.trim() )
//                 title: cheerio('h2', html).text().trim(),
//                 urlToImage: cheerio('.full-article__featured-image >img', html).attr('src'),
//                 author: cheerio('em', html).text().trim(),
//                 publishedAt: cheerio('.full-article__metadata-date', html).children().first().text().trim(),
//                 content: cheerio('p', html).text().trim(),
//                 // description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: cheerio('.article__category',html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 },
//                 source: {
//                     id: 'ennaharonline',
//                     name: 'ennaharonline'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//         });
// };


// crontab.scheduleJob('*/5 * * * *', getelkhabarResponse = (req, res) => {
//     //     // getelkhabarResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         elkhabar.forEach(data => {
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
//                             linkUrl: 'https://www.elkhabar.com/' + (cheerio('.main_article', html)[i].attribs.href),
//                         }
//                         if (obj.linkUrl) {
//                             articalUrls.push(obj);
//                         }
//                     }
//                     // var $ = cheerio.load(html);
//                     // $('.description').each(function (i, elem) {
//                     //     articalUrls[i].description = $(this).text().trim();
//                     // });
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return parseelkhabarResponse(url, category);
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
//                     console.log("err", err);
//                     // res.send({ "err": "errr" })
//                     //handle error
//                 });
//         })
//     })
//     // }
// })

// const parseelkhabarResponse = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 // document.querySelector("h2.property-price a").textContent.trim() )
//                 title: cheerio('#article_title', html).text().trim(),
//                 urlToImage: cheerio('#article_img >img', html).attr('src'),
//                 author: cheerio('.subinfo > b', html).text().trim(),
//                 publishedAt: cheerio('.relative_time', html).children().first().text().trim(),
//                 content: cheerio('#article_body_content > p', html).text().trim(),
//                 description: cheerio('.description', html).text().trim(),
//                 url: url.linkUrl,
//                 category: {
//                     category: cheerio('.category_title > a', html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 },
//                 source: {
//                     id: 'elkhabar',
//                     name: 'elkhabar'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
//         });
// };



// crontab.scheduleJob('*/5 * * * *', getdzlayerResponse = (req, res) => {
//     //     // getelkhabarResponse = function (req, res) {
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

// link: h3> a 
// category : h1 .page-title main page
// description : .post-excerpt 
// author : .meta-author > a 
// publishedAt : .meta-item
// title : .post-title h1 
// urltoimage : .featured-area-inner > img 
// content : .entry-content p 
// country : DZ 
// lang : ar 
// id : dzlayer 
// name : dzlayer 

// const parsedzlayerResponse = function (url) {
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             return {
//                 // document.querySelector("h2.property-price a").textContent.trim() )
//                 title: cheerio('.entry-header > h1 ', html).text().trim(),
//                 urlToImage: cheerio('.single-featured-image > img', html).attr('src'),
//                 author: cheerio('.meta-author > a ', html).text().trim(),
//                 publishedAt: cheerio('.meta-item', html).children().first().text().trim(),
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
//     //     // getelkhabarResponse = function (req, res) {
//     new Promise((reject, resolve) => {
//         elbilad.forEach(data => {
//             var url = data
//             rp(url)
//                 .then(function (html) {
//                     console.log("html", html);
//                     const articalLength = cheerio('.post_title > h3', html).length
//                     const category = cheerio('#right_area > a', html).text().trim();
//                     const articalUrls = [];

//                     // console.log("json=======>",json)
//                     for (let i = 0; i < articalLength; i++) {
//                         const obj = {
//                             linkUrl: 'https://www.elbilad.net/' + (cheerio('.link', html)[i].attribs.href),
//                         }
//                         if (obj.linkUrl) {
//                             articalUrls.push(obj);
//                         }
//                     }
//                     var $ = cheerio.load(html);
//                     // $('.entry-content > p').each(function (i, elem) {
//                     //     articalUrls[i].description = $(this).text().trim();
//                     // });
//                     console.log("articalurls===>", articalUrls)
//                     return Promise.all(
//                         articalUrls.map(function (url) {
//                             return parseelbiladResponse(url, category);
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


// const parseelbiladResponse = function (url) {

//     // $('.entry-content > p')
//     console.log("urlllll=====>", url)
//     return rp(url.linkUrl)
//         .then(function (html) {
//             var $ = cheerio.load(html);
//             return {

//                 // document.querySelector("h2.property-price a").textContent.trim() )
//                 title: cheerio('.right_area > h1 ', html).text().trim(),
//                 urlToImage: cheerio('.article_video_frame > img', html).attr('src'),
//                 author: $('.date_heure').eq(1).text().trim(),
//                 publishedAt: $('.date_heure').eq(0).text().trim(),
//                 content: cheerio('#text_space > p', html).text().trim(),
//                 description: cheerio('.typo > p', html).text().trim(),
//                 description: url.description,
//                 url: url.linkUrl,
//                 category: {
//                     category: cheerio('h1 > a', html).text().trim()
//                 },
//                 country: {
//                     country: 'DZ',
//                     lang: 'ar'
//                 },
//                 source: {
//                     id: 'elbilad',
//                     name: 'elbilad'
//                 }
//             };
//         })
//         .catch(function (err) {
//             console.log("errr=====>", err)
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



// /**
//  * News Title Wise get data
//  */
// getNewsByTitle = function(req,res) {
//     console.log("TILTE:",req.body.title)
//     newsModel.find({title:req.body.title}).exec((err, data) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else {
//             console.log("LENGTH:",data.length)
//             res.send({ status: 200, message: 'Title Wise News Get Succesfully', data: data })
//         }
//     });
// }

/**
 * Country & category wise get news
 */
// getNewsByCategoryAndCountry = function(req,res) {
//     console.log("QUERY:",req.query.country,req.query.category)
//     newsModel.find({$and: [{'category.category' : req.query.category},{'country.country' : req.query.country}]}).exec((err,news) => {
//         if (err) {
//             res.send({ status: 500, message: 'Internal Serevr Error' });
//         } else if(news && news.length){
//             console.log("LENGTH:",news.length)
//             res.send({ status: 200, message: 'Category & Country Wise News Get Succesfully', data: news })
//         } else {
//             res.send({status:500,message:'News Not Found'});
//         }
//     })
// }

module.exports = {
    // getElwatanResponse: getElwatanResponse,
    // getAlg24Response: getAlg24Response,
    // getdzvidResponse: getdzvidResponse,
    // getAlgerie360Response: getAlgerie360Response,
    // getalgerieecoResponse: getalgerieecoResponse,
    getdiaResponse: getdiaResponse,
    getdzairdailyResponse: getdzairdailyResponse,
    getInterLignesResponse: getInterLignesResponse,
    getreportersResponse: getreportersResponse,
    getalgeriepartResponse: getalgeriepartResponse,
    gettsaResponse: gettsaResponse,
    // getLiberteAlgerieResponse: getLiberteAlgerieResponse,
    // getLesoirdalgerieResponse: getLesoirdalgerieResponse,
    // getDzfootResponse: getDzfootResponse,
    // getCountryWiseData: getCountryWiseData,
    // getLanguageWiseData: getLanguageWiseData,
    // getCategoryWiseData: getCategoryWiseData,
    // // deleteBlankRecord: deleteBlankRecord,
    // getNewsByTitle: getNewsByTitle,
    // getNewsByCategoryAndCountry: getNewsByCategoryAndCountry,

    // getennaharonlineResponse: getennaharonlineResponse,
    // getelkhabarResponse: getelkhabarResponse,
    // getdzlayerResponse : getdzlayerResponse
    // getelbiladResponse : getelbiladResponse
}



// DZLAYER

// link: h3> a 
// category : h1 .page-title main page
// description : .post-excerpt 
// author : .meta-author > a 
// publishedAt : .meta-item
// title : .post-title h1 
// urltoimage : .featured-area-inner > img 
// content : .entry-content p 
// country : DZ 
// lang : ar 
// id : dzlayer 
// name : dzlayer 


// elbilad
// category : h1 > a
// description : #text_space > p
// title : right_area > h1
// content : text_space > p 



// LAST 
// title : entry-header> h1
// image : single-featured-image > img 
// content : p 
// publishedAt : .date meta-item fa-before 












