export class TimeRecord {
    id: number;
    activityNumber?: number;
    usedTime?: number;
    comments: string;
    dateRecord?: Date;

    constructor() {
        this.id = 0;
        this.activityNumber = null;
        this.usedTime = null;
        this.comments = null;
        this.dateRecord = null;
    }
}
