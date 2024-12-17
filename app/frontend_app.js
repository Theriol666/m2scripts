// ==UserScript==
// @name         M2Scripts > FE APP
// @namespace    M2Scripts
// @version      0.0.1
// @description  Load main APP for frontend part.
// @author       rbortolotto
// @exclude      *://*/*admin*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_app.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/main_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    // add new method to M2Scripts object
    window.M2Scripts.init = function() {
        this.apiSiteBaseUrl = localStorage.getItem("m2script_api_base_url") ?? localStorage.setItem("m2script_api_base_url", prompt("Set Api Base Url"));
        this.productPageSuffix = localStorage.getItem("m2script_product_page_suffix") ?? localStorage.setItem("m2script_product_page_suffix", prompt("Set Product Page Suffix"));
        this.getStoreViews();
    };

    window.M2Scripts.getCurrentStoreViewUrlCode = function() {
        return window.location.pathname.split('/').length ? window.location.pathname.split('/')[1] : "";
   };

   window.M2Scripts.getCurrentBaseUrl = function() {
        return window.location.origin;
    },

    window.M2Scripts.getApiStoreCode = function(urlStoreCode = null) {
        const storeView = this.getStoreViewByCurrentUrl();
        if (!storeView) {
            return 'all';
        } else {
            return storeView.code;
        }
    };

    window.M2Scripts.getApiBaseUrl = function() {
        return this.apiSiteBaseUrl === "" ? window.location.origin : this.apiSiteBaseUrl;
    };

    window.M2Scripts.getStoreViews = function() {
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

    window.M2Scripts.getStoreViewByCurrentUrl = function() {
        const currentStoreCodeUrl = this.getCurrentStoreViewUrlCode(),
              currentUrl = this.getCurrentBaseUrl() + (currentStoreCodeUrl == "" ? "" : "/" + currentStoreCodeUrl) + "/";

        let storeViews = this.getStoreViews();
        if (!storeViews) {
          return null;
        }

        const currentStoreView = Object.values(storeViews).find(store => store.base_url === currentUrl);
        return currentStoreView;
    };

    window.M2Scripts.setStoreViews = function(storeViews) {
        localStorage.setItem("m2script_store_views", JSON.stringify(storeViews));
    };

    // main function
    window.M2Scripts.isReady(function () {
        window.M2Scripts.init();
        window.M2Scripts.addStyle();
        window.M2Scripts.addMainContainer();
    });
})();