// ==UserScript==
// @name         Magento 2 > BE > STORES
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Manage data from stores
// @author       rbortolotto
// @match        *://*/*admin/system_store/index*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/backend_script/store_list.js
// @downloadURL  https://github.com/Theriol666/m2scripts/raw/main/app/backend_script/store_list.js
// @require      https://github.com/Theriol666/m2scripts/raw/main/app/backend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    const idRegex = /_id\/(\d+)\//;

    function showStoresValue() {
        const cells = document.querySelectorAll("table#storeGrid_table tbody td");
        cells.forEach(function(cell, index) {
            let idField = document.createElement("input"),
                codeField = document.createElement("input"),
                code = cell.innerText.replace("(Code: ", "").replace(")","").split("\n")[1],
                matchId = cell.querySelector("a").href.match(idRegex),
                type = cell.dataset.column;

            codeField.name = type + "_" + code;
            codeField.value = code;
            idField.value = matchId[1];
            idField.name = type + "_" + idField.value;
            cell.appendChild(codeField);
            cell.appendChild(idField);
        });
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Show values", showStoresValue ,"showStoresValue");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();