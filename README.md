# Magento 2 Scripts
Here are some quick utility scripts to help manage Magento 2 on both the frontend (FE) and backend (BE).

# Install
* Download the Zip file from the repo: https://github.com/Theriol666/m2scripts/
* Unzip the content into a folder
* Download the browser extension Tampermonkey: https://www.tampermonkey.net/
* Go to the addon icon and enter the control panel
* Go to the "Utility" tab
* Click on the "folder" button next to "Import" and import each script inside app/(backend_scripts|frontend_scripts)

## Manage Backend Scripts
All backend scripts are auto-injected when you are visiting specific pages. You can check the row with the // @match parameter to understand on which pages they are enabled. For example:
> // @match        *://*/*catalog/product_attribute/edit*/*

## Manage Frontend Scripts
To avoid mismatched injections, all FE scripts are disabled by default. You can go into each script and edit its configuration regarding "inclusion/exclusion". I suggest using the "User Inclusion" configuration to add the domains where you want to enable the script.

It's fine to use matches like those:
* *://*domain.*/*
* https://www.domain.local/*

# Scripts Usage
When you run a script for the first time, the main application will prompt you for some information. This data is mainly used for API calls.

All scripts store some data inside the browser's local storage. The main information is about the API:
* m2script_api_base_url: URL to call when an API call is made
* m2script_api_user: user to log in
* m2script_api_password: user password to log in
* m2script_product_page_suffix: used to get the correct product page
* m2script_store_views: saves all store information, used by frontend scripts. The data is retrieved by an API call
* m2script_api_token: saved in session storage, this is the API token obtained from the first API call. If Magento returns 402 error, a new token will be requested.

If you delete one of these keys, the script will prompt you for the information again the next time it runs.

## Use single functionality
From the browser console, you can call a method of a script. For example, if you are on the frontend (FE), you can use the ProductM2Scripts to make an API call:

> window.ProductM2Scripts.makeApiCall('/rest/all/V1/products/20086717/')

# Customizations
You can clone and create new scripts using the basic APP class M2Scripts contained in backend_app.js or frontend_app.js.

In this way, you can customize functionalities or create new scripts for your needs.

You just need to respect three things to create new scripts:
* Use this global variables:
> // @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/frontend_app.js
> 
> // @require      https://raw.githubusercontent.com/Theriol666/m2scripts/refs/heads/main/app/init_app.js
* Create a class that extends "M2Scripts"
* Add the class factory: initM2Script(YouClassM2Scripts);