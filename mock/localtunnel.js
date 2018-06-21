import localtunnel from 'localtunnel'

var tunnel = localtunnel(8080)

tunnel.on('request', function (info) {
  console.log(info)
})
tunnel.on('close', function () {

})
