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
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_script/product.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_script/product.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class ProductM2Scripts extends M2Scripts {
    getProductUrl(event) {
        const urlStoreView = this.getCurrentStoreViewUrlCode(),
              apiStoreCode = this.getApiStoreCode(),
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

        const productData = this.makeApiCall(endpoint);
        let productUrl = null;
        if (productData !== null && productData.items !== null) {
            for (let attr in productData.items[0].custom_attributes) {
                if (productData.items[0].custom_attributes[attr].attribute_code === "url_key") {
                    productUrl = this.getCurrentBaseUrl() + (urlStoreView !== "" ? "/" + urlStoreView : "") + "/" + productData.items[0].custom_attributes[attr].value + this.productPageSuffix;
                    alert (productUrl);
                }
            }
        }

        return productUrl;
    }

    gotoProductPage(event) {
        let productUrl = this.getProductUrl(event);
        if (productUrl) {
            window.location = productUrl;
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Get Product Url by SKU", this.getProductUrl ,"getProductUrl");
        this.addButtonToMainContainer("Get Product Url by Name", this.getProductUrl ,"getProductUrlName");
        this.addButtonToMainContainer("Go To Product Page", this.gotoProductPage ,"gotoProductPage");
    }
}

initM2Script(ProductM2Scripts);