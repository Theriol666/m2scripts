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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==


(function() {
    'use strict';
    var skuColumn = null,
        imageCulumn = null,
        urlKeyCulumn = null,
        imagePlaceholderValue = 'placeholder';

    function getColumnByText(text) {
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

    function getSkuColumn() {
        if (skuColumn === null) {
            skuColumn = getColumnByText("SKU");
        }

        return skuColumn;
    }

    function getThumbColumn() {
        if (imageCulumn === null) {
            imageCulumn = getColumnByText("Thumbnail");
        }

        return imageCulumn;
    }

    function getUrlkeyColumn() {
        if (urlKeyCulumn === null) {
            urlKeyCulumn = getColumnByText("URL Key");
        }

        return urlKeyCulumn;
    }

    function getSku() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            var skus=[];
            document.querySelectorAll('.admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid > tbody > tr > td:nth-child('+ getSkuColumn() +')').forEach((element) =>{ skus.push(element.innerText)});
            alert(skus.join(","))
        }
    }

    function getNoImage() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            var skus=[];
            // imgUrl = prompt("Img URL: ", imagePlaceholderValue);
            document.querySelectorAll('tbody td:nth-child('+ getThumbColumn() +') img').forEach((element) =>{ if (element.src.includes(imagePlaceholderValue)) { skus.push(element.parentNode.parentNode.parentNode.parentNode.querySelector("tbody td:nth-child("+ getSkuColumn() +")").innerText)} });
            alert(skus.join(","));
        }
    }

    function getUrlKey() {
        if (document.querySelector(".admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid") !== null) {
            document.querySelectorAll('.admin__data-grid-outer-wrap > .admin__data-grid-wrap > table.data-grid > tbody > tr > td:nth-child('+ getUrlkeyColumn() +') div').forEach((element) =>{
                let url = element.innerHTML,
                    inputUrl = document.createElement("input");
                inputUrl.value = url;
                inputUrl.addEventListener("click", (event) => {navigator.clipboard.writeText(event.target.value); event.target.preventDefault();});
                inputUrl.addEventListener("mouseup", (event) => {navigator.clipboard.writeText(event.target.value); event.target.preventDefault();});
                element.parentNode.appendChild(inputUrl);
            });
        }
    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Get SKUs From List", getSku ,"getSku");
        document.M2Scripts.addButtonToMainContainer("Get SKUs with no Thumb", getNoImage ,"getNoImage");
        document.M2Scripts.addButtonToMainContainer("Get Url Key", getUrlKey ,"getUrlKey");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();