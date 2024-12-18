// ==UserScript==
// @name         Magento 2 > BE > STORES
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Manage data from stores
// @author       rbortolotto
// @match        *://*/*admin/system_store/index*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/store_list.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/store_list.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

// add M2Scripts from init_app.js
ensureScriptExists("https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js")

class StoreListM2Scripts extends M2Scriptss {
    idRegex = /_id\/(\d+)\//;

    showStoresValue() {
        const cells = document.querySelectorAll("table#storeGrid_table tbody td"),
              self = this;
        cells.forEach(function(cell, index) {
            let idField = document.createElement("input"),
                codeField = document.createElement("input"),
                code = cell.innerText.replace("(Code: ", "").replace(")","").split("\n")[1],
                matchId = cell.querySelector("a").href.match(self.idRegex),
                type = cell.dataset.column;

            codeField.name = type + "_" + code;
            codeField.value = code;
            idField.value = matchId[1];
            idField.name = type + "_" + idField.value;
            cell.appendChild(codeField);
            cell.appendChild(idField);
        });
    }

    addButtons() {
        window.M2Scripts.addButtonToMainContainer("Show values", this.showStoresValue ,"showStoresValue");
    }
}

initM2Script(StoreListM2Scripts);