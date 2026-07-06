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

  async function snapshot(label) {
    const res = await call("Runtime.evaluate", {
      expression: `JSON.stringify({
        url: location.pathname,
        gridHTML: document.querySelector('[class*="grid"]')?.className,
        bodyContainsWorksGridMarker: document.body.innerHTML.includes('col-span-2'),
        totalImgs: document.querySelectorAll('img').length
      })`,
      returnByValue: true,
    });
    console.log(label, res.result?.result?.value);
  }

  await snapshot("BEFORE (/index/works)");

  await call("Runtime.evaluate", {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const menuBtn = btns.find(b => b.textContent.replace(/\\s/g,'').toLowerCase() === 'menu');
      menuBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 500));

  await call("Runtime.evaluate", {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll("a"));
      const indexLink = links.find(a => a.getAttribute('href') === '/index');
      indexLink.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  await snapshot("AFTER click 'index' (expect /index)");

  ws.close();
}
main();
