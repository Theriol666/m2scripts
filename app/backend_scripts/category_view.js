// ==UserScript==
// @name         Magento 2 > BE > CATEGORY > VIEW
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get info from current category
// @author       rbortolotto
// @match        *://*/*catalog/category/edit*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/category_view.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/category_view.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

class CategoryViewM2Scripts extends M2Scripts {

    constructor(initCallback = null) {
        super(initCallback);
        this.attributesShowed = [];
    }

    showCategoryAttributesCode(event) {
        const attributesElement = document.querySelectorAll("fieldset .admin__field"),
              self = this;

        attributesElement.forEach(function(element) {
            const input = element.querySelector("input");
            let code = element.getAttribute('data-index');

            if (!code && input) {
                code = input.getAttribute('name');
            }

            if (code && self.attributesShowed.indexOf(code) === -1) {
                const label = element.querySelector(".admin__field-label label") || element.querySelector("label.admin__field-label"),
                      attributeText = document.createElement("p");

                attributeText.innerHTML = "<strong>Attribute Code: " + code + "</strong>";

                if (label) {
                    label.appendChild(attributeText);
                } else {
                    element.appendChild(attributeText);
                }
                self.attributesShowed.push(code);
            }
        });
    }

    getAttributeInformation() {
        const code = prompt("Attribute code");
        if (code) {
            this.showJsonOnModal(this.makeApiCall("/rest/V1/categories/attributes/" + code));
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Show Category Attributes Code", this.showCategoryAttributesCode ,"showCategoryAttributesCode");
        this.addButtonToMainContainer("Get Attribute Information", this.getAttributeInformation ,"getAttributeInformation");
    }
}

initM2Script(CategoryViewM2Scripts);