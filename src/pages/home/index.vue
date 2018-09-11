<template>
    <div class="home-container">
        <p>你当前所在城市为：{{currentCity}}</p>
    </div>
</template>

<script>
import utils from './../../utils/index.js';
// 引入SDK核心类
import {QQMapWX} from './../../assets/js/qqmap-wx-jssdk.js';
export default {
    data () {
        return {
            // 用户授权信息
            AuthInfo: {},
            // 当前城市
            currentCity: '',
            // 腾讯位置服务API核心类实例
            qqmapsdk: null
        }
    },
    methods: {
        // 获取最近上映电影（参数：地址[address]）
        // getRecentlyReleased(address) {

        // },
        // 获取用户当前所在城市
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        getCurrentCity() {
            // 非初始化进入该页面,且未授权
            if (this.AuthInfo['scope.userLocation'] != undefined && this.AuthInfo['scope.userLocation'] != true) {
                wx.showModal({
                    title: '请求授权当前位置',
                    content: '需要获取您的地理位置，请确认授权',
                    success: (res) => {
                        if (res.confirm) {
                            wx.openSetting({
                                success: () => {
                                    if (this.AuthInfo['scope.userLocation'] == true) {
                                        wx.showToast({
                                            title: '授权成功',
                                            icon: 'success'
                                        });
                                        //再次授权，调用wx.getLocation的API
                                        this.getCity();
                                    } else {
                                        wx.showToast({
                                            title: '授权失败',
                                            icon: 'none'
                                        });
                                    }
                                }
                            });
                        } else if (res.cancel) {
                            wx.showToast({
                                title: '拒绝授权',
                                icon: 'none'
                            });
                        }
                    }
                });
            } else if(this.AuthInfo['scope.userLocation'] == undefined) {
                // 初始化进入该页面
                this.getCity();
            } else {
                // 已授权
                this.getCity();
            }
        },
        // 获取城市
        getCity() {
            wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                    let latitude = res.latitude;
                    let longitude = res.longitude;
                    this.qqmapsdk.reverseGeocoder({
                        location: {
                            latitude,
                            longitude
                        },
                        success: (res) => {
                            this.currentCity = res.result.ad_info.city;
                        },
                        fail: (res) => {
                            console.log('获取当前城市失败', res);
                        }
                    });
                }
            });
        }
    },
    onLoad () {
        // 实例化API核心类
        this.qqmapsdk = new QQMapWX({
            key: 'F75BZ-LVX63-EII3P-YBKWW-2S636-LLBCR'
        });
        // 获取用户授权信息
        utils.getAuthInfo().then((res) => {
            this.AuthInfo = res;
            // 获取用户当前所在城市
            this.getCurrentCity();
        }).catch(() => {
            wx.showToast({
                title: '获取用户信息失败',
                icon: 'none'
            });
        });
    }
}
</script>
