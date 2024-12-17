// ==UserScript==
// @name         Magento 2 > FE > GLOBAL > CART
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get cart information
// @author       rbortolotto
// @grant        none
// @exclude      *://*/*admin*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/frontend_script/cart.js
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/frontend_script/cart.js
// @require      https://github.com/Theriol666/m2scripts/raw/main/app/frontend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    function getCartInfo() {
        if (typeof document.m2scripts !== undefined) {
            alert(JSON.stringify(require('Magento_Customer/js/customer-data').get('cart')(), null, 2));
        } else {
            alert("Require JS not loaded yet");
        }
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Get Cart Info", getCartInfo ,"getCartInfo");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();