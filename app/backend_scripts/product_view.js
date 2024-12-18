// ==UserScript==
// @name         Magento 2 > BE > PRODUCT > VIEW
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current product
// @author       rbortolotto
// @match        *://*/*catalog/product/edit*/*
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

// add M2Scripts from init_app.js
ensureScriptExists("https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js")

class ProductViewM2Scripts extends M2Scripts {

    getProductInformation() {
        let sku = jQuery('input[name="product[sku]"]').val();
        if (typeofsku) {
            alert(JSON.stringify(window.M2Scripts.makeApiCall('/rest/all/V1/products/' + sku), null, 2));
        } else {
            alert("Sku field not found");
        }
    }

    addButtons() {
        window.M2Scripts.addButtonToMainContainer("Get Product Information", this.getProductInformation ,"getProductInformation");
    }
}

initM2Script(ProductViewM2Scripts);