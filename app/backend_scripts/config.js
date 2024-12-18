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
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==

// add M2Scripts from init_app.js
ensureScriptExists("https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js")

class ConfigManagerM2Scripts extends M2Scripts {

    lastConfig = null;
    lastValues = null;
    selectionEventActive = null;
    pathShown = false;

    showConfigPath(event) {
        if (this.pathShown === true) {
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

        this.pathShown = true;
        parentButton.disabled = true;
    }

    toggleValuesToSelect() {
        let configPath = prompt("Add Configuration Path", (this.lastConfig ? this.lastConfig : '')),
            configValues = prompt("Configuration values separated by comma (,).", (this.lastConfig ? this.lastValues : ''));

        if (configPath === null || configValues === null) {
            console.log("Not valid configuration");
            return;
        }

        this.lastConfig = configPath;
        this.lastValues = configValues;

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

    activateSelection(event) {
        const element = event.target,
              optionsRequest = this.selectionEventActive === "options",
              valuesRequest = this.selectionEventActive === "values";

        if (this.selectionEventActive === null || element.nodeName !== "SELECT") {
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
            const activatedButtonClass = this.selectionEventActive === "options" ? ".m2scripts-getSelectOptions" : ".m2scripts-getSelectValues",
                  activatedButton = document.querySelector(activatedButtonClass);
            document.querySelector("body").removeEventListener('click', this.activateSelection);
            activatedButton.disabled = false;
            this.selectionEventActive = null;
        }
    }

    getSelectProprieties(event) {
        const selectInputs = document.querySelectorAll("#container select"),
              element = event.target,
              optionsRequest = element.className === "m2scripts-getSelectOptions",
              valuesRequest = element.className === "m2scripts-getSelectValues";

        if (this.selectionEventActive !== null) {
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
            this.selectionEventActive = optionsRequest ? "options" : "values";
        }
    }

    addButtons() {
        this.addButtonToMainContainer("Show Config Path", this.showConfigPath ,"showConfigPath");
        this.addButtonToMainContainer("Get Values From Select", this.getSelectProprieties ,"getSelectValues");
        this.addButtonToMainContainer("Get Options From Select", this.getSelectProprieties ,"getSelectOptions");
        this.addButtonToMainContainer("Toggle Values To Select", this.toggleValuesToSelect ,"toggleValuesToSelect");
    }
}

initM2Script(ConfigManagerM2Scripts);