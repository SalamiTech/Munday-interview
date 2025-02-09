export const environment = {
    production: true,
    apiUrl: '/api',
    wsUrl: window.location.origin.replace(/^http/, 'ws'),
    auth: {
        tokenKey: 'auth_token',
        refreshTokenKey: 'refresh_token'
    }
}; 