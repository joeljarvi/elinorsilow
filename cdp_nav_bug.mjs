import WebSocket from "ws";
async function newTab(url) {
  const res = await fetch(`http://localhost:9333/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  return res.json();
}
async function main() {
  const tab = await newTab("http://localhost:3000/index/works");
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  function call(method, params) {
    return new Promise((resolve) => { const myId = id++; pending.set(myId, resolve); ws.send(JSON.stringify({ id: myId, method, params })); });
  }
  await new Promise((resolve) => ws.on("open", resolve));
  await call("Runtime.enable");
  await call("Page.enable");
  await new Promise((r) => setTimeout(r, 4000));

  const before = await call("Runtime.evaluate", {
    expression: `JSON.stringify({ url: location.pathname, gridButtons: document.querySelectorAll('button.aspect-square, button[class*="aspect-square"]').length })`,
    returnByValue: true,
  });
  console.log("BEFORE:", before.result?.result?.value);

  // open nav and click "index"
  await call("Runtime.evaluate", {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const menuBtn = btns.find(b => b.textContent.replace(/\\s/g,'').toLowerCase() === 'menu');
      menuBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 500));

  const clickResult = await call("Runtime.evaluate", {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll("a"));
      const indexLink = links.find(a => a.getAttribute('href') === '/index' && a.textContent.toLowerCase().includes('index'));
      if (!indexLink) return "no index link found, hrefs: " + links.map(a=>a.getAttribute('href')).join(',');
      indexLink.click();
      return "clicked index link";
    })()`,
    returnByValue: true,
  });
  console.log("CLICK:", JSON.stringify(clickResult.result));

  await new Promise((r) => setTimeout(r, 1500));

  const after = await call("Runtime.evaluate", {
    expression: `JSON.stringify({ url: location.pathname, gridButtons: document.querySelectorAll('button.aspect-square, button[class*="aspect-square"]').length })`,
    returnByValue: true,
  });
  console.log("AFTER:", after.result?.result?.value);

  ws.close();
}
main();
