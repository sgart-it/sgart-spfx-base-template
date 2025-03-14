import { SPDataBase } from "../base/SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { TaskItem } from "../../dto/TaskItem";

const mapFromTaskItem = (item: TaskItem): Record<string, unknown> => ({
    Title: item.title,
    ProjectName: item.projectName,
    Completed: item.isCompleted ?? false
});

const mapToTaskItem = (data: unknown): TaskItem => {
    const { Id, Title, ProjectName, Completed, Modified } = data as { Id: number; Title: string; ProjectName: string, Completed?: boolean, Modified?: string | null };

    const v = stringIsNullOrEmpty(Modified)
        ? undefined // mi assicuro di ritornare undefined e non null
        : new Date(Modified);
    console.log("v", v);

    return {
        key: Id.toString(),
        id: Id,
        title: Title,
        projectName: ProjectName,
        isCompleted: Completed ?? false,
        modified: stringIsNullOrEmpty(Modified)
            ? undefined // mi assicuro di ritornare undefined e non null
            : new Date(Modified),
        modifiedStr: stringIsNullOrEmpty(Modified)
            ? undefined
            : Modified
    };
};

const LOG_SOURCE: string = 'SPDataItems';

const FIELDS = ["Id", "Title", "ProjectName", "Completed", "Modified"];

export class SPDataItems extends SPDataBase {
    /**
     * Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
     * questo metodo restituisce solo 100 item
     * @param listName 
     * @returns 
     */
    public async getItems(listName: string, text: string): Promise<TaskItem[]> {
        console.log(`${LOG_SOURCE} - getItems() - from list '${listName}'`);

        // prepare filter
        const dataFilter = this.getListByTitle(listName)
            .items
            .top(100)
            //.filter(`startswith(Title,'${text ?? ''}')`)
            .select(...FIELDS)
            //select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
            //.expand("FieldValuesAsText")
            .orderBy("Id");
        if (stringIsNullOrEmpty(text) === false) {
            //dataFilter.filter(f => f.text("Title").startsWith(text ?? ''));
            // funziona solo con liste con meno di 5000 items
            dataFilter.filter(f => f.text("Title").contains(text ?? ''));
        }

        // execute query
        const data = await dataFilter();

        // map to DTO
        const items = data.map<TaskItem>(spItem => mapToTaskItem(spItem));
        console.log("Items", items);

        return items;
    }


    /**
     * Metodo per recuperare un singolo item 
     * @param listName Nome lista
     * @param itemId id dell'item
     * @returns 
     */
    public async getItem(listName: string, itemId: number): Promise<TaskItem> {
        const spItem = await this.getListByTitle(listName)
            .items
            .select(...FIELDS)
            .getById(itemId)
            ();

        return mapToTaskItem(spItem);
    }

    /**
     * Metodo per aggiornare un item
     * @param listName 
     * @param item 
     */
    public async updateItem(listName: string, item: TaskItem): Promise<void> {
        const data = mapFromTaskItem(item);

        await this.getListByTitle(listName)
            .items
            .getById(item.id)
            .update(data);
    }

    /**
     * Metodo per aggiungere un item 
     * @param listName 
     * @param item 
     * @returns 
     */
    public async addItem(listName: string, item: TaskItem): Promise<TaskItem> {
        const data = mapFromTaskItem(item);

        const newSpitem = await this.getListByTitle(listName)
            .items
            .add(data);

        return mapToTaskItem(newSpitem);
    }

    /**
     * Metodo per cancellare un item 
     * @param listName 
     * @param itemId 
     */
    public async deleteItem(listName: string, itemId: number): Promise<void> {

        await this.getListByTitle(listName)
            .items
            .getById(itemId)
            .delete();
    }
}