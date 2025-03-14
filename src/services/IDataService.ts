import { SPDataItems } from "./items/SPDataItems";
import { SPDataTasksItems } from "./items/SPDataTasksItems";
import { SPDataFiles } from "./lists/SPDataFiles";
import { SPDataLists } from "./lists/SPDataLists";

//Interfaccia utilizzata per le classi che lavorano con i dati
export interface IDataService {
    lists: SPDataLists; //proprietà che definisce una nuova classe con i metodi per lavorare con le liste
    items: SPDataItems; //proprietà che definisce una nuova classe con i metodi per lavorare con i list item
    files: SPDataFiles; //proprietà che definisce una nuova classe con i metodi per lavorare con i file

    setTaskListName(listName: string): void;
    tasks: SPDataTasksItems;
}