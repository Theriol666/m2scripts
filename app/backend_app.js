class M2Scripts {
    run = false;
    apiSiteBaseUrl = "";
    productPageSuffix = "";
    maxApiRetry = 5;
    apiRetry = 1;

    constructor(initCallback = null) {
        this.bindMethods();
        this.isReady(initCallback);
    }

    bindMethods() {
        // Itera su tutte le proprietà della classe
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            const value = this[key];
            // Se la proprietà è una funzione, fai il bind al contesto dell'istanza
            if (typeof value === 'function' && key !== 'constructor') {
                this[key] = value.bind(this);
            }
        }
    }

    getApiBaseUrl() {
        return window.location.origin;
    }

    makeApiCall(endpoint, method = "GET", body = {}) {
        const token = this.getApiToken(),
                url = this.getApiBaseUrl() + endpoint,
                self = this;

        let result = null;

        jQuery.
        ajax({
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
        }).fail(function(xhr, textStatus) {
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
	
    showJsonOnModal(json = {}) {
        const existingModal = document.querySelector("div.m2scripts-modal");

		if (existingModal) {
			existingModal.querySelector("pre#json").innerHTML = JSON.stringify(json, null, 2);
		} else {
			const modal = document.createElement("div"),
				  modalCloseButton = document.createElement("div");
  
			modal.classList.add("m2scripts-modal");
			modal.style.position = "fixed";
			modal.style.top = "20%";
			modal.style.left = "20%";
			modal.style.zIndex = "9999999";
			modal.style.maxHeight = "50%";
			modal.style.width = "60%";
			modal.style.overflow = "auto";
			modal.style.background = "#FFF";
			modal.innerHTML = '<pre id="json">' + JSON.stringify(json, null, 2) + '</pre>';

			modalCloseButton.innerHTML = "<p>Close Modal</p>";
			modalCloseButton.addEventListener("click", function (element) {
				const parentModal = document.querySelector("div.m2scripts-modal");
				if (parentModal) {
					parentModal.remove();
				}
			});

			modal.prepend(modalCloseButton);
			document.querySelector("body").appendChild(modal);
		}
    }
}