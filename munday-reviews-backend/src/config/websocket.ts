import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
export function setupWebSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on('joinOrganization', (organizationId: string) => {
            socket.join(`org-${organizationId}`);
            console.log(`Socket ${socket.id} joined org-${organizationId}`);
        });

        socket.on('leaveOrganization', (organizationId: string) => {
            socket.leave(`org-${organizationId}`);
            console.log(`Socket ${socket.id} left org-${organizationId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
} 