import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Review } from '../models';
import { Op } from 'sequelize';

interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: number]: number;
    };
}

async function getReviewStats(organizationId?: string): Promise<ReviewStats> {
    const where = organizationId ? { organizationId } : {};
    
    const stats = await Review.findOne({
        where,
        attributes: [
            [Review.sequelize!.fn('COUNT', Review.sequelize!.col('id')), 'totalReviews'],
            [Review.sequelize!.fn('AVG', Review.sequelize!.col('rating')), 'averageRating'],
            [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 1 THEN 1 END')), 'rating1'],
            [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 2 THEN 1 END')), 'rating2'],
            [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 3 THEN 1 END')), 'rating3'],
            [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 4 THEN 1 END')), 'rating4'],
            [Review.sequelize!.fn('COUNT', Review.sequelize!.literal('CASE WHEN rating = 5 THEN 1 END')), 'rating5']
        ],
        raw: true
    });

    const result = stats as any;
    return {
        totalReviews: Number(result?.totalReviews || 0),
        averageRating: Number(result?.averageRating || 0),
        ratingDistribution: {
            1: Number(result?.rating1 || 0),
            2: Number(result?.rating2 || 0),
            3: Number(result?.rating3 || 0),
            4: Number(result?.rating4 || 0),
            5: Number(result?.rating5 || 0)
        }
    };
}

async function getRecentReviews(organizationId?: string, limit = 5) {
    const where = organizationId ? { organizationId } : {};
    return Review.findAll({
        where: {
            ...where,
            status: 'approved'
        },
        include: ['user', 'organization'],
        order: [['createdAt', 'DESC']],
        limit
    });
}

export function setupWebSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling']
    });

    io.on('connection', async (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Client disconnected:', socket.id, 'Reason:', reason);
        });

        // Send initial stats to newly connected client
        try {
            const globalStats = await getReviewStats();
            socket.emit('statsUpdate', globalStats);
        } catch (error) {
            console.error('Error sending initial stats:', error);
            socket.emit('error', { message: 'Failed to load initial stats' });
        }

        // Join organization room
        socket.on('joinOrganization', async (organizationId: string) => {
            try {
                socket.join(`org-${organizationId}`);
                console.log(`Socket ${socket.id} joined org-${organizationId}`);

                // Send organization-specific stats
                const [orgStats, recentReviews] = await Promise.all([
                    getReviewStats(organizationId),
                    getRecentReviews(organizationId)
                ]);
                
                socket.emit('orgStatsUpdate', {
                    organizationId,
                    stats: orgStats,
                    recentReviews
                });
            } catch (error) {
                console.error('Error joining organization:', error);
                socket.emit('error', { message: 'Failed to join organization' });
            }
        });

        // Leave organization room
        socket.on('leaveOrganization', (organizationId: string) => {
            try {
                socket.leave(`org-${organizationId}`);
                console.log(`Socket ${socket.id} left org-${organizationId}`);
            } catch (error) {
                console.error('Error leaving organization:', error);
            }
        });

        // Handle review events with error handling
        socket.on('reviewCreated', async (review) => {
            try {
                const { organizationId } = review;
                
                const [globalStats, orgStats] = await Promise.all([
                    getReviewStats(),
                    getReviewStats(organizationId)
                ]);

                io.emit('statsUpdate', globalStats);
                io.to(`org-${organizationId}`).emit('orgStatsUpdate', {
                    organizationId,
                    stats: orgStats
                });
                io.to(`org-${organizationId}`).emit('newReview', review);
            } catch (error) {
                console.error('Error handling review creation:', error);
                socket.emit('error', { message: 'Failed to process review creation' });
            }
        });

        socket.on('reviewUpdated', async (review) => {
            try {
                const { organizationId } = review;
                
                const [globalStats, orgStats] = await Promise.all([
                    getReviewStats(),
                    getReviewStats(organizationId)
                ]);

                io.emit('statsUpdate', globalStats);
                io.to(`org-${organizationId}`).emit('orgStatsUpdate', {
                    organizationId,
                    stats: orgStats
                });
                io.to(`org-${organizationId}`).emit('reviewUpdated', review);
            } catch (error) {
                console.error('Error handling review update:', error);
                socket.emit('error', { message: 'Failed to process review update' });
            }
        });

        socket.on('reviewDeleted', async ({ reviewId, organizationId }) => {
            try {
                const [globalStats, orgStats] = await Promise.all([
                    getReviewStats(),
                    getReviewStats(organizationId)
                ]);

                io.emit('statsUpdate', globalStats);
                io.to(`org-${organizationId}`).emit('orgStatsUpdate', {
                    organizationId,
                    stats: orgStats
                });
                io.to(`org-${organizationId}`).emit('reviewDeleted', reviewId);
            } catch (error) {
                console.error('Error handling review deletion:', error);
                socket.emit('error', { message: 'Failed to process review deletion' });
            }
        });
    });

    return io;
} 