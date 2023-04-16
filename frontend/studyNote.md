# 前端项目：React+React-router-dom+Tailwind CSS

## 在线地址(需魔法)：https://shareme-theei.netlify.app/





## 初始化项目

- Tailwind CSS in react
- 初始化 `App.js` 和 `indexjs`



## 开发流程

项目主要分为两个大的组件（`Home` 主页 + `Login` 登录）

1. 开发`Login` 组件
   - 使用`react-icons`库中的图标
   - 使用`@react-oauth/google`实现谷歌登录
     - 需要谷歌的凭证，去谷歌开发者[平台](https://console.cloud.google.com/)新建项目（创建凭证及OAuth）
     - **创建 OAuth 客户端ID页面中，授权URL（本地前端地址）**
2. 连通 `sanity`后端
   1. 创建 `client.js`。具体实现见`sanity`[官网](https://www.sanity.io/docs/js-client)
   2. **启动后端后，在 manage 管理页面的 API 中添加跨域规则**

3. 为管理环境变量，创建`.env`文件。
4. 开发`Home`组件
   1. 开发侧边栏`SideBar`组件
5. 开发`Pins`组件
   1. 开发顶部导航栏`NavBar`组件
   2. 开发`Feed`组件和Loading组件`Spinner`
   3. 开发 `MasonryLayout`组件（展示图片的布局）
   4. 开发 `Pin`组件，展示单个用户上传的图片
   5. 开发`CreatePin`组件
   6. 开发`PinDetail`组件，展示上传图片的详情
   7. 开发`UserProfile`组件，展示用户详情
   8. 开发`Search`搜索组件

## 部署流程

1. 使用 `netlify`部署前端项目。防止404，创建`_redicrcts`文件

   ```
   /* /index.html 200
   ```

2. 同开发流程，将部署后的url`https://shareme-theei.netlify.app`添加到`sanity`后端中的跨域中

3. 同理，将`https://shareme-theei.netlify.app`添加到OAuth 客户端的授权URL中

4. 部署后端较为容易

   - 使用 `sanity deploy`命令即可