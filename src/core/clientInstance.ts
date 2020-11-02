import Client from './client';

let clientInstance: Client | null = null;
export default function getClientInstance(ua?: string): Client {
    if (!clientInstance) {
        clientInstance = new Client(ua);
    }
    return clientInstance;
}
