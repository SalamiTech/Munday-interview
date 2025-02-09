import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable, Subject, fromEvent } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket!: Socket;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 5000;
    private connectionStatus = new Subject<boolean>();

    constructor(private toastService: ToastService) {
        this.initializeSocket();
    }

    private initializeSocket(): void {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(environment.wsUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            timeout: 10000,
            autoConnect: true
        });

        this.setupConnectionHandlers();
    }

    private setupConnectionHandlers(): void {
        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.connectionStatus.next(true);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.connectionStatus.next(false);
            
            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                this.socket.connect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.reconnectAttempts++;
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                this.toastService.error('Unable to connect to server. Please refresh the page.');
            }
        });

        this.socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error);
            this.toastService.error(error.message || 'An error occurred');
        });
    }

    getConnectionStatus(): Observable<boolean> {
        return this.connectionStatus.asObservable();
    }

    on<T>(event: string): Observable<T> {
        return new Observable(observer => {
            if (!this.socket) {
                this.initializeSocket();
            }

            this.socket.on(event, (data: T) => {
                observer.next(data);
            });

            return () => {
                this.socket.off(event);
            };
        });
    }

    emit(event: string, data?: any): void {
        if (!this.socket) {
            this.initializeSocket();
        }

        if (this.socket.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Attempting to reconnect...');
            this.socket.connect();
            
            // Retry emission after connection
            this.socket.once('connect', () => {
                this.socket.emit(event, data);
            });
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.removeAllListeners();
            this.connectionStatus.next(false);
        }
    }

    reconnect(): void {
        this.initializeSocket();
    }
} 