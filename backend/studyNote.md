# 后端：sanity

## 在线地址(需魔法)：https://shareme-theei.sanity.studio/desk



## 流程

1. 全局安装 `sanity`

2. 使用 V3 sanity 命令：`sanity init --project-plan boosted-free-2021-12-08`

   1. 使用的是 YouTube 上的 `JavaScript Mastery`博主[教程](https://www.youtube.com/watch?v=XxXyfkrP298&list=WL)
   2. 目前 `sanity`已经更新至v4、创建项目更加简单

3. `sanity`使用`document`管理数据。只需要建立数据关系。项目中重要文件`/schemas/index.js`

   1. 我们需要建立不同类型的`document`，语法如下：

      ```javascript
      // user.js
      
      export default {
        name: 'user',
        title: 'User',
        type: 'document',
        fields: [
          {
            name: 'userName',
            title: 'UserName',
            type: 'string'
          },
          {
            name: 'image',
            title: 'Image',
            type: 'string'
          }
        ]
      }
      ```

   2. 在`index.js`中导入即可

      ```javascript
      import user from './user'
      
      export const schemaTypes = [
        user,
      ]
      ```

   3. 更多语法见[sanity官网](https://www.sanity.io/docs/schema-types)

