/* global browser */

let globalbookmarkId;
let globaltype;

async function exportData(node, parentId) {
  const historyItems = (
    await browser.history.search({
      text: "",
      startTime: 0,
      maxResults: 1000000,
    })
  ).map((item) => {
    return { url: item.url, title: item.title, visitTime: item.lastVisitTime };
  });

  console.log("Exporting " + historyItems.length + " historyItems");

  let txt = JSON.stringify(historyItems, null, 4);

  let a = document.createElement("a");
  let blob = new Blob([txt], {
    type: "text/json",
  });
  a.href = window.URL.createObjectURL(blob);
  a.download = "history.json";
  a.click();
}

async function importData(historyItems) {
  let chunk = 100;
  let index = 0;
  let n = historyItems.length;

  historyItems.forEach((item) => {
    browser.history.addUrl(item);
  });
}

async function onLoad() {
  let expbtn = document.getElementById("expbtn");
  expbtn.addEventListener("click", exportData);
  let impbtn = document.getElementById("impbtn");
  impbtn.addEventListener("input", function (/*evt*/) {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = async function (/*e*/) {
      try {
        let data;
        data = JSON.parse(reader.result);
        await importData(data);
        document.getElementById("message").innerText =
          "INFO: Import finished without errors, check the results then you can close this tab";
      } catch (e) {
        console.error(e);
        document.getElementById("message").innerText =
          "ERROR: Import failed, " + e.toString();
      }
    };
    reader.readAsText(file);
  });
}

document.addEventListener("DOMContentLoaded", onLoad);
