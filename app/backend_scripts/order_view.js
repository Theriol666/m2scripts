// ==UserScript==
// @name         Magento 2 > BE > Order View
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current order
// @author       rbortolotto
// @match        *://*/*sales/order/view*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_scripts/order_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_scripts/order_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class OrderViewM2Scripts extends M2Scripts {

    constructor(initCallback = null) {
        super(initCallback);

        this.regex = /order_id\/(\d+)\//;
        this.orderId = window.location.pathname.match(this.regex)[1];    
    }

    getOrderInformation() {
        this.showJsonOnModal(this.makeApiCall('/rest/all/V1/orders/' + this.orderId));
    }

    addButtons() {
        this.addButtonToMainContainer("Get Order Information", this.getOrderInformation ,"getOrderInformation");
    }
}

initM2Script(OrderViewM2Scripts);