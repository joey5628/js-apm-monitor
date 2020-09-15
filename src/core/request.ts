
class Request {

    static instance: Request | null;

    post(url: string, data: unknown): Promise<any> {
        if (!window.fetch) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = (): void => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
    
                    if (xhr.status === 200) {
                        resolve(xhr);
                    }
    
                    reject(xhr);
                };
    
                xhr.open('POST', url);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            });
        } else {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                mode: 'cors'
            });
        }
    }

    // sendBeacon(url: string, data: []): void {
        
    // }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Request();
        }
        return this.instance;
    }
}

export default Request.getInstance();