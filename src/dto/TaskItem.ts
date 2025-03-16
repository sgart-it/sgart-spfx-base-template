export type TaskItem =  {
    key?: string;
    id: number;
    title: string;
    projectName: string;
    isCompleted: boolean;
    modified?: Date;
    modifiedStr?: string; /* stringa solo per PNP ListView gestisce male gli oggetti date */
}