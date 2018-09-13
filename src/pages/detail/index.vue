<template>
    <div class="detail-container" v-if="movieInfo !== null">
        <div class="top-container">
            <img class="movie-image" :src="movieInfo.images.large" alt="电影封面">
            <div class="movie-info">
                <p class="title">{{movieInfo.title}}</p>
                <p>豆瓣评分：<span class="score">{{movieInfo.rating.average}}</span></p>
                <p>导演：<span v-for="(item, index) in movieInfo.directors" :key="item.id">{{item.name}}<span v-if="index !== movieInfo.directors.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>编剧：<span v-for="(item, index) in movieInfo.writers" :key="item.id">{{item.name}}<span v-if="index !== movieInfo.writers.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>主演：<span v-for="(item, index) in movieInfo.casts" :key="item.id">{{item.name}}<span v-if="index !== movieInfo.casts.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>类型：<span v-for="(item, index) in movieInfo.genres" :key="item">{{item}}<span v-if="index !== movieInfo.genres.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>制片国家/地区：<span v-for="(item, index) in movieInfo.countries" :key="item">{{item}}<span v-if="index !== movieInfo.countries.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>语言：<span v-for="(item, index) in movieInfo.languages" :key="item">{{item}}<span v-if="index !== movieInfo.languages.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>上映日期：<span v-for="(item, index) in movieInfo.pubdates" :key="item">{{item}}<span v-if="index !== movieInfo.pubdates.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>片长：<span v-for="(item, index) in movieInfo.durations" :key="item">{{item}}<span v-if="index !== movieInfo.durations.length-1" style="padding:0 4rpx;">/</span></span></p>
                <p>又名：<span v-for="(item, index) in movieInfo.aka" :key="item">{{item}}<span v-if="index !== movieInfo.aka.length-1" style="padding:0 4rpx;">/</span></span></p> 
            </div>
        </div>
        
        <div class="movie-summary">
            <h3>剧情简介</h3>
            <p>{{movieInfo.summary}}</p>
        </div>

        <div class="movie-casts">
            <h3>演员列表</h3>
            <swiper display-multiple-items=3 style="height: 410rpx;">
                <div v-for="item in movieInfo.casts" :key="item.id">
                    <swiper-item style="display: flex; justify-content: space-between;">
                        <div>
                            <image :src="item.avatars.large" class="slide-image" />
                            <p class="slide-name">{{item.name}}</p>
                        </div>
                    </swiper-item>
                </div>
            </swiper>
        </div>

        <div class="movie-trailers">
            <h3>预告片</h3>
            <div class="videos-container">
                <video class="video" v-for="item in videoInfo" :key="item.id" controls :poster="item.medium" :src="item.resource_url"></video>
            </div>
        </div>

        <div class="movie-comments">
            <h3>电影评论</h3>
            <ul>
                <li v-for="item in movieInfo.popular_comments" :key="item.id">
                    <header>
                        <span class="name">{{item.author.name}}</span>
                        <span class="score" :class="{'score-5': item.rating.value==5, 'score-45': item.rating.value==4.5, 'score-4': item.rating.value==4, 'score-35': item.rating.value==3.5, 'score-3': item.rating.value==3, 'score-25': item.rating.value==2.5, 'score-2': item.rating.value==2, 'score-15': item.rating.value==1.5, 'score-1': item.rating.value==1, 'score-05': item.rating.value==0.5, 'score-0': item.rating.value==0}"></span>
                        <span class="create-time">{{item.created_at}}</span>
                    </header>
                    <p class="content">{{item.content}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 当前城市
            city: '',
            // 电影id
            id: '',
            movieInfo: null
        }
    },
    computed: {
        videoInfo() {
            if(this.movieInfo !== null) {
                return this.movieInfo.trailers.map((item) => {
                    item.resource_url = item.resource_url.replace('http', 'https');
                    return item;
                });
            }
        }
    },
    methods: {
        // 获取电影详情（参数电影id和当前所在城市）
        getMovieDetail() {
            let url = `https://api.douban.com/v2/movie/subject/${this.id}?apikey=0b2bdeda43b5688921839c8ecb20399b&city=${this.city}`;
            // let url = `https://api.douban.com/v2/movie/subject/30122633?apikey=0b2bdeda43b5688921839c8ecb20399b&city=广州市`;
            url = encodeURI(url);
            
            this.$http
                .get(url)
                .then(res => {
                    this.movieInfo = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    onLoad () {
        this.id = this.$root.$mp.query.id;
        this.city = this.$root.$mp.query.city;
        // 获取电影详情
        this.getMovieDetail();
    },
    onUnload() {
        this.movieInfo = null;
    }
}
</script>
<style lang="scss" scoped>
@import './../../assets/scss/index.scss';
.top-container {
    display: flex;
    .movie-image {
        min-width: 343rpx;
        max-width: 343rpx;
        margin-right: 15rpx;
    }
    .movie-info {
        font-size: $middleFont;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
            font-size: $largeFont;
            color: #494949;
            font-weight: bold;
        }
        .score {
            color: red;
            font-weight: bold;
        }
    }
}
.movie-summary {
    margin-top: 20rpx;
    h3 {
        color: $mainColor;
        font-size: $largeFont;
        margin-bottom: 10rpx;
    }
    p {
        font-size: $middleFont;
        line-height: $largeFont;
    }
}
.movie-casts {
    margin-top: 20rpx;
    h3 {
        color: $mainColor;
        font-size: $largeFont;
        margin-bottom: 10rpx;
    }
    .slide-image {
        width: 230rpx;
        height: 322rpx;
    }
    .slide-name {
        text-align: center;
        color: #494949;
        font-size: $middleFont;
    }
}
.movie-trailers {
    h3 {
        color: $mainColor;
        font-size: $largeFont;
        margin-bottom: 10rpx;
    }
    .videos-container {
        .video {
            width: 100%;
        }
    }
}
.movie-comments {
    h3 {
        color: $mainColor;
        font-size: $largeFont;
        margin-bottom: 10rpx;
    }
    ul {
        font-size: $middleFont;
        li {
            padding: 20rpx 0;
            header {
                margin-bottom: 10rpx;
                .name {
                    color: $mainColor;
                    margin-right: 10rpx;
                }
                .score {
                    display: inline-block;
                    width: 120rpx;
                    height: 22rpx;
                    background-image: url('./../../assets/img/rating.png');
                    background-repeat: no-repeat;
                }
                .score-5 {
                    background-position: 0rpx 0rpx;
                }
                .score-45 {
                    background-position: 0rpx -22rpx;
                }
                .score-4 {
                    background-position: 0rpx -44rpx;
                }
                .score-35 {
                    background-position: 0rpx -66rpx;
                }
                .score-3 {
                    background-position: 0rpx -90rpx;
                }
                .score-25 {
                    background-position: 0rpx -110rpx;
                }
                .score-2 {
                    background-position: 0rpx -136rpx;
                }
                .score-15 {
                    background-position: 0rpx -154rpx;
                }
                .score-1 {
                    background-position: 0rpx -182rpx;
                }
                .score-05 {
                    background-position: 0rpx -198rpx;
                }
                .score-0 {
                    background-position: 0rpx -230rpx;
                }
                .create-time {
                    color: #aaa;
                }
            }
            .content {
                line-height: $middleFont*1.5;
            }
        }
    }
}
</style>
