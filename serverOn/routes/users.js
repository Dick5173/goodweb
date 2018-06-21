var express = require('express');
var router = express.Router();
let User = require('../models/user')
require('./../util/util')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
})
// let nameStr = 'abcdefghijklmnopqrstuvwxyz'
// let nameArr = [...nameStr]
// let goodsArr = []
// for (let i = 0; i < 20; i++) {
//   let ran26 = Math.ceil(Math.random() * 26)
//   let str = nameStr.substring(ran26)
//   goodsArr.push({
//     "userId":'10000000' + Math.ceil(Math.random() * 100000),
//     "userName": str + i,
//     "userPwd": str + i + 'pwd',
//     "orderList":[],
//     "cartList":[],
//     "addressList":[
//       {
//         "addressId": String,
//         "userName": str + i,
//         "streetName": str + (i * 100),
//         "postCode": 1000 + i,
//         "tel": 1860000000 + i,
//         "isDefault": true
//       }
//     ]
//   })
// }
// console.log(goodsArr)
// User.create(goodsArr)

router.post('/login', function (req, res, next) {
  console.log(333)
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param)
    .then(function (doc) {
      if (doc) {
        if (doc) {
          res.cookie('userId', doc.userId, {
            path: '/',
            maxAge: 1000 * 60 * 60
          })
          console.log(req.session)
          // req.session.user = doc
          res.json({
            status: '0',
            msg: '',
            result: {
              userName: doc.userName
            }
          })
        }
      }
    })
})
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    result: ''
  })
})
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})
router.post('/cart/del', function (req, res, next) {
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({
    userId: userId
  },{
    $pull:{
      'cartList':{
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
})
router.post('/cart/edit', function (req, res, next) {
  let userId = req.cookies.userId
  let productNum = req.body.productNum
  let productId = req.body.productId
  let checked = req.body.checked
  User.update({
    userId: userId,
    'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
})
router.get('/addressList', function (req, res, next) {
  let userId = req.cookies.userId

  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        })
      }
    }
  })
})
router.post('/setDefault', function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  console.log(req.body)
  if (!addressId) {
    res.json({
      status: '1',
      msg: 'the addressId is null',
      result: ''
    })
    return
  }
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList
      addressList.forEach((item) => {
        if (item.addressId === addressId) {
          item.addressId = true
        } else {
          item.addressId = false
        }
      })
      console.log(doc)
      doc.save(function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          if (doc) {
            res.json({
              status: '0',
              msg: 'suc',
              result: ''
            })
          }
        }
      })
    }
  })
})
router.post('/delAddress', function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  console.log(req.body)
  if (!addressId) {
    res.json({
      status: '1',
      msg: 'the addressId is null',
      result: ''
    })
    return
  }
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList
      addressList.forEach((item, index) => {
        if (item.addressId === addressId) {
          addressList.splice(index, 1)
        }
      })
      console.log(doc)
      doc.save(function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          if (doc) {
            res.json({
              status: '0',
              msg: 'suc',
              result: ''
            })
          }
        }
      })
    }
  })
})
router.post("/payMent", function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotal = req.body.orderTotal
  User.findOne({userId: userId}, function (err,doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      var address = '', goodsList = []
      //获取当前用户的地址信息
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })
      //获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item);
        }
      });

      var platform = '622'
      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)

      var sysDate = new Date().Format('yyyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId = platform + r1 + sysDate + r2
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      }

      doc.orderList.push(order)

      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
     }
  })
})
//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
  var userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId}, function (err,userInfo) {
      if(err){
          res.json({
             status:'1',
             msg:err.message,
             result:''
          });
      }else{
         var orderList = userInfo.orderList;
         if(orderList.length>0){
           var orderTotal = 0;
           orderList.forEach((item)=>{
              if(item.orderId == orderId){
                orderTotal = item.orderTotal;
              }
           });
           if(orderTotal>0){
             res.json({
               status:'0',
               msg:'',
               result:{
                 orderId:orderId,
                 orderTotal:orderTotal
               }
             })
           }else{
             res.json({
               status:'120002',
               msg:'无此订单',
               result:''
             });
           }
         }else{
           res.json({
             status:'120001',
             msg:'当前用户未创建订单',
             result:''
           });
         }
      }
  })
});



module.exports = router
