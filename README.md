# Magento 2 Scripts
Quick utilities scripts to manage Magento 2 on FE / BE.

# Install
* Download as Zip the from the repo: https://github.com/Theriol666/m2scripts/
* Unzip content in a folder
* Download the browser extension Tampermonkey (https://www.tampermonkey.net/)
* Go to the addon icon and enter in control pannel
* Go to "Utility" tab
* Cick on "folder" button align to "Import" and import each script inside "app/(backend_scripts|frontend_scripts)"

## Manage Backend Scripts
All backend scripts are auto-injected when you are visiting specific pages. You can check the row with "// @match" param to unserstand in which page are enabled. Es:
> // @match        *://*/*catalog/product_attribute/edit*/*

## Manage Frontend Scripts
To avoid mismatch injection, all FE scripts are disabled as default. You can go in each script and edii it's configuration about "inclusion/exclusion". I suggest to use the "User Inclusion" configuration to add the domains where you want to enable the script.

It's fine to use matches like those:
- *://*domain.*/*
- https://www.domain.local/*

# Scripts Usage
All scripts storage some data inside the browser local storage. The main informations are about API:
- m2script_api_base_url : url to call when a API call is done;
- m2script_api_user : user to log
- m2script_api_password : user password to log
- m2script_product_page_suffix : used to get the correct product page
- m2script_store_views : save all stores information, used by frontend scripts. The data are getted by an API call
- m2script_api_token : saved on session storage, is the API Token get from the first API call. If Magento get a 402, a new one will asks.

If you delete one of those keys the first running scripts will ask you the information again.