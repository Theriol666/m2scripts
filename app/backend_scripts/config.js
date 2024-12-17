// ==UserScript==
// @name         Magento 2 > BE > CONFIG
// @namespace    M2Scripts
// @version      2024-10-28
// @description  Manage data from config options
// @author       rbortolotto
// @match        *://*/*admin/system_config*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/config.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_script/config.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    var lastConfig = null,
        lastValues = null,
        selectionEventActive = null,
        pathShown = false;

    function showConfigPath(event) {
        if (pathShown === true) {
            return
        }
        const inputs = document.querySelectorAll("#container form#config-edit-form td.value input"),
              selects = document.querySelectorAll("#container form#config-edit-form td.value select"),
              textareas = document.querySelectorAll("#container form#config-edit-form td.value textarea"),
              tables = document.querySelectorAll("table.admin__control-table"),
              parentButton = event.target;

        inputs.forEach(function(input) {
            let configId = input.id;
            input.parentElement.appendChild(document.createElement("p")).innerHTML = "<strong>Config Path: " + configId + "</strong>";
        });
        selects.forEach(function(input) {
            let configId = input.id;
            input.parentElement.appendChild(document.createElement("p")).innerHTML = "<strong>Config Path: " + configId + "</strong>";
        });
        textareas.forEach(function(input) {
            let configId = input.id;
            input.parentElement.appendChild(document.createElement("p")).innerHTML = "<strong>Config Path: " + configId + "</strong>";
        });
        tables.forEach(function(table) {
            let configId = table.id;
            table.parentElement.appendChild(document.createElement("p")).innerHTML = "<strong>Config Path: " + configId + "</strong>";
        });

        pathShown = true;
        parentButton.disabled = true;
    }

    function toggleValuesToSelect() {
        let configPath = prompt("Add Configuration Path", (lastConfig ? lastConfig : '')),
            configValues = prompt("Configuration values separated by comma (,).", (lastConfig ? lastValues : ''));

        if (configPath === null || configValues === null) {
            console.log("Not valid configuration");
            return;
        }

        lastConfig = configPath;
        lastValues = configValues;

        configPath = configPath.replace("/","_");
        configValues = configValues.split(",");

        const select = document.querySelector("#" + configPath);
        if (select === null) {
            console.log("No config found");
            return;
        }

        let options = select.options;
        Array.from(options).forEach(function(option) {
            if (configValues.include(option.value)) {
                option.selected = !option.selected
            }
        });
    }

    function activateSelection(event) {
        const element = event.target,
              optionsRequest = selectionEventActive === "options",
              valuesRequest = selectionEventActive === "values";

        if (selectionEventActive === null || element.nodeName !== "SELECT") {
            return;
        }

        if (optionsRequest || valuesRequest) {
            let options = optionsRequest ? element.options : element.selectedOptions,
                values = Array.from(options).map(option => option.value),
                labels = Array.from(options).map(option => option.innerHTML);

            console.log(values, labels);

            if (!element.multiple && valuesRequest) {
                alert(values.join("") + " -> " + labels.join(""));
            } else {
                alert(values.join("\n"));
                alert(labels.join("\n"));
            }
            document.querySelectorAll(".m2scripts-info").forEach(el => el.remove());
            const activatedButtonClass = selectionEventActive === "options" ? ".m2scripts-getSelectOptions" : ".m2scripts-getSelectValues",
                  activatedButton = document.querySelector(activatedButtonClass);
            document.querySelector("body").removeEventListener('click', activateSelection);
            activatedButton.disabled = false;
            selectionEventActive = null;
        }
    }

    function getSelectProprieties(event) {
        const selectInputs = document.querySelectorAll("#container select"),
              element = event.target,
              optionsRequest = element.className === "m2scripts-getSelectOptions",
              valuesRequest = element.className === "m2scripts-getSelectValues";

        if (selectionEventActive !== null) {
            console.log("Select event already active");
            return;
        }

        if (optionsRequest || valuesRequest) {
            if (selectInputs === null) {
                alert("No select found");
                return
            }

            let infoMessage = "Click to get "+ (optionsRequest ? "options" : "values") +". If blocked, remove use parent value";

            selectInputs.forEach(function(select) {
                let message = document.createElement("p");
                message.classList.add("m2scripts-info");
                message.innerHTML = infoMessage;
                select.parentNode.appendChild(message);
            });
            element.disabled = true;
            document.querySelector("body").addEventListener('click', activateSelection, false);
            selectionEventActive = optionsRequest ? "options" : "values";
        }
    }

    function addButtons() {

        const container = document.querySelector('.m2scripts-contianer');
        if (container === null) {
            console.log("Error: no container for M2 Scripts");
        }

        window.M2Scripts.addButtonToMainContainer("Show Config Path", showConfigPath ,"showConfigPath");
        window.M2Scripts.addButtonToMainContainer("Get Values From Select", getSelectProprieties ,"getSelectValues");
        window.M2Scripts.addButtonToMainContainer("Get Options From Select", getSelectProprieties ,"getSelectOptions");
        window.M2Scripts.addButtonToMainContainer("Toggle Values To Select", toggleValuesToSelect ,"toggleValuesToSelect");
    }

    function start(){
        window.M2Scripts.isReady(function () {
            addButtons();
        });
    }

    start();
})();