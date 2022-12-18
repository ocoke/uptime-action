export default {
    list: [
        {
            host: "yfun.top",
            ssl: true,
            port: 443,
            name: "YFun's Home",
            method: "GET",
            ok: "200-299",
        },
        {
            host: "blog.yfun.top",
            ssl: true,
            port: 443,
            name: "YFun's Blog",
            method: "GET",
            ok: "200-299",
        },
    ],
    filedir: "./data/",
    filename: "{{@date}}.json",
    limit: 3,
    node: "Action",
};
