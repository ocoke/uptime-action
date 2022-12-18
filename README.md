# Uptime Action

> 使用 GitHub Action 检测网站 SSL 证书与可访问性。

## 如何使用

1. Fork [`oCoke/uptime-action`](https://github.com/oCoke/uptime-action/fork) 仓库。
2. 根据需要修改 [`.github/workflows/main.yml#L8`](https://github.com/oCoke/uptime-action/blob/master/.github/workflows/main.yml#L8) 的内容。
3. 完成，CI 将会自动运行。

## 配置文件

**配置文件在  `./_config.js` 下：**

```js
export default {
    // 检测列表
    list: [
        {
            // 检测地址，域名或 IP
            host: "yfun.top",
            // 是否检测 SSL
            ssl: true,
            // 请求端口（也是 SSL 端口）
            port: 443,
            // 备注名
            name: "YFun's Home",
            // 请求方式
            method: "GET",
            // 正确响应码 也可以为单个，例如 200
            ok: "200-299",
        },
        // ...
    ],
    // 数据目录
    filedir: "./data/",
    // 数据文件名，{{@date}} 填充 UTC 日期
    filename: "{{@date}}.json",
    // 最多数据，以 40(days) * 6(times) 为计算 = 240
    limit: 240,
    // 节点名
    node: "GitHub Action",
};

```
