var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/dumall');
var Goods = require('../models/goods');
var User = require('../models/user');

mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success.')
});

mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail.')
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected.')
})
// let nameStr = 'abcdefghijklmnopqrstuvwxyz'
// // let nameArr = [...nameStr]
// let goodsArr = []
// for (let i = 0; i < 20; i++) {
//   let ran26 = Math.ceil(Math.random() * 26)
//   let str = nameStr.substring(ran26)
//   goodsArr.push({
//     "productId":Math.ceil(Math.random() * 100000),
//     "productName":str+i,
//     "prodcutPrice":Number(Math.ceil(Math.random() * 1000)),
//     "checked":false,
//     "productNum":1,
//     "productImage":Math.ceil(Math.random() * 14)+'.jpg'
//   })
// }
// console.log(goodsArr)
// Goods.create(goodsArr)

router.get('/list', function (req, res, next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceGt = ''
  let priceLte = ''
  let params = {}
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break
      case '1': priceGt = 100; priceLte = 500; break
      case '2': priceGt = 500; priceLte = 1000; break
      case '3': priceGt = 1000; priceLte = 5000; break
    }
    params = {'prodcutPrice': {
      $gt: priceGt.toString(),
      $lte: priceLte.toString()
    }}
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'prodcutPrice': sort})
  goodsModel.exec(function (err, doc) {

    if (err) {
      res.json({
        status: 1
      })
    } else {
      res.json({
        status: 0,
        result: {
          count: doc.length,
          list: doc
        }

      })
    }
  })
})

router.post('/addCart', function (req, res, next) {
  let productId = req.body.productId
  let userId = req.cookies.userId
  User.findOne({userId: userId}).then(function (data) {
    console.log(data)
  })

  User.findOne({userId: userId}, function (err,userDoc) {
    if (err) {
      res.json({
        status:"1",
        msg:err
      })
    } else {
      console.log(Object.prototype.toString.call(userDoc))
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
            if(item.productId == productId){
              goodsItem = item;
              item.productNum ++
            }
        });
        console.log(goodsItem)
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc1'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, function (err1,doc) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1
              })
            } else {
              console.log(doc,11)
              if (doc) {
                doc.productNum = 1
                doc.checked = '1'
                userDoc.cartList.push(doc)
                console.log(userDoc.cartList)
                userDoc.save(function (err2,doc2) {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2
                    })
                  } else {
                    res.json({
                      status:'0',
                      msg: '',
                      result: 'suc2'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })

})
router.get('/', function (req, res, next) {
  res.send('respond with a api resource6666777777777')
})

module.exports = router
