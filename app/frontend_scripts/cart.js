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
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_scripts/cart.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_scripts/cart.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class CartM2Scripts extends M2Scripts {
    getCartInfo() {
        this.showJsonOnModal(require('Magento_Customer/js/customer-data').get('cart')());
    }

    getQuoteInfo() {
        var quote = require("Magento_Checkout/js/model/quote"),
            method = prompt("Specify the method to use for Magento_Checkout/js/model/quote (empty to show list)");

        if (method) {
            this.showJsonOnModal(eval("quote." + method));
        } else {
            this.showJsonOnModal(Object.getOwnPropertyNames(quote));
        }
    }

    findPostalCode() {
        var countryId = document.querySelector("select[name='country_id']");
        if (!countryId) {
            countryId = prompt("Set Country Id (Country ISO Code)");
        } else {
            countryId = countryId.value ?? null;
        }

        if (countryId) {
            window.open('https://www.geonames.org/postalcode-search.html?q=&country=' + countryId);
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Get Cart Info", this.getCartInfo ,"getCartInfo");
        this.addButtonToMainContainer("Get Quote Info", this.getQuoteInfo ,"getQuoteInfo");
        this.addButtonToMainContainer("Find PostalCode", this.findPostalCode ,"findPostalCode");
    }
}

initM2Script(CartM2Scripts);