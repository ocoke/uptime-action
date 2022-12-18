import sslChecker from "ssl-checker";
import cfg from './_config.js';
import fetch, { AbortError } from 'node-fetch';
import fs from 'fs';
import https from 'https';

const run = async() => {
  const AbortController = globalThis.AbortController || await import('abort-controller');
  let data = {};
  data.result = {};
  for (let i of cfg.list) {
    let host = i.host;
    let ssl = i.ssl;
    let port = i.port;
    let key = host+":"+port;
    data.result[key] = {};
    if (ssl) {
      let st = await sslChecker(host, { method: "GET", port });
      if (st.valid) {
        data.result[key].ssl = true;
        data.result[key].sslDetails = st;
      }
      else data.result[key].ssl = false;
    } else { data.result[key].ssl = false; data.result[key].sslCheck = false; }

    let proc;
    if (ssl) proc = "https://";
    else proc = "http://";
    let url = proc+host+":"+port;
    console.log("Start fetching "+url);
    let controller = new AbortController();
    let timeout = setTimeout(() => {
      controller.abort();
    }, i.timeout || 10000);
    let res;
    try {
      res = await fetch(url, 
        { method: i.method, agent: new https.Agent({ rejectUnauthorized: false }), signal: controller.signal })
        .then(res => res.status);
    } catch (e) {
      res = "ERROR";
      console.warn(e);
    } finally {
      clearTimeout(timeout);
    }


    if (res != "ERROR") {
      let ok_code = i.ok.split("-");
      if (ok_code.length == 1) {
        if (res != Number(ok_code[0])) {
          data.result[key].ok = false;
        } else data.result[key].ok = true;
      } else {
        let ok_from = Number(ok_code[0]);
        let ok_to = Number(ok_code[1]);
        if (res >= ok_from && res <= ok_to) {
          data.result[key].ok = true;
        } else data.result[key].ok = false;
      }
    } else {
      data.result[key].ok = false;
    }

    data.result[key].time = Date.now();
    data.result[key].name = i.name;
  }
  data.status = true;
  data.time = Date.now();
  data.node = cfg.node;
  return data;
}
(async() => {
  let data;
  try {
    data = await run();
  } catch (e) {
    data = {
      status: false,
      time: Date.now(),
      node: cfg.node,
    };
  }
  let t = new Date();
  let time =  t.getUTCFullYear()+"-"+t.getUTCMonth()+"-"+t.getUTCDate()+"_"+t.getUTCHours()+":"+t.getUTCMinutes();
  let filename = cfg.filedir + cfg.filename.replace("{{@date}}", time);
  console.log("Writing "+filename)
  fs.writeFileSync(filename, JSON.stringify(data));
  if (data && data.status) {
    for (let i in data.result) {
      if (!data.result[i].ssl && data.result[i].sslCheck) {
        // SSL 错误
      }
      if (!data.result[i].ok) {
        // 访问错误
      }
    }
  }
  let index = JSON.parse(fs.readFileSync(cfg.filedir+"index.json").toString());
  index.push(filename.split("/")[filename.split("/").length-1]);
  if (index.length > cfg.limit) {
    fs.rmSync(cfg.filedir+index[0]);
    let arr = []
    for (let i in index) {
      if (i != 0) arr[i-1] = index[i];
      
    }
    index = arr;
  }
  fs.writeFileSync(cfg.filedir+"index.json", JSON.stringify(index));
})();