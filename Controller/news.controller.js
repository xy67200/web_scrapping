const cheerio = require("cheerio");
const axios = require("axios");
const rp = require("request-promise");
const newsModel = require("../model/news.model");
const crontab = require("node-crontab");
const async = require("async");
var moment = require("moment");

const elwatan = [
  "https://www.elwatan.com/category/edition/actualite",
  "https://www.elwatan.com/category/edition/sports",
  "https://www.elwatan.com/category/edition/economie",
  "https://www.elwatan.com/category/edition/culture",
  "https://www.elwatan.com/category/edition/international",
  "https://www.elwatan.com/category/pages-hebdo/sante"
];
const articalUrlsElwatan = [];
getElwatanResponse = (req, res) => {
  //loop for array of category for elwatan
  async.forEachOfSeries(
    elwatan,
    (elwatan, index, callback) => {
      console.log("INDEX OF ELWATAN WEBSITES ARRAY", index);
      axios.get(elwatan).then(response => {
        const $ = cheerio.load(response.data);
        const totalNewsLength = $("h3 > a").length;
        const category = $(".bc-item > strong").text();

        //loop for scraping articles link
        for (let i = 0; i < totalNewsLength; i++) {
          const obj = {
            category: category,
            linkUrl: $("h3 > a")[i].attribs.href,
            description: $(".p p").text()
          };
          articalUrlsElwatan.push(obj);
        }
        callback();
      });
    },
    error => {
      if (error) {
        console.error("error");
      } else {
        // Here we will get all the links of Articles for the elwatan websites

        //This is async series for looping through array of websites and storing & scraping one by one
        async.forEachOfSeries(
          articalUrlsElwatan,
          (singleArticleUrl, index, callback) => {
            const options = {
              uri: singleArticleUrl.linkUrl,
              transform: function(body) {
                return cheerio.load(body);
              }
            };

            rp(options)
              .then($ => {

                //Object for storing article in the database
                const singleArticle = {
                  source: {
                    id: "elwatan",
                    name: "El Watan"
                  },
                  title: $(".title-21").text(),
                  urlToImage: $(".attachment-post-thumbnail").attr("src"),
                  author: $(".author-tp-2 > a").text().trim(),
                  publishedAt: $("meta[property='article:published_time']").attr("content"),
                  content: $(".texte > p").text().trim(),
                  url: singleArticleUrl.linkUrl,
                  description: singleArticleUrl.description.substring(0, 200) + "...",
                  category: {
                    category: singleArticleUrl.category
                  },
                  country: {
                    country: "DZ",
                    lang: "fr"
                  }
                };

                //First it will find weather the article already present!
                newsModel
                  .find({ title: singleArticle.title })
                  .exec((err, foundArticle) => {
                    if (err) {
                      console.log("SOMETHING WENT WRONG IN FINDING ARTICLE")
                      callback();
                    } else if (foundArticle && foundArticle.length) {
                      console.log("ARTICLE ALREADY PRESENT WITH TITLE **************", singleArticle.title);
                      callback();
                    } else {

                      //Condition for: if article not found and if we are able to scrap title and content
                      if (singleArticle.title && singleArticle.content) {
                        newsModel.create(singleArticle, function(err, news) {
                          if (err) {
                            callback();
                            console.log(
                              "Article NOT CREATED WITH TITLE ====== ",
                              singleArticle.title
                            );
                          } else {
                            //Article successfully added to database
                            callback();
                            console.log(
                              "Article CREATED WITH TITLE ******** ",
                              singleArticle.title
                            );
                          }
                        });
                      }
                    }
                  });
              })
              .catch(err => {
                console.log(err);
              });
          },
          error => {
            if (error) {
              console.error("error");
            } else {

              //This is the final completion of scraping all the websites.
              //Here we are sending the success res with status code 200.
              console.log("Article STORED OR ASYNC LOOP FOR ALL LINKS COMPLETED");
              return res.status(200).json({ message: "STORED" });
            }
          }
        );
        console.log(" SUCCESSFULLY GOT ALL ARTICLES LINKS FOR ELWATAN WEBSITES ");
      }
    }
  );
};
module.exports = {
  getElwatanResponse: getElwatanResponse
};