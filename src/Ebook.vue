<template>
  <div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar
      :ifTitleAndMenuShow="ifTitleAndMenuShow"
      :fontSizeList="fontSizeList"
      :defaultFontSize="defaultFontSize"
      @setFontSize="setFontSize"
      :themesList="themesList"
      :defaultTheme="defaultTheme"
      @setTheme="setTheme"
      @onProgressChange="onProgressChange"
      :bookAvailable="bookAvailable"
      @jumpTo = "jumpTo"
      :navigation = navigation
      :parentProgress = "progress"
      ref="MenuBar"
    ></menu-bar>
  </div>
</template>

<script>
/* eslint-disable */
import Epub from "epubjs";
import TitleBar from "./components/TitleBar";
import MenuBar from "./components/MenuBar";
const DOMNLOAD_URL = "/static/2018_Book_AgileProcessesInSoftwareEngine.epub";
global.epub = Epub;
export default {
  components: {
    TitleBar,
    MenuBar
  },
  data() {
    return {
      ifTitleAndMenuShow: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      defaultFontSize: 16,
      themesList: [
        {
          name: "default",
          style: {
            body: {
              color: "#000",
              background: "#fff"
            }
          }
        },
        {
          name: "eye",
          style: {
            body: {
              color: "#000",
              background: "#cee"
            }
          }
        },
        {
          name: "night",
          style: {
            body: {
              color: "#fff",
              background: "#000"
            }
          }
        },
        {
          name: "gold",
          style: {
            body: {
              color: "#000",
              background: "rgba(241,236,226)"
            }
          }
        }
      ],
      defaultTheme: 0,
      bookAvailable: false,
      navigation: {},
      progress: 0
    };
  },
  methods: {
    jumpTo(href) {
      //实现目录的跳转
      this.rendition.display(href).then(() => {
        this.showProgress()
      })
      this.hideTitleAndmenu();
    },
    hideTitleAndmenu() {
      //对标题和设置栏进行隐藏
      this.ifTitleAndMenuShow = false;
      //对菜单栏弹出的设置进行隐藏
      this.$refs.MenuBar.Clickhidden()
      //隐藏目录
      this.$refs.MenuBar.hideContent()
    },
    onProgressChange(progress) {
      const percentage = progress / 100;
      const location =
        percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0;
      this.rendition.display(location);
    },
    setTheme(index) {
      this.themes.select(this.themesList[index].name);
      this.defaultTheme = index;
    },
    registerTheme() {
      this.themesList.forEach(theme => {
        this.themes.register(theme.name, theme.style);
      });
    },
    setFontSize(fontSize) {
      if (this.themes) {
        this.defaultFontSize = fontSize;
        this.themes.fontSize(fontSize + "px");
      }
    },
    toggleTitleAndMenu() {
      this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow;
      if (!this.ifTitleAndMenuShow) {
        this.$refs.MenuBar.Clickhidden();
      }
    },
    // 向前一页
    prevPage() {
      //Rendition.prev
      if (this.rendition) {
        this.rendition.prev().then(() => {
          // 获取当前位置
          const currentLocation = this.rendition.currentLocation()
          // 获取当前位置的百分比
          this.progress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi) : 0
          // 转化为0-100的数字
          this.progress = Math.round(this.progress * 100)
        })
      }
    },
    // 向后一页
    nextPage() {
      //Rendition.next
      if (this.rendition) {
        this.rendition.next().then(() =>{
           // 获取当前位置
          const currentLocation = this.rendition.currentLocation();
          console.log(currentLocation)
          // 获取当前位置的百分比
          this.progress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi) : 0;
          // 转化为0-100的数字
          this.progress = Math.round(this.progress * 100)
        })
      }
    },
    // 进度条和章节跳转
    showProgress() {
       const currentLocation = this.rendition.currentLocation()
        // 获取当前位置的百分比
        this.progress = this.bookAvailable ? this.locations.percentageFromCfi(currentLocation.start.cfi) : 0;
        // 转化为0-100的数字
        this.progress = Math.round(this.progress * 100)
    },
    //电子书的解析和渲染
    showEpub() {
      //生成book
      this.book = new Epub(DOMNLOAD_URL);
      //生成Rendition,通过book.renderTo
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });
      //通过Rendtion.display渲染电子书
      this.rendition.display();
      //获取Themem
      this.themes = this.rendition.themes;
      this.setFontSize(this.defaultFontSize);
      //this.themes.register(name,style) 字体的注册
      //this.themes.select(name)  字体的使用
      this.registerTheme();
      this.setTheme(this.defaultTheme);
      //获取locations对象
      //通过epubjs的钩子函数
      this.book.ready
        .then(() => {
          return this.book.locations.generate();
        })
        .then(result => {
          this.locations = this.book.locations;
          this.bookAvailable = true;
          //用navigation实现目录所在位置
          this.navigation = this.book.navigation;
        });
    }
  },
  mounted() {
    this.showEpub();
  }
};
</script>

<style lang='scss' scoped>
@import "assets/styles/global";
.ebook {
  position: relative;

  .read-wrapper {
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      display: flex;
      width: 100%;
      height: 100%;
      .left {
        flex: 0 0 px2rem(100);
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 px2rem(100);
      }
    }
  }
}
</style>
