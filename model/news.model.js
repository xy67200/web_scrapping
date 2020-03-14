const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    // name: {type:String}
    createdAt : {type:Date,default:Date.now()},
    title : {type:String},
    urlToImage : {type:String},
    author : {type:String},
    publishedAt : {type:String},
    description : {type:String},
    content : {type:String},
    url : {type:String},
    category : {
        category : {type:String}
    },
    country : {
        country : {type:String},
        lang: {type:String}
    }
});



module.exports = mongoose.model('news',newsSchema);