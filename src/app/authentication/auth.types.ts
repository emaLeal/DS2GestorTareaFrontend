export interface Login {
    document_id: string,
    password: string
}

export interface User {
    name: string,
    last_name: string,
    document_id: string,
    identification_type: string,
    email: string,
    password: string
}