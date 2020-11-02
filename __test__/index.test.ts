// import getClientInstance from '../src/core/clientInstance';
import Client from '../src/core/client';

const usObj = {
    chrome: 
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    safari:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    mobileSafari:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    qq: 
        'MQQBrowser/26Mozilla/5.0(Linux;U;Android2.3.7;zh-cn;MB200Build/GRJ22;CyanogenMod-)AppleWebKit/533.1(KHTML,likeGecko)Version/.0MobileSafari/533.1',
    opera: 
        'Opera/9.80(Android2.3.4;Linux;OperaMobi/build-;U;en-GB)Presto/2.8.149Version/11.10',
    androidBrowser: 
        'Mozilla/5.0 (Linux; Android 8.0.0; ONEPLUS A3010) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.117 Mobile Safari/537.36',
    onePlusBrowser: 
        'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; ONEPLUS A3010 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.0.0 Mobile Safari/537.36'
};

// test(`test Mac chrome - ${usObj.chrome}`, () => {
//     const client = new Client(usObj.chrome);
//     const info = client.getClientInfo();
//     console.log('chrome info:', info);
//     expect(info.client_os).toBe('MacOS');
//     expect(info.client_os_version).toBe('13.2.3');
//     expect(info.browser).toBe('chrome');
//     expect(info.browser_version).toBe('13.0.3');
// });

// test(`test Mac Safari - ${usObj.safari}`, () => {
//     const client = new Client(usObj.safari);
//     const info = client.getClientInfo();
//     console.log('safari info:', info);
//     expect(info.client_os).toBe('iOS');
//     expect(info.client_os_version).toBe('13.2.3');
//     expect(info.browser).toBe('Safari');
//     expect(info.browser_version).toBe('13.0.3');
// });

// test(`test iPhone Safari - ${usObj.mobileSafari}`, () => {
//     const client = new Client(usObj.mobileSafari);
//     const info = client.getClientInfo();
//     console.log('mobileSafari info:', info);
//     expect(info.client_os).toBe('iOS');
//     expect(info.client_os_version).toBe('13.2.3');
//     expect(info.browser).toBe('Safari');
//     expect(info.browser_version).toBe('13.0.3');
// });

// test(`test Mac qq - ${usObj.qq}`, () => {
//     const client = new Client(usObj.qq);
//     const info = client.getClientInfo();
//     console.log('qq info:', info);
//     expect(info.client_os).toBe('iOS');
//     expect(info.client_os_version).toBe('13.2.3');
//     expect(info.browser).toBe('Safari');
//     expect(info.browser_version).toBe('13.0.3');
// });

// test(`test Mac opera - ${usObj.opera}`, () => {
//     const client = new Client(usObj.opera);
//     const info = client.getClientInfo();
//     console.log('opera info:', info);
//     expect(info.client_os).toBe('iOS');
//     expect(info.client_os_version).toBe('13.2.3');
//     expect(info.browser).toBe('Safari');
//     expect(info.browser_version).toBe('13.0.3');
// });

test(`test Mac onePlusBrowser - ${usObj.onePlusBrowser}`, () => {
    const client = new Client(usObj.onePlusBrowser);
    const info = client.getClientInfo();
    console.log('onePlusBrowser info:', info);
    expect(info.client_os).toBe('iOS');
    expect(info.client_os_version).toBe('13.2.3');
    expect(info.browser).toBe('Safari');
    expect(info.browser_version).toBe('13.0.3');
});

test(`test Mac androidBrowser - ${usObj.androidBrowser}`, () => {
    const client = new Client(usObj.androidBrowser);
    const info = client.getClientInfo();
    console.log('androidBrowser info:', info);
    expect(info.client_os).toBe('iOS');
    expect(info.client_os_version).toBe('13.2.3');
    expect(info.browser).toBe('Safari');
    expect(info.browser_version).toBe('13.0.3');
});
