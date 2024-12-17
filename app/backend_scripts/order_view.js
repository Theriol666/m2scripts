// ==UserScript==
// @name         Magento 2 > BE > Order View
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current order
// @author       rbortolotto
// @match        *://*/*sales/order/view*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/order_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/order_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    const regex = /order_id\/(\d+)\//,
          orderId = window.location.pathname.match(regex)[1];

    function getOrderInformation() {
        if (typeof document.m2scripts !== undefined) {
            alert(JSON.stringify(document.M2Scripts.makeApiCall('/rest/all/V1/orders/' + orderId), null, 2));
        } else {
            alert("Require JS not loaded yet");
        }
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Get Order Information", getOrderInformation ,"getOrderInformation");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();