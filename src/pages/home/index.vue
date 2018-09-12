<template>
    <div class="home-container">
        <div class="movie-container" v-for="item in movies" :key="item.id" v-if="movies.length > 0">
          <img :src="item.images.large || item.images.small || item.images.medium" alt="电影剧照" class="movie-img">
          <p class="movie-info">{{item.title}}<span class="movie-score">{{item.rating.average}}</span></p>
        </div>
    </div>
</template>

<script>
import utils from "./../../utils/index.js";
// 引入SDK核心类
import { QQMapWX } from "./../../assets/js/qqmap-wx-jssdk.js";
export default {
  data() {
    return {
      // 用户授权信息
      AuthInfo: {},
      // 当前城市
      currentCity: "",
      // 腾讯位置服务API核心类实例
      qqmapsdk: null,
      // 电影数据
      movies: [],
      // 分页数据
      Pagination: {
        start: 0,
        count: 15
      }
    };
  },
  // 上拉触底事件
  onReachBottom() {
    this.Pagination.start += this.Pagination.count;
    this.getRecentlyReleased();
  },
  methods: {
    // 获取最近上映电影（参数：地址[address]）
    getRecentlyReleased() {
      let url = `https://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=${this.currentCity}&start=${this.Pagination.start}&count=${this.Pagination.count}`;
      url = encodeURI(url)
      this.$http.get(url)
        .then(res => {
          if (res.data.subjects.length == 0) {
            wx.showToast({
                        title: "没有更多数据了",
                        icon: "none"
                      });
          }
          this.movies = this.movies.concat(res.data.subjects);
        })
        .catch(err => {
          wx.showToast({
                        title: "请求电影失败",
                        icon: "none"
                      });
        });
    },
    // 获取用户当前所在城市
    // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
    // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
    // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
    getCurrentCity() {
      return new Promise((resolve, reject) => {
        // 非初始化进入该页面,且未授权
        if (this.AuthInfo["scope.userLocation"] != undefined &&this.AuthInfo["scope.userLocation"] != true) {
          wx.showModal({
            title: "请求授权当前位置",
            content: "需要获取您的地理位置，请确认授权",
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: () => {
                    if (this.AuthInfo["scope.userLocation"] == true) {
                      wx.showToast({
                        title: "授权成功",
                        icon: "success"
                      });
                      //再次授权，调用wx.getLocation的API
                      resolve(true);
                    } else {
                      wx.showToast({
                        title: "授权失败",
                        icon: "none"
                      });
                      reject(false);
                    }
                  }
                });
              } else if (res.cancel) {
                wx.showToast({
                  title: "拒绝授权",
                  icon: "none"
                });
                reject(false);
              }
            }
          });
        } else if (this.AuthInfo["scope.userLocation"] == undefined) {
          // 初始化进入该页面
          resolve(true);
        } else {
          // 已授权
          resolve(true);
        }
      });
    },
    // 获取城市
    getCity(isAllow) {
      return new Promise((resolve, reject) => {
           if (isAllow) {
              wx.getLocation({
                type: "wgs84",
                success: res => {
                    let latitude = res.latitude;
                    let longitude = res.longitude;
                    this.qqmapsdk.reverseGeocoder({
                        location: {
                            latitude,
                            longitude
                        },
                        success: res => {
                            resolve(res.result.ad_info.city);
                        },
                        fail: res => {
                            wx.showToast({
                                title: "获取当前城市失败",
                                icon: "none"
                            });
                            reject(res);
                        }
                    });
                }
            });
          } else {
              reject();
          }
      });
    }
  },
  onLoad() {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: "F75BZ-LVX63-EII3P-YBKWW-2S636-LLBCR"
    });
    
    (async () => {
        // 获取用户授权信息
        this.AuthInfo = await utils.getAuthInfo();
        // 获取获取资格
        let isAllow = await this.getCurrentCity();
        // 获取用户当前所在城市
        this.currentCity = await this.getCity(isAllow);
        // 获取上映的电影
        this.getRecentlyReleased();
    })();
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  padding-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .movie-container {
    width: 240rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 0 2rpx rgba(0,0,0,0.1);
    .movie-img {
      width: 100%;
      height: 324rpx;
      margin-bottom: 10rpx;
    }
    .movie-info {
      text-align: center;
      font-size: 26rpx;
      color: #27BDFA;
      .movie-score {
        margin-left: 10rpx;
        color: #e09015;
      }
    }
  }
}
</style>
