// ==UserScript==
// @name         Magento 2 > BE > PRODUCT > VIEW
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current product
// @author       rbortolotto
// @match        *://*/*catalog/product/edit*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class ProductViewM2Scripts extends M2Scripts {

    getProductInformation() {
        let sku = jQuery('input[name="product[sku]"]').val();
        if (typeof sku !== 'undefined') {
			this.showJsonOnModal(this.makeApiCall('/rest/all/V1/products/' + sku));
        } else {
            alert("Sku field not found");
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Get Product Information", this.getProductInformation ,"getProductInformation");
    }
}

initM2Script(ProductViewM2Scripts);