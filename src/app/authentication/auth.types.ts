export interface Login {
    document_id: string,
    password: string
}

export interface User {
    first_name: string,
    last_name: string,
    document_id: string,
    department_id: string,
    role_id: string,
    password: string,
}