// ==UserScript==
// @name         Magento 2 > BE > Order View
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current order
// @author       rbortolotto
// @match        *://*/*sales/order/view*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/order_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/order_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

// add M2Scripts from init_app.js
ensureScriptExists("https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js")

class OrderViewM2Scripts extends M2Scripts {
    regex = /order_id\/(\d+)\//;
    orderId = window.location.pathname.match(this.regex)[1];

    getOrderInformation() {
        alert(JSON.stringify(window.M2Scripts.makeApiCall('/rest/all/V1/orders/' + this.orderId), null, 2));
    }

    addButtons() {
        this.addButtonToMainContainer("Get Order Information", this.getOrderInformation ,"getOrderInformation");
    }
}

initM2Script(OrderViewM2Scripts);