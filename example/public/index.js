
var apmMonitor = window.apmMonitor.default;
try {
    apmMonitor.init().customReporter((log) => {
        console.log('new sendLog3:', log)
    })
} catch (error) {
    alert(JSON.stringify(error))
}
console.log('apmMonitor:', apmMonitor)


function scriptError() {
    obj.name = 1;
}

function resourceError() {
    var img = document.createElement('img');
    img.src = '/alone_error.jpg';
    document.getElementById('resourceTest').append(img);
}

function xhrError() {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'xhrError');
    xhr.responseType = 'json';
    xhr.onload = function() {
        console.log('xhr.response:', xhr.response);
    };
    xhr.onerror = function(error) {
        console.log('xhr onerror', error)
    };
    xhr.send();
}

// 低版本浏览器没有fetch和Promise 会报错，导致所有代码无法执行
function fetchError() {
    if (window.fetch) {
        window.fetch('fetchError', {
            method: 'GET'
        })
        .then(res => {
            if (res.ok) {
                return res;
            }
            throw new Error('fetch error res:', res);
        })
        .catch(e => {
            console.log(e);
        })
    }
}

// 低版本浏览器没有fetch和Promise 会报错，导致所有代码无法执行
function promiseError() {
    return new Promise((resolve, reject) => {
        reject('promise reject');
    });
}

function innerClientInfo() {
    document.getElementById('originUserAgent').innerText = JSON.stringify(window.navigator.userAgent);

    const clientInfo = apmMonitor.getClientInfo();
    console.log('clientInfo:', clientInfo);
    document.getElementById('userAgent').innerText = clientInfo.useragent;
    document.getElementById('clientOS').innerText = clientInfo.client_os;
    document.getElementById('clientOSVersion').innerText = clientInfo.client_os_version;
    document.getElementById('browser').innerText = clientInfo.browser;
    document.getElementById('browserVersion').innerText = clientInfo.browser_version;
}

// document.addEventListener("DOMContentLoaded", () => {
//     innerClientInfo()
// });

window.onload = function() {
    innerClientInfo()
}