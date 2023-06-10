export interface CustomNotification {
    id: number;
    title: string,
    sticky: boolean
    body?: string,
    type: number
}

export class CustomNotification {
    public id: number;
    public title: string;
    public sticky: boolean;
    public body?: string;
    public type: number

    constructor(title: string, sticky: boolean, type: number, body?: any) {
        this.title = title;
        this.sticky = sticky;
        this.body = body;
        this.type = type;
        this.id = new Date().getTime();
    }
}
