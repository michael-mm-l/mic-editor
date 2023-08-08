import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import Cherry from "cherry-markdown";

/**
 * 自定义一个语法
 */
var CustomHookA = Cherry.createSyntaxHook(
  "customHook",
  Cherry.constants.HOOKS_TYPE_LIST.PAR,
  {
    makeHtml(str) {
      return str;
    },

    afterMakeHtml(str) {
      // console.log("afterMakeHtml : " + str);
      return str;
    },
    rule() {
      return { reg: new RegExp() };
    },
  }
);

const callbacks = {
  /**
   * 全局的URL处理器
   * @param {string} url 来源url
   * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
   * @returns
   */
  urlProcessor: (url, srcType) => url,
  fileUpload(file, callback) {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    let writeFile = (fileReader.onload = async () => {
      var view = new Uint8Array(fileReader.result);
      var arr = [];
      for (let n of view) {
        arr.push(n);
      }
      let path = await invoke("writeFile", {
        context: arr,
        fileName: file.name,
      });
      return {
        path: path,
        name: file.name,
      };
    });

    writeFile().then((res) => {
      let apiPath = convertFileSrc(res.path);
      console.log("API Path", apiPath);
      if (/video/i.test(file.type)) {
        callback(apiPath, {
          name: `${file.name}`,
          poster: apiPath,
          isBorder: false,
          isShadow: false,
          isRadius: true,
        });
      } else {
        callback(apiPath, {
          name: `${file.name}`,
          poster: apiPath + "?poster=true",
          isBorder: false,
          isShadow: false,
          isRadius: true,
        });
      }
    });
  },
  afterChange: (text, html) => {},
  afterInit: (text, html) => {},
  beforeImageMounted: (srcProp, src) => ({ srcProp, src }),
  onClickPreview: (event) => {
    console.log(event);
  },
  onCopyCode: (event, code) => {
    // 阻止默认的粘贴事件
    // return false;
    // 对复制内容进行额外处理
    return code;
  },
};

var basicConfig = {
  id: "markdown",
  externals: {
    echarts: window.echarts,
    katex: window.katex,
    MathJax: window.MathJax,
  },
  isPreviewOnly: false,
  engine: {
    global: {
      urlProcessor(url, srcType) {
        return url;
      },
    },
    syntax: {
      autoLink: {
        /** 是否开启短链接 */
        enableShortLink: true,
        /** 短链接长度 */
        shortLinkLength: 20,
      },
      codeBlock: {
        theme: "dark", // 默认为深色主题
        wrap: false, // 超出长度是否换行，false则显示滚动条
        lineNumber: true, // 默认显示行号
        customRenderer: {
          // 自定义语法渲染器
        },
        /**
         * indentedCodeBlock是缩进代码块是否启用的开关
         *
         *    在6.X之前的版本中默认不支持该语法。
         *    因为cherry的开发团队认为该语法太丑了（容易误触）
         *    开发团队希望用```代码块语法来彻底取代该语法
         *    但在后续的沟通中，开发团队发现在某些场景下该语法有更好的显示效果
         *    因此开发团队在6.X版本中才引入了该语法
         *    已经引用6.x以下版本的业务如果想做到用户无感知升级，可以去掉该语法：
         *        indentedCodeBlock：false
         */
        indentedCodeBlock: true,
      },
      table: {
        enableChart: false,
      },
      fontEmphasis: {
        allowWhitespace: false, // 是否允许首尾空格
      },
      strikethrough: {
        needWhitespace: false, // 是否必须有前后空格
      },
      mathBlock: {
        engine: "MathJax", // katex或MathJax
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js", // 如果使用MathJax plugins，则需要使用该url通过script标签引入
      },
      inlineMath: {
        engine: "MathJax", // katex或MathJax
      },
      emoji: {
        useUnicode: false,
        customResourceURL:
          "https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8",
        upperCase: true,
      },
    },
    customSyntax: {
      CustomHook: {
        syntaxClass: CustomHookA,
        force: false,
        after: "br",
      },
    },
  },
  toolbars: {
    theme: "light", // light or dark
    showToolbar: false,
    float: [
      "bold",
      "italic",
      {
        strikethrough: [
          "strikethrough",
          "underline",
          "sub",
          "sup",
          "ruby",
          "customMenuAName",
        ],
      },
      "size",
      "|",
      "color",
      "header",
      "|",
      "ol",
      "ul",
      "checklist",
      "panel",
      "justify",
      "detail",
      "|",
      "formula",
      {
        insert: [
          "image",
          "audio",
          "video",
          "hr",
          "br",
          "code",
          "formula",
          "table",
          "pdf",
          "word",
        ],
      },
      "|",
      "drawIo",
      "|",
      "graph",
    ],
    bubble: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "sub",
      "sup",
      "quote",
      "ruby",
      "size",
      "color",
    ],
  },
  // 上传文件的回调
  fileUpload: callbacks.fileUpload,

  // 打开draw.io编辑页的url，如果为空则drawio按钮失效
  drawioIframeUrl: "drawio_demo/drawio_demo.html",
  /**
   * 上传文件的时候用来指定文件类型
   */
  fileTypeLimitMap: {
    video: "video/*",
    audio: "audio/*",
    image: "image/*",
    word: ".doc,.docx",
    pdf: ".pdf",
    file: "*",
  },
  callback: {
    afterChange: callbacks.afterChange,
    afterInit: callbacks.afterInit,
    beforeImageMounted: callbacks.beforeImageMounted,
    // 预览区域点击事件，previewer.enablePreviewerBubble = true 时生效
    onClickPreview: callbacks.onClickPreview,
    // 复制代码块代码时的回调
    onCopyCode: callbacks.onCopyCode,
  },
  previewer: {
    lazyLoadImg: {
      // 加载图片时如果需要展示loading图，则配置loading图的地址
      loadingImgPath: "",
      // 同一时间最多有几个图片请求，最大同时加载6张图片
      maxNumPerTime: 2,
      // 不进行懒加载处理的图片数量，如果为0，即所有图片都进行懒加载处理， 如果设置为-1，则所有图片都不进行懒加载处理
      noLoadImgNum: 3,
      // 首次自动加载几张图片（不论图片是否滚动到视野内），autoLoadImgNum = -1 表示会自动加载完所有图片
      autoLoadImgNum: 2,
      // 针对加载失败的图片 或 beforeLoadOneImgCallback 返回false 的图片，最多尝试加载几次，为了防止死循环，最多5次。以图片的src为纬度统计重试次数
      maxTryTimesPerSrc: 2,
      // 加载一张图片之前的回调函数，函数return false 会终止加载操作
      beforeLoadOneImgCallback: (img) => {
        return true;
      },
      // 加载一张图片失败之后的回调函数
      failLoadOneImgCallback: (img) => {},
      // 加载一张图片之后的回调函数，如果图片加载失败，则不会回调该函数
      afterLoadOneImgCallback: (img) => {},
      // 加载完所有图片后调用的回调函数
      afterLoadAllImgCallback: () => {},
    },
    dom: false,
    className: "cherry-markdown",
    // 是否启用预览区域编辑能力（目前支持编辑图片尺寸、编辑表格内容）
    enablePreviewerBubble: true,
  },
  keydown: [],
  editor: {
    id: "cherry-text",
    name: "cherry-text",
    autoSave2Textarea: true,
    defaultModel: "edit&preview",
  },
};
const CustomCherry = new Cherry(basicConfig);
export default CustomCherry;
