export type TaskItem =  {
    key?: string;
    id: number;
    title: string;
    projectName: string;
    isCompleted: boolean;
    modified?: Date;
    modifiedStr?: string; /* stringa perche ListView n0n funziona con le date */
}