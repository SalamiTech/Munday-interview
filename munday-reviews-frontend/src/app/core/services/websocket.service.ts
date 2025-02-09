import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: Socket;

    constructor() {
        this.socket = io(environment.wsUrl, {
            transports: ['websocket'],
            autoConnect: true,
            auth: {
                token: localStorage.getItem('token')
            }
        });

        this.socket.on('connect', () => {
            console.log('WebSocket Connected');
        });

        this.socket.on('connect_error', (error: Error) => {
            console.error('WebSocket Connection Error:', error);
        });

        this.socket.on('disconnect', (reason: string) => {
            console.log('WebSocket Disconnected:', reason);
        });
    }

    // Emit an event to the server
    emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    // Listen for events from the server
    on<T>(event: string): Observable<T> {
        return new Observable((subscriber) => {
            this.socket.on(event, (data: T) => {
                subscriber.next(data);
            });

            // Cleanup on unsubscribe
            return () => {
                this.socket.off(event);
            };
        });
    }

    // Disconnect the socket
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    // Reconnect the socket
    reconnect(): void {
        if (this.socket) {
            this.socket.connect();
        }
    }

    // Check if socket is connected
    isConnected(): boolean {
        return this.socket?.connected || false;
    }
} 