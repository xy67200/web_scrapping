const express = require('express');
const router = express.Router();

const newsController = require('../Controller/news.controller');

// router.get("/get-elwatan-data",newsController.getElwatanResponse); //Remaining
// router.get("/get-alg24-data",newsController.getAlg24Response);
// router.get("/get-algerie360-data",newsController.getAlgerie360Response);

// router.get("/get-dzfoot-data",newsController.getDzfootResponse);   //thai gyu

// router.get("/get-interlignes-data",newsController.getInterLignesResponse);
// router.get("/get-lesoirdalgerie-data",newsController.getLesoirdalgerieResponse);
// router.get("/get-liberte-data",newsController.getLiberteAlgerieResponse);
// router.get("/get-algerieeco-data",newsController.getalgerieecoResponse);  //DONE
// router.get("/get-algeriepart-data",newsController.getalgeriepartResponse); //DONE
// router.get("/get-dia-data",newsController.getdiaResponse); //DONE , DECS not
// router.get("/get-dzairdaily-data",newsController.getdzairdailyResponse); //done
// router.get("/get-dzvid-data",newsController.getdzvidResponse);
// router.get("/get-reporter-data",newsController.getreportersResponse);  //done
// router.get("/get-tsa-data",newsController.gettsaResponse);
// router.get("/get-country-wise-data/:country",newsController.getCountryWiseData);
// router.get("/get-language-wise-data/:lang",newsController.getLanguageWiseData);
// router.get("/get-category-wise-data/:category",newsController.getCategoryWiseData);
// router.get("/get-title-wise",newsController.getNewsByTitle);
// router.get("/get-news-by-country-and-category",newsController.getNewsByCategoryAndCountry);
// router.get("/get-ennaharonline",newsController.getennaharonlineResponse);
// router.get("/get-elkhabar",newsController.getelkhabarResponse) //URL REMAIN 
// router.get("/get-dzlayer",newsController.getdzlayerResponse);
router.get("/get-elbilad",newsController.getelbiladResponse);
router.get("/get-latest-news",newsController.getLatestNews);

module.exports = router;


// getdiaResponse - !desc