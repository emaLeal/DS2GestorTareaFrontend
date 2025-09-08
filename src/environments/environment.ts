export const environment = {
    production: true,
    baseUrl: 'http://localhost:8000/api/',
    authentication: {
        login: 'auth/login/',
        register: 'auth/register/',
        refresh: 'auth/refresh/',
        profile: 'auth/get_profile/',
        resetPassword: 'auth/password_reset/',
        confirmResetPassword: 'auth/password_reset/confirm/?token=',
        changePassword: 'auth/change_password/'
    },
    taskFlow: {
        createTask: 'task/create/',
        listTasks: 'task/get-task-user/',
        updateTask: 'task/patch/',
        deleteTask: 'task/delete/'
    },
    tasks: {
        getAllTasks: 'task/getall/'
    }
};
