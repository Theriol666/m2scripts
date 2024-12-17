(function (window) {
    let appTemplate = `<div id="m2scripts-app" style="opacity: 1" ></div>`;

    let M2ScriptsApp = new Vue({
        data: {
        },
        methods: {
            getUserId(url) {
                let userId = '';
                let regex = /github.com\/([^\/]*).*/;
                let found = url.match(regex);
                if (found && found.length > 1) {
                    userId = found[1];
                    this.getUserInfo(userId);
                }
            },
            getUserInfo(userId) {
                fetch('https://api.github.com/users/' + userId).then(res => {
                    return res.json();
                }).then(json => {
                        this.userInfo = json;
                    }
                );
            }
        },
        created: function () {
            this.getUserId(window.location.toString());
        }
    });

    window.M2Scripts = {
        isReady(successCallBack) {
            jq(document).ready(function(){
                successCallBack();
            });
        },
        appendToBody() {
            jq('body').append(appTemplate);
        },
        addStyle() {
            jq('head').append(`<style type="text/css"></style>`);
        },
        startApp() {
            this.appendToBody();
            setTimeout(() => {
                M2ScriptsApp.$mount('#m2scripts-app');
            }, 3000);
        }
    };
})(window);