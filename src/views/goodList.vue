<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="fir">Goods</span>
        <span slot="sec" @click="getGoodsList()">only for test</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" @click="sortFlagC()" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}" @click="priceChecked='all'">All</a></dd>
                <dd v-for=" (price,index) in priceFilter " v-bind:key="price.endPrice">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul >
                  <li v-for=" pro in goodsList " v-bind:key="pro.productId">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+pro.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{ pro.productName }}</div>
                      <div class="price">{{pro.prodcutPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" v-bind:titleA="pro.productId" @click="addCar(pro.productId)" >加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="loadingWrap">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay " v-show="overLayFlag" @click="closePop"></div>
      <Modal :mdShow="modalConfirm" >
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="modalConfirm = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </Modal>
      <nav-footer></nav-footer>
    </div>

</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/login.css'
import './../assets/css/goodlist.css'
import NavHeader from './../views/header'
import NavFooter from './../views/footer'
import NavBread from './../views/bread'
import Modal from './../components/Modal'

import axios from 'axios'

export default {
  data () {
    return {
      goodsList: [],
      page: 1,
      pageSize: 8,
      sortFlag: true,
      busy: true,
      loading: false,
      modalConfirm: false,
      priceFilter: [
        {
          startPrice: 0,
          endPrice: 100
        },
        {
          startPrice: 100,
          endPrice: 500
        },
        {
          startPrice: 500,
          endPrice: 1000
        },
        {
          startPrice: 1000,
          endPrice: 2000
        }
      ],
      priceChecked: 'all',
      overLayFlag: false,
      filterBy: false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getGoodsList()
    })
  },
  methods: {
    getGoodsList: function (flag) {
      let param = {
        page:this.page,
        pageSize:this.pageSize,
        sort:this.sortFlag?1:-1,
        priceLevel:this.priceChecked
      };
      let t = this;
      this.loading = true;
      axios.get('/api/api/list', {
        params:param
      }).then((response) => {
        t.loading = false
        let res= response.data
        console.log(res)
        if (res.status == 0) {
          if(flag){
            this.goodsList= this.goodsList.concat(res.result.list)
            if(!res.result.count){
              this.busy= true
            }else {
              this.busy= false
            }
          }else {
            this.goodsList = res.result.list
            this.busy = false
          }
        }else {

        }
      })
    },
    addCar: function (productId) {
      let thisT = this
      axios.post('/api/api/addCart', {
        productId:productId
      }).then((response) => {
        // t.loading = false
        let res= response.data
        console.log(res)
        if (res.status === '0') {
          thisT.modalConfirm = true
        }else {

        }
      })
    },
    sortFlagC: function () {
      this.sortFlag = ! this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    setPriceFilter: function (index) {
      this.priceChecked = index
      this.getGoodsList()
      this.page = 1
      this.closePop()

    },
    showFilterPop: function () {
      this.overLayFlag = true
      this.filterBy = true
    },
    closePop: function () {
      this.overLayFlag = false
      this.filterBy = false
    },
    loadMore: function() {
      this.busy = true;
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 1000);
    }
  }
}
</script>
