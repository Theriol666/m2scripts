// ==UserScript==
// @name         Magento 2 > BE > PRODUCT > VIEW
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current product
// @author       rbortolotto
// @match        *://*/*catalog/product/index*/*
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==


(function() {
    'use strict';

    function getProductInformation() {
        let sku = jQuery('input[name="product[sku]"]').val();
        if (typeof document.m2scripts !== undefined && sku) {
            alert(JSON.stringify(document.M2Scripts.makeApiCall('/rest/all/V1/products/' + sku), null, 2));
        } else {
            alert("Require JS not loaded yet");
        }
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Get Product Information", getProductInformation ,"getProductInformation");
    }

    function start(){
        M2Scripts.isReady(function () {
            addButtons();
        });
    }

    start();
})();