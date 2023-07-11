export interface ClientData {
    company: string;
    username: string;
    password: string;
    clientFile: File | null;
    templateFiles?: File[];
}