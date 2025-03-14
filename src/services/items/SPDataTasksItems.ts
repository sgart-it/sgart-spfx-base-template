import { SPDataBase } from "../SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { TaskItem } from "../../dto/TaskItem";
import { SPFI } from "@pnp/sp";
import { GraphFI } from "@pnp/graph";

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

const LOG_SOURCE: string = 'SPDataTasksItems';

const FIELDS = ["Id", "Title", "ProjectName", "Completed", "Modified"];

export class SPDataTasksItems extends SPDataBase {

    private _listName: string;

    constructor(sp: SPFI, graph: GraphFI, listName: string) {
        super(sp, graph);

        this._listName = listName;
    }

    /**
     * Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
     * questo metodo restituisce solo 100 item
     * @param text stringa con cui filtrare i risultati
     * @returns 
     */
    public async gets(text: string): Promise<TaskItem[]> {
        const listName = this._listName;
        console.log(`${LOG_SOURCE} - gets() - from list '${listName}'`);
        try {
            if (stringIsNullOrEmpty(listName)) {
                throw new Error("Listname is null");
            }

            // prepare filter
            const dataFilter = this._sp.web.lists.getByTitle(listName)
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
        } catch (e) {
            console.error(LOG_SOURCE + " - getItems() - error: ", e);
        }
        return [];
    }


    /**
     * Metodo per recuperare un singolo item 
     * @param id id dell'item
     * @returns 
     */
    public async get(id: number): Promise<TaskItem> {
        const listName = this._listName;
        const spItem = await this._sp.web.lists.getByTitle(listName)
            .items
            .select(...FIELDS)
            .getById(id)
            ();

        return mapToTaskItem(spItem);
    }

    /**
     * Metodo per aggiornare un item
     * @param item 
     */
    public async update(item: TaskItem): Promise<void> {
        const listName = this._listName;
        const data = mapFromTaskItem(item);
        await this._sp.web.lists.getByTitle(listName)
            .items
            .getById(item.id)
            .update(data);
    }

    /**
     * Metodo per aggiungere un item 
     * @param item 
     * @returns 
     */
    public async add(item: TaskItem): Promise<TaskItem> {
        const listName = this._listName;
        const data = mapFromTaskItem(item);
        const newSpitem = await this._sp.web.lists.getByTitle(listName).items.add(data);

        return mapToTaskItem(newSpitem);
    }

    /**
     * Metodo per cancellare un item 
     * @param listName 
     * @param itemId 
     */
    public async delete(itemId: number): Promise<void> {
        const listName = this._listName;
        console.log(LOG_SOURCE + " - deleteItem() - from list '" + listName + "' - ID: '" + itemId + "' ");
        try {
            await this._sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
            console.log(LOG_SOURCE + " - deleteItem() - item deleted.");
        } catch (e) {
            console.error(LOG_SOURCE + " - deleteItem() - item deleted with error.", e);
        }
    }


}