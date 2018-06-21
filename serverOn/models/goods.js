var mongoose = require('mongoose')
var Schema = mongoose.Schema

var produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "prodcutPrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
});

module.exports = mongoose.model('Good',produtSchema);
