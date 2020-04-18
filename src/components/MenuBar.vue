<template>
  <div class="menuBar">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        :class="{'hide-box-shadow' : ClickShow || ! ifTitleAndMenuShow}"
        v-show="ifTitleAndMenuShow"
      >
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="ClickShow(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress icon" @click="ClickShow(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright icon" @click="ClickShow(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a icon" @click="ClickShow(0)">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="hidden">
        <div class="setting-font-size" v-if="showTag === 0">
          <div class="preview" :style="{fontSize:fontSizeList[0].fontSize + 'px'}">A</div>
          <div class="select">
            <div
              class="select-wrapper"
              v-for="(item,index) in fontSizeList"
              :key="index"
              @click="setFontSize(item.fontSize)"
            >
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize === item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div
            class="preview"
            :style="{fontSize:fontSizeList[fontSizeList.length - 1].fontSize + 'px'}"
          >A</div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div class="setting-theme-item" v-for="(item, index) in themesList" :key="index">
            <div
              class="preview"
              :style="{background: item.style.body.background}"
              :class="{'no-border':item.style.body.background !=='#fff'}"
              @click="Clickpreview(index)"
            ></div>
            <div class="text" :class="{'selected': index === defaultTheme}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <div class="progress-wrapper">
            <input
              class="progress"
              type="range"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress"
            />
          </div>
          <div class="text-wrapper">
            <span>{{ bookAvailable ? progress + '%' : '加载中...' }}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view :ifShowContent = "ifShowContent"
                    v-show="ifShowContent"
                    :navigation = "navigation"
                    :bookAvailable = "bookAvailable"
                    @jumpTo = "jumpTo"></content-view>
    <transition name="fade">
      <div class="content-mask" v-show="ifShowContent" @click="hideContent"></div>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ContentView from './Content'
export default {
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line key-spacing
  name: 'MenuBar',
  components: {
    ContentView
  },
  data () {
    return {
      hidden: false,
      showTag: 0,
      progress: 0,
      ifShowContent: false
    }
  },
  props: {
    ifTitleAndMenuShow: {
      type: Boolean,
      default: false
    },
    fontSizeList: Array,
    defaultFontSize: Number,
    themesList: Array,
    defaultTheme: Number,
    setTheme: Number,
    bookAvailable: {
      type: Boolean,
      default: false
    },
    navigation: Object,
    parentProgress: Number
  },
  watch: {
    parentProgress: {
      handler: function (val) {
        this.progress = val
        if (this.bookAvailable && this.$refs.parentProgress) {
          this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        }
      },
      deep: true
    }
  },
  methods: {
    // 隐藏目录
    hideContent () {
      this.ifShowContent = false
    },
    // 跳动方法，调节父组件方法
    jumpTo (target) {
      this.$emit('jumpTo', target)
    },
    // 拖动进度条时触发事件
    onProgressInput (progress) {
      this.progress = progress
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    // 移动小球触发定位
    onProgressChange (progress) {
      this.$emit('onProgressChange', progress)
    },
    Clickpreview (index) {
      this.$emit('setTheme', index)
    },
    ClickShow (tag) {
      this.showTag = tag
      if (this.showTag === 3) {
        this.ifShowContent = true
        this.hidden = false
      } else {
        this.hidden = true
      }
    },
    Clickhidden () {
      this.hidden = false
    },
    setFontSize (fontSize) {
      this.$emit('setFontSize', fontSize)
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../assets/styles/global";
.menuBar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(22);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
    &.hide-box-shadow {
      box-shadow: none;
    }
  }
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    width: 100%;
    height: px2rem(60);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-font-size {
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        flex: 1;
        display: flex;
        .select-wrapper {
          flex: 1;
          display: flex;
          z-index: 101;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,.8);
  }
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      z-index: 101;
      padding: px2rem(5);
      box-sizing: border-box;
      flex-direction: column;
      .preview {
        flex: 1;
        border: px2rem(1) solid #ccc;
        &.no-border {
          border: none;
        }
      }
      .text {
        flex: 0 0 px2rem(30);
        font-size: px2rem(16);
        color: #ccc;
        @include center;
        &.selected {
          color: #333;
        }
      }
    }
  }
  .setting-progress {
    height: 100%;
    width: 100%;
    z-index: 101;
    position: relative;
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(30);
      box-sizing: border-box;
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        background-size: 0 100%;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      text-align: center;
    }
  }
}
</style>
