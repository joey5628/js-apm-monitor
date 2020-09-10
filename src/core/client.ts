import { ClientInfo } from './types';

interface VersionMap {
    [key: string]: () => string;
}

class Client {

    static instance: Client | null;
    private ua: string;
    private os: { [key: string]: boolean };
    private browser: { [key: string]: boolean };

    constructor() {
        const ua = window.navigator ? window.navigator.userAgent : '';
        this.ua = ua;

        this.os = {
            'iOS': ua.indexOf('like Mac OS X') > -1,
            'Android': ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1,
            'MacOS': ua.indexOf('Macintosh') > -1,
            'Windows': ua.indexOf('Windows') > -1,
            'Linux': ua.indexOf('Linux') > -1 || ua.indexOf('X11') > -1,
            'ChromeOS': ua.indexOf('CrOS') > -1,
            'Ubuntu': ua.indexOf('Ubuntu') > -1,
        };

        this.browser = {
            'Safari': ua.indexOf('Safari') > -1,
            'Chrome': ua.indexOf('Chrome') > -1 || ua.indexOf('CriOS') > -1,
            'IE': ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1,
            'Edge': ua.indexOf('Edge') > -1,
            'Firefox': ua.indexOf('Firefox') > -1 || ua.indexOf('FxiOS') > -1,
            'FirefoxFocus': ua.indexOf('Focus') > -1,
            'Chromium': ua.indexOf('Chromium') > -1,
            'Opera': ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1,
            'UC': ua.indexOf('UC') > -1 || ua.indexOf(' UBrowser') > -1,
            'QQBrowser': ua.indexOf('QQBrowser') > -1,
            'QQ': ua.indexOf('QQ/') > -1,
            'XiaoMi': ua.indexOf('MiuiBrowser') > -1,
            'Wechat': ua.indexOf('MicroMessenger') > -1,
            'WechatWork': ua.indexOf('wxwork/') > -1,
            'Taobao': ua.indexOf('AliApp(TB') > -1,
            'Alipay': ua.indexOf('AliApp(AP') > -1,
            'Weibo': ua.indexOf('Weibo') > -1,
            'iQiYi': ua.indexOf('IqiyiApp') > -1,
        };
    }

    /**
     * 获取客户端信息
     *
     * @returns {ClientInfo}
     * @memberof Client
     */
    getClientInfo(): ClientInfo{
        return {
            useragent: this.ua,
            ...this.getOsInfo(),
            ...this.getBrowserInfo(),
            ...this.getNetwork(),
            ...this.getScreenInfo()
        };
    }

    /**
     * 获取屏幕宽高
     *
     * @returns {{screen_width: number, screen_height: number}}
     * @memberof Client
     */
    getScreenInfo(): ClientInfo {
        return {
            screen_width: window.screen.width,
            screen_height: window.screen.height
        };
    }

    /**
     * 获取网络类型
     *
     * @returns {string}
     * @memberof Client
     */
    getNetwork(): ClientInfo {
        // @ts-ignore
        const network = navigator && navigator.connection && navigator.connection.effectiveType;
        return {
            network: network || ''
        };
    }

    /**
     * 获取匹配到的系统和浏览器
     *
     * @param {('os' | 'browser')} type
     * @returns {string}
     * @memberof Client
     */
    getMatchKey(type: 'os' | 'browser'): string{
        let key = '';
        Object.keys(this[type]).some((i) => {
            if (this[type][i]) {
                key = i;
            }
            return this[type];
        });
        return key;
    }

    /**
     *
     *
     * @returns {{browser: string, browser_version: string}}
     * @memberof Client
     */
    getBrowserInfo(): {browser: string, browser_version: string} {
        const ua = this.ua;
        const browser: string = this.getMatchKey('browser');
        let browserVersion = '';
        
        const browserVersionMap: VersionMap = {
            'Safari': function () {
                return ua.replace(/^.*Version\/([\d.]+).*$/, '$1');
            },
            'Chrome': function () {
                return ua.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
            },
            'IE': function () {
                return ua.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
            },
            'Edge': function () {
                return ua.replace(/^.*Edge\/([\d.]+).*$/, '$1');
            },
            'Firefox': function () {
                return ua.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
            },
            'FirefoxFocus': function () {
                return ua.replace(/^.*Focus\/([\d.]+).*$/, '$1');
            },
            'Chromium': function () {
                return ua.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
            },
            'Opera': function () {
                return ua.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
            },
            'QQBrowser': function () {
                return ua.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
            },
            'QQ': function () {
                return ua.replace(/^.*QQ\/([\d.]+).*$/, '$1');
            },
            'UC': function () {
                return ua.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
            },
            'XiaoMi': function () {
                return ua.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
            },
            'Wechat': function () {
                return ua.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
            },
            'WechatWork': function () {
                return ua.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
            },
            'Taobao': function () {
                return ua.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
            },
            'Alipay': function () {
                return ua.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
            },
            'Weibo': function () {
                return ua.replace(/^.*weibo__([\d.]+).*$/, '$1');
            },
            'iQiYi': function () {
                return ua.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
            }
        };
        if (browserVersionMap[browser]) {
            browserVersion = browserVersionMap[browser]();
            if (browserVersion == ua) {
                browserVersion = '';
            }
        }
        return {
            browser: browser,
            browser_version: browserVersion
        };
    }

    getOsInfo(): {client_os: string, client_os_version: string} {
        const ua = this.ua;
        const os: string = this.getMatchKey('os');
        let osVersion = '';
        const osVersionMap: VersionMap = {
            'Windows': function () {
                const v = ua.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
                const oldWindowsVersionMap: {[key: string]: string} = {
                    '6.4': '10',
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.2': 'XP',
                    '5.1': 'XP',
                    '5.0': '2000'
                };
                return oldWindowsVersionMap[v] || v;
            },
            'Android': function () {
                return ua.replace(/^.*Android ([\d.]+);.*$/, '$1');
            },
            'iOS': function () {
                return ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
            },
            'Debian': function () {
                return ua.replace(/^.*Debian\/([\d.]+).*$/, '$1');
            },
            'Windows Phone': function () {
                return ua.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
            },
            'Mac OS': function () {
                return ua.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
            },
            'WebOS': function () {
                return ua.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
            }
        };
        if (osVersionMap[os]) {
            osVersion = osVersionMap[os]();
            if (osVersion == ua) {
                osVersion = '';
            }
        }
        return {
            client_os: os,
            client_os_version: osVersion
        };
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Client();
        }
        return this.instance;
    }
}

export default Client.getInstance();