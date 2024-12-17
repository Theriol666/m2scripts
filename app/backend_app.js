// ==UserScript==
// @name         M2Scripts > BE APP
// @namespace    M2Scripts
// @version      0.0.1
// @description  Load main APP for backend part.
// @author       rbortolotto
// @match        *://*/*admin*/*
// @icon         https://www.shareicon.net/download/2016/07/10/119934_magento.ico
// @supportURL   https://github.com/Theriol666/m2scripts
// @updateURL    https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @downloadURL  https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/backend_app.js
// @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/main_app.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-body
// @noframes
// ==/UserScript==

(function () {
    'use strict';
    window.M2Scripts.isReady(function () {
        window.M2Scripts.addStyle();
        window.M2Scripts.addMainContainer();
    });
})();