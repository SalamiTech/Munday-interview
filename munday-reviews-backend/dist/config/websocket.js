"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const socket_io_1 = require("socket.io");
function setupWebSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('joinOrganization', (organizationId) => {
            socket.join(`org-${organizationId}`);
            console.log(`Socket ${socket.id} joined org-${organizationId}`);
        });
        socket.on('leaveOrganization', (organizationId) => {
            socket.leave(`org-${organizationId}`);
            console.log(`Socket ${socket.id} left org-${organizationId}`);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
    return io;
}
