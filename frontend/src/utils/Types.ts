export interface ClientInterface {
    _id: string,
    company: string,
    username: string,
    password: string,
    clientFile?: string | File,
    fileSizeInKB: number,
    fileUpdatedOn: Date,
    pdfTemplates?: string[],
    createdAt: Date,
    updatedAt: Date
}

declare global {
    interface Window {
        create_user: HTMLDialogElement,
        add_filter: HTMLDialogElement,
        upload_file: HTMLDialogElement,
        timeline: HTMLDialogElement,
    }
}

export interface ClientProps {
    client: ClientInterface
}

export interface filter {
    label: string;
    options: string[];
}