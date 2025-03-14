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
        console.log(`${LOG_SOURCE}: listName '${this._listName}'`);
    }

    private getListName(): string {
        if (stringIsNullOrEmpty(this._listName))
            throw new Error("Listname is null");

        return this._listName;
    }

    /**
     * Metodo per recuperare tutti gli item di una lista filtrati per testo
     * questo metodo restituisce solo 5000 item
     * @param text stringa con cui filtrare i risultati
     * @returns 
     */
    public async gets(text: string): Promise<TaskItem[]> {
        console.log(`${LOG_SOURCE}: gets filter  with'${text}'`);
        const listName = this.getListName();

        // prepare filter
        const dataFilter = this._sp.web.lists.getByTitle(listName)
            .items
            .top(5000)
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
     * @param id id dell'item
     * @returns 
     */
    public async get(id: number): Promise<TaskItem> {
        console.log(`${LOG_SOURCE}: get ${id}`);
        const listName = this.getListName();

        const spItem = await this._sp.web.lists.getByTitle(listName)
            .items
            .select(...FIELDS)
            .getById(id)
            ();

        return mapToTaskItem(spItem);
    }

    /**
     * Metodo per aggiungere un item 
     * @param item 
     * @returns 
     */
    public async add(item: TaskItem): Promise<TaskItem> {
        console.log(`${LOG_SOURCE}: add ${item.title}`);

        const listName = this.getListName();
        const data = mapFromTaskItem(item);
        const newSpitem = await this._sp.web.lists.getByTitle(listName).items.add(data);

        return mapToTaskItem(newSpitem);
    }

    /**
     * Metodo per aggiornare un item
     * @param item 
     */
    public async update(item: TaskItem): Promise<void> {
        console.log(`${LOG_SOURCE}: update ${item.id}`);

        const listName = this.getListName();
        const data = mapFromTaskItem(item);
        await this._sp.web.lists.getByTitle(listName)
            .items
            .getById(item.id)
            .update(data);
    }

    /**
     * Metodo per cancellare un item 
     * @param id 
     */
    public async delete(id: number): Promise<void> {
        console.log(`${LOG_SOURCE}: delete ${id}`);

        const listName = this.getListName();
        await this._sp.web.lists.getByTitle(listName).items.getById(id).delete();
    }

}