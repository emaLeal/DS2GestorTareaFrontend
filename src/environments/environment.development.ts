export const environment = {
    production: false,
    baseUrl: 'http://localhost:8000/api/',
    authentication: {
        login: 'auth/login/',
        register: 'auth/register/',
        refresh: 'auth/refresh/',
        profile: 'auth/get_profile/',
        resetPassword: 'auth/password_reset/',
        confirmResetPassword: 'auth/password_reset/confirm/?token=',
        changePassword: 'auth/change_password/'
    }

};
