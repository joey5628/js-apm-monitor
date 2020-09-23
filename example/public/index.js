var apmMonitor = window.apmMonitor.default;
// apmMonitor.reporter.sendLog = function(log) {
//     console.log('new sendLog222:', log)
// }
apmMonitor.customReporter((log) => {
    console.log('new sendLog3:', log)
})
apmMonitor.init({
    url: 'http://localhost:3000/log'
});
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

function fetchError() {
    fetch('fetchError', {
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

function promiseError() {
    return new Promise((resolve, reject) => {
        reject('promise reject');
    });
}
