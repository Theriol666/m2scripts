// ==UserScript==
// @name         Magento 2 > FE > GLOBAL > PRODUCT
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get Products Information
// @author       rbortolotto
// @grant        none
// @exclude      *://*/*admin*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/frontend_script/product.js
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/frontend_script/product.js
// @require      https://github.com/Theriol666/m2scripts/raw/main/app/frontend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    function getProductUrl(event) {
        const urlStoreView = document.M2Scripts.getCurrentStoreViewUrlCode(),
              apiStoreCode = document.M2Scripts.getApiStoreCode(),
              sku = event.target.className !== 'm2scripts-getProductUrlName',
              condition = sku ? "eq" : "like",
              value = prompt("Find product by " + (sku ? "sku" : "name") + " :"),
              field = sku ? "sku" : "name";

        if (!value) {
            return;
        }

        let endpoint = "/rest/{%storecode%}/V1/products/?searchCriteria[pageSize]=1&searchCriteria[currentPage]=1&searchCriteria[filter_groups][0][filters][0][field]={%field%}&searchCriteria[filter_groups][0][filters][0][condition_type]={%condition%}&searchCriteria[filter_groups][0][filters][0][value]={%value%}&searchCriteria[sortOrders][0][field]=entity_id&searchCriteria[sortOrders][0][direction]=DESC&fields=items[sku,custom_attributes[url_key]]";

        endpoint = endpoint
            .replace("{%storecode%}", apiStoreCode)
            .replace("{%field%}", field)
            .replace("{%value%}", value)
            .replace("{%condition%}", condition);

        const productData = document.M2Scripts.makeApiCall(endpoint);
        let productUrl = null;
        if (productData !== null && productData.items !== null) {
            for (let attr in productData.items[0].custom_attributes) {
                if (productData.items[0].custom_attributes[attr].attribute_code === "url_key") {
                    productUrl = document.M2Scripts.getCurrentBaseUrl() + (urlStoreView !== "" ? "/" + urlStoreView : "") + "/" + productData.items[0].custom_attributes[attr].value + document.M2Scripts.productPageSuffix;
                    alert (productUrl);
                }
            }
        }

        return productUrl;
    }

    function gotoProductPage(event) {
        let productUrl = getProductUrl(event);
        if (productUrl) {
            window.location = productUrl;
        }
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Get Product Url by SKU", getProductUrl ,"getProductUrl");
        document.M2Scripts.addButtonToMainContainer("Get Product Url by Name", getProductUrl ,"getProductUrlName");
        document.M2Scripts.addButtonToMainContainer("Go To Product Page", gotoProductPage ,"gotoProductPage");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();