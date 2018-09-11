<template>
  <div class="container">

    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <span>{{userInfo.nickName}}</span>
        <span>欢迎来到电影推荐ヽ( ^∀^)ﾉ</span>
      </div>
    </div>

    <button class="primary-btn" @click="bindViewTap">进入首页</button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  components: {
  },

  methods: {
    bindViewTap () {
      const url = '../home/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    // clickHandle (msg, ev) {
    //   console.log('clickHandle:', msg, ev)
    // }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
@import './../../assets/scss/index.scss';
.container {
  font-size: $largeFont;
  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    .userinfo-avatar {
      width: 200rpx;
      height: 200rpx;
      margin: 20rpx;
      border-radius: 50%;
    }
    .userinfo-nickname {
      text-align: center;
      color: #92999F;
      span {
        display: block;
        margin-top: 12rpx;
      }
    }
  }
  .primary-btn {
    margin-top: 100rpx;
    background-image: linear-gradient(to right, #27BDFA, #45D9FF);
    color: white;
    border-radius: 50rpx;
  }
}
</style>
