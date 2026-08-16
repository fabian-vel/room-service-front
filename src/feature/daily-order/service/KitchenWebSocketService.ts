import type {OrderEvent} from "@/types/OrderEvent.ts";

export class KitchenWebSocketService {
    private socket?: WebSocket;

    connect(onMessage: (event: OrderEvent) => void) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No hay token disponible para WebSocket');
            return;
        }

        const url = `ws://192.168.18.9:8083/ws/pedidos?token=${token}`;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket conectado');
        };

        this.socket.onmessage = (message) => {
            const event: OrderEvent = JSON.parse(message.data);
            onMessage(event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket desconectado:', event.code, event.reason);
        };
    }

    disconnect() {
        this.socket?.close();
    }
}

export const kitchenWebSocketService = new KitchenWebSocketService();
