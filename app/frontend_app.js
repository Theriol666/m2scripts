// ==UserScript==
// @name         M2Scripts > FE APP
// @namespace    M2Scripts
// @version      0.0.1
// @description  Load main APP for frontend part.
// @author       rbortolotto
// @exclude      *://*/*admin*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/frontend_app.js
// @downloadURL      https://github.com/Theriol666/m2scripts/raw/main/app/frontend_app.js
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://github.com/Theriol666/m2scripts/raw/main/app/main_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

window.jq = $.noConflict(true);

(function () {
    'use strict';

    // add new method to M2Scripts object
    M2Scripts.init = function() {
        this.apiSiteBaseUrl = localStorage.getItem("m2script_api_base_url") ?? localStorage.setItem("m2script_api_base_url", prompt("Set Api Base Url"));
        this.productPageSuffix = localStorage.getItem("m2script_product_page_suffix") ?? localStorage.setItem("m2script_product_page_suffix", prompt("Set Product Page Suffix"));
        this.getStoreViews();
    };

    M2Scripts.getCurrentStoreViewUrlCode = function() {
        return window.location.pathname.split('/').length ? window.location.pathname.split('/')[1] : "";
   };

   M2Scripts.getCurrentBaseUrl = function() {
        return window.location.origin;
    },

    M2Scripts.getApiStoreCode = function(urlStoreCode = null) {
        const storeView = this.getStoreViewByCurrentUrl();
        if (!storeView) {
            return 'all';
        } else {
            return storeView.code;
        }
    };

    M2Scripts.getApiBaseUrl = function() {
        return this.apiSiteBaseUrl === "" ? window.location.origin : this.apiSiteBaseUrl;
    };

    M2Scripts.getStoreViews = function() {
        var storeViews = localStorage.getItem("m2script_store_views");
        if (!storeViews) {
            var formatedStoreViews = {},
                configStoreViews = {};

            configStoreViews = this.makeApiCall('/rest/all/V1/store/storeConfigs');
            storeViews = this.makeApiCall('/rest/V1/store/storeViews');
            if(configStoreViews && configStoreViews.length && storeViews && storeViews.length) {
                storeViews.forEach(function(store) {
                    formatedStoreViews[store.code] = store;
                    const storeConfig = configStoreViews.find(config => config.id === store.id);
                    if (storeConfig) {
                        formatedStoreViews[store.code].base_url = storeConfig.secure_base_link_url;
                        formatedStoreViews[store.code].config = storeConfig;
                    }
                });

                this.setStoreViews(formatedStoreViews);
                return formatedStoreViews;
            } else {
                console.log("No store views found");

                return {};
            }
        } else {
            return JSON.parse(storeViews);
        }
    };

    M2Scripts.getStoreViewByCurrentUrl = function() {
        const currentStoreCodeUrl = this.getCurrentStoreViewUrlCode(),
              currentUrl = this.getCurrentBaseUrl() + (currentStoreCodeUrl == "" ? "" : "/" + currentStoreCodeUrl) + "/";

        let storeViews = this.getStoreViews();
        if (!storeViews) {
          return null;
        }

        const currentStoreView = Object.values(storeViews).find(store => store.base_url === currentUrl);
        return currentStoreView;
    };

    M2Scripts.setStoreViews = function(storeViews) {
        localStorage.setItem("m2script_store_views", JSON.stringify(storeViews));
    };

    // main function
    M2Scripts.isReady(function () {
        M2Scripts.init();
        M2Scripts.addStyle();
        M2Scripts.addMainContainer();
    });
})();