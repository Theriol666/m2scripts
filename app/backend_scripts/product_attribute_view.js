// ==UserScript==
// @name         Magento 2 > BE > PROD > ATTR > VIEW
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Get data from product attribute view page
// @author       rbortolotto
// @match        *://*/*catalog/product_attribute/edit*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://github.com/Theriol666/m2scripts/raw/main/app/backend_script/product_attribute_view.js
// @downloadURL  https://github.com/Theriol666/m2scripts/raw/main/app/backend_script/product_attribute_view.js
// @require      https://github.com/Theriol666/m2scripts/raw/main/app/backend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    let emptyColumnHidden = false;

    function importOptions(valuesToAdd = []) {
        const headColumns = document.querySelectorAll("#manage-options-panel table thead tr th"),
              columnsTotal = headColumns.length,
              addButton = document.querySelector("button#add_new_option_button"),
              totalValues = valuesToAdd.length,
              parentButton = document.querySelector("button.m2scripts-createImportForm");

        parentButton.disabled = true;

        let adminColumnIndex = null;
        headColumns.forEach(function(head, index) {
            let span = head.querySelector("span");
            if (span !== null && span.innerHTML === "Admin") {
                adminColumnIndex = index;
            }
        });

        if (adminColumnIndex !== null && addButton !== null && totalValues > 0) {
            addButton.click();
            for (let rowIndex = 0; rowIndex < totalValues; rowIndex++) {
                let totalRow = valuesToAdd[rowIndex].length;
                for (let columnIndex = 0; columnIndex < totalRow; columnIndex++) {
                    document.querySelector("#manage-options-panel table tr:last-child td:nth-child(" + ( columnIndex + (adminColumnIndex + 1) ) + ") input").value = valuesToAdd[rowIndex][columnIndex];
                }

                if ((rowIndex + 1) < totalValues) {
                    addButton.click();
                }
            }
        }

        parentButton.disabled = false;
    }

    function manageImportForm() {
        const importForm = document.querySelector(".m2scripts-contianer .import-options-form"),
              importData = importForm.querySelector("#options_import_data"),
              importDataSeparator = importForm.querySelector("#options_import_separator");

        let values = importData.value.split("\n");

        values = Array.from(values).map(value => value.split(importDataSeparator.value));
        importOptions(values);
        closeImportForm();
    }

    function closeImportForm() {
        const importForm = document.querySelector(".m2scripts-contianer .import-options-form");
        importForm.style.display = "none";
    }

    function createImportForm() {
        const container = document.querySelector('.m2scripts-contianer'),
              formContainer = container.querySelector(".import-options-form") === null ? document.createElement("div") : container.querySelector(".import-options-form"),
              formDisplay = formContainer.style.display;

        if (formContainer === null || formContainer.className !== "import-options-form") {
            formContainer.classList.add("import-options-form");
            formContainer.style.background = "#fff";
            formContainer.style.display = "block";
            formContainer.innerHTML =
                `
                <span>Close</span><br />
                <textarea name="options_import_data" id="options_import_data" rows="20" placeholder="Add csv content" style="width: 100%"></textarea><br />
                Separator:<br />
                <input type="text" name="options_import_separator" id="options_import_separator" value="," /><br />
                <button name="options_import_submit" id="options_import_submit">Import data</button>
                `;
            container.prepend(formContainer);
            container.querySelector(".import-options-form span").addEventListener("click", closeImportForm);
            container.querySelector("#options_import_submit").addEventListener("click", manageImportForm);
        } else {
            formContainer.style.display = formDisplay === "block" ? "none" : "block";
        }
    }

    function toggleEmptyOptionsColumn(event) {

        const button = event.target;

        button.disabled = true;

        if (emptyColumnHidden === false) {
            const table = document.querySelector("#manage-options-panel table"),
                  headColumns = table.querySelectorAll("thead tr th"),
                  totalRows = table.rows.length - 2, // removed last 2 rows for option and other
                  totalColumns = totalRows > 0 ? table.rows[0].cells.length -1 : 0;

            if (totalRows === 0) {
                button.disabled = false;
                return;
            }

            for (let c=0; c < totalColumns; c++) {
                let isEmpty = true;
                for (let r=1; r < totalRows; r++) {
                    let cell = table.rows[r].cells[c],
                        input = cell ? cell.querySelector("input") : null;
                    if (input === null || input.value !== "") {
                        isEmpty = false;
                        break;
                    }
                }
                if (isEmpty === true) {
                    table.querySelectorAll("td:nth-child(" + ( c + 1 ) + ")").forEach(function(column) {
                        column.style.display = "none";
                    });
                    headColumns[c].style.display = "none";
                }
            }

            emptyColumnHidden = true;
            button.disabled = false;

        } else {
            const cells = document.querySelectorAll("#manage-options-panel table td"),
                  head = document.querySelectorAll("#manage-options-panel table th");

            cells.forEach(function(cell) {
                if (cell.style.display === "none") {
                    cell.style.removeProperty("display");
                }
            });
            head.forEach(function(cell) {
                if (cell.style.display === "none") {
                    cell.style.removeProperty("display")
                }
            });

            emptyColumnHidden = false;
            button.disabled = false;;
        }

    }

    function addButtons() {
        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        document.M2Scripts.addButtonToMainContainer("Toggle empty columns", toggleEmptyOptionsColumn ,"toggleEmptyOptionsColumn");
        document.M2Scripts.addButtonToMainContainer("Import options as CSV", createImportForm ,"createImportForm");
    }

    function start(){
        M2Scripts.isReady(function () {ù
            addButtons();
        });
    }

    start();
})();