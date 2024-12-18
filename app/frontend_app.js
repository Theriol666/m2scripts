class M2Scripts {
    run = false;
    apiSiteBaseUrl = "";
    productPageSuffix = "";
    maxApiRetry =  5;
    apiRetry = 1;

    constructor(initCallback = null) {
        this.isReady(initCallback);
    }

    getApiBaseUrl() {
        return window.location.origin;
    }

    makeApiCall(endpoint, method = "GET", body = {}) {
        const token = this.getApiToken(),
                url = this.getApiBaseUrl() + endpoint,
                self = this;

        let result = null;
    
        jQuery
        .ajax({
            url: url,
            async: false,
            timeout: 30000,
            method: method,
            contentType: "application/json; charset=UTF-8",
            headers: {
                "Authorization": "Bearer " + token,
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(body),
            beforeSend: function(xhr){
                //Empty to remove magento's default handler
            },
            success: function(data) {
                result = data;
            }
        })
        .fail(function(xhr, textStatus) {
            if (self.apiRetry === self.maxApiRetry) {
                self.apiRetry = 1;
                return '{"message": "API call Failed"}';
            }

            if (xhr.status === 401) {
                self.apiRetry++;
                self.getApiToken(true);
                result = self.makeApiCall(endpoint, method, body);
            } else{
                result = xhr.responseJSON
            }
        })
    
            return result;
    }

    getApiToken(forceGeneration = false, updateUser = false) {
        const tokenEndpoint = "/rest/V1/integration/admin/token";
        var user = localStorage.getItem("m2script_api_user"),
            password = localStorage.getItem("m2script_api_password"),
            token = sessionStorage.getItem("m2script_api_token"),
            tokenUrl = this.getApiBaseUrl() + tokenEndpoint;

        if (!forceGeneration && token) {
            return token;
        }

        if (updateUser || !user) {
            user = prompt("Set User to API");
            localStorage.setItem("m2script_api_user", user);
        }
        if (updateUser || !password) {
            password = prompt("Set Password to API");
            localStorage.setItem("m2script_api_password", password);
        }

        const payload = {
            "username": user,
            "password": password
        };

        jQuery.
        ajax({
            url: tokenUrl,
            cache: false,
            async: false,
            timeout: 30000,
            method: "POST",
            contentType: "application/json; charset=UTF-8",
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            showLoader: true,
            beforeSend: function(xhr){
                //Empty to remove magento's default handler
            },
            data: JSON.stringify(payload),
            success: function(data) {
                token = data;
                sessionStorage.setItem("m2script_api_token", token);
            }
        });

        return token;
    }

    addButtonToMainContainer(buttonText, callback, collbackClassName) {
        const container = document.querySelector('.m2scripts-contianer'),
                buttonEl = document.createElement("button"),
                buttonTextEl = document.createTextNode(buttonText);

        buttonEl.addEventListener("click", callback);
        buttonEl.classList.add("m2scripts-" + collbackClassName);
        buttonEl.appendChild(buttonTextEl);
        container.appendChild(buttonEl);
    }

    addMainContainer() {
        if (document.querySelector('.m2scripts-contianer') === null) {
            // create if it dosen't exist
            const container = document.createElement("div");
            container.classList.add("m2scripts-contianer");
            container.style.position = "fixed";
            container.style.right = 0;
            container.style.bottom = 0;
            container.style.zIndex = "9999999";
            document.querySelector("body").appendChild(container);
        }
    }

    addStyle() {
        jQuery('head').append(`<style type="text/css"></style>`);
    }

    isReady(successCallBack = null) {
        const self = this;
        if (self.run === true && successCallBack !== null) {
            successCallBack();
        } else if (typeof jQuery === "undefined") {
            setTimeout(function() {self.isReady(successCallBack)}, 2000);
        } else {
            jQuery(document).ready(function(){
                self.init();
                self.addStyle();
                self.addMainContainer();
                self.addButtons();

                self.run = true;
                if (successCallBack !== null) {
                    successCallBack();
                }
            });
        }
    }

    addButtons() {
        console.log("No buttons added");
    }

    init() {
        this.apiSiteBaseUrl = localStorage.getItem("m2script_api_base_url") ?? localStorage.setItem("m2script_api_base_url", prompt("Set Api Base Url"));
        this.productPageSuffix = localStorage.getItem("m2script_product_page_suffix") ?? localStorage.setItem("m2script_product_page_suffix", prompt("Set Product Page Suffix"));
        this.getStoreViews();
    }

    getCurrentStoreViewUrlCode() {
        return window.location.pathname.split('/').length ? window.location.pathname.split('/')[1] : "";
    }

    getCurrentBaseUrl() {
        return window.location.origin;
    }

    getApiStoreCode(urlStoreCode = null) {
        const storeView = this.getStoreViewByCurrentUrl();
        if (!storeView) {
            return 'all';
        } else {
            return storeView.code;
        }
    }

    getApiBaseUrl() {
        return this.apiSiteBaseUrl === "" ? window.location.origin : this.apiSiteBaseUrl;
    }

    getStoreViews() {
        var storeViews = localStorage.getItem("m2script_store_views");
        if (!storeViews) {
            var formatedStoreViews = {},
                configStoreViews = {};

            configStoreViews = this.makeApiCall('/rest/all/V1/store/storeConfigs');
            storeViews = this.makeApiCall('/rest/V1/store/storeViews');
            if(configStoreViews && configStoreViews.length && storeViews && storeViews.length) {
                storeViews.forEach(function(store) {
                    formatedStoreViews[store.code] = store;
                    const storeConfig = configStoreViews.find(config => config.id === store.id);
                    if (storeConfig) {
                        formatedStoreViews[store.code].base_url = storeConfig.secure_base_link_url;
                        formatedStoreViews[store.code].config = storeConfig;
                    }
                });

                this.setStoreViews(formatedStoreViews);
                return formatedStoreViews;
            } else {
                console.log("No store views found");

                return {};
            }
        } else {
            return JSON.parse(storeViews);
        }
    }

    getStoreViewByCurrentUrl() {
        const currentStoreCodeUrl = this.getCurrentStoreViewUrlCode(),
              currentUrl = this.getCurrentBaseUrl() + (currentStoreCodeUrl == "" ? "" : "/" + currentStoreCodeUrl) + "/";

        let storeViews = this.getStoreViews();
        if (!storeViews) {
          return null;
        }

        const currentStoreView = Object.values(storeViews).find(store => store.base_url === currentUrl);
        return currentStoreView;
    }

    setStoreViews(storeViews) {
        localStorage.setItem("m2script_store_views", JSON.stringify(storeViews));
    }
}