// ==UserScript==
// @name         Magento 2 > BE > PL
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get data from column list!
// @author       rbortolotto
// @match        *://*/*catalog/product/index*/*
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_list.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/product_list.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class ProductListM2Scripts extends M2Scripts {

    constructor(initCallback = null) {
        super(initCallback);

        this.skuColumn = null;
        this.imageCulumn = null;
        this.urlKeyCulumn = null;
        this.imagePlaceholderValue = 'placeholder';        
    }

    getColumnByText(text) {
        var columnList = null;
        document.querySelectorAll(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid > thead > tr > th > span.data-grid-cell-content").forEach((column, index) => {
            if (columnList === null && column.innerText === text) {
                columnList = index + 2; // select + additional position for nth
                console.log(text, index, columnList);
                return;
            }
        });

        return columnList;
    }

    getSkuColumn() {
        if (this.skuColumn === null) {
            this.skuColumn = this.getColumnByText("SKU");
        }

        return this.skuColumn;
    }

    getThumbColumn() {
        if (this.imageCulumn === null) {
            this.imageCulumn = this.getColumnByText("Thumbnail");
        }

        return this.imageCulumn;
    }

    getUrlkeyColumn() {
        if (this.urlKeyCulumn === null) {
            this.urlKeyCulumn = this.getColumnByText("URL Key");
        }

        return this.urlKeyCulumn;
    }

    getSku() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            var skus=[];
            document.querySelectorAll('.admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid > tbody > tr > td:nth-child('+ this.getSkuColumn() +')').forEach((element) =>{ skus.push(element.innerText)});
            alert(skus.join(","))
        }
    }

    getNoImage() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            var skus=[];
            // imgUrl = prompt("Img URL: ", imagePlaceholderValue);
            document.querySelectorAll('tbody td:nth-child('+ this.getThumbColumn() +') img').forEach((element) =>{ if (element.src.includes(this.imagePlaceholderValue)) { skus.push(element.parentNode.parentNode.parentNode.parentNode.querySelector("tbody td:nth-child("+ this.getSkuColumn() +")").innerText)} });
            alert(skus.join(","));
        }
    }

    getUrlKey() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            document.querySelectorAll('.admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid > tbody > tr > td:nth-child('+ this.getUrlkeyColumn() +') div').forEach((element) =>{
                let url = element.innerHTML,
                    inputUrl = document.createElement("input");
                inputUrl.value = url;
                inputUrl.addEventListener("click", (event) => {navigator.clipboard.writeText(event.target.value); event.target.preventDefault();});
                inputUrl.addEventListener("mouseup", (event) => {navigator.clipboard.writeText(event.target.value); event.target.preventDefault();});
                element.parentNode.appendChild(inputUrl);
            });
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Get SKUs From List", this.getSku ,"getSku");
        this.addButtonToMainContainer("Get SKUs with no Thumb", this.getNoImage ,"getNoImage");
        this.addButtonToMainContainer("Get Url Key", this.getUrlKey ,"getUrlKey");
    }
}

initM2Script(ProductListM2Scripts);