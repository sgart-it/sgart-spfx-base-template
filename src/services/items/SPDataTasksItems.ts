import { ServiceScope } from "@microsoft/sp-core-library";
import { SPDataBase } from "../base/SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { TaskItem } from "../../dto/TaskItem";
import { SOLUTION_NAME } from "../../constants";

const LOG_SOURCE: string = SOLUTION_NAME + ':SPDataTasksItems:';

const FIELDS = ["Id", "Title", "ProjectName", "Completed", "Modified"];

const mapFromTaskItem = (item: TaskItem): Record<string, unknown> => ({
    Title: item.title,
    ProjectName: item.projectName,
    Completed: item.isCompleted ?? false
});

const mapToTaskItem = (data: unknown): TaskItem => {
    const { Id, Title, ProjectName, Completed, Modified } = data as { Id: number; Title: string; ProjectName: string, Completed?: boolean, Modified?: string | null };

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



export class SPDataTasksItems extends SPDataBase {

    constructor(serviceScope: ServiceScope, private listName: string) {
        super(serviceScope);

        console.debug(`${LOG_SOURCE}constructor listName '${this.listName}'`);
    }

    /**
     * Metodo per recuperare tutti gli item di una lista filtrati per testo
     * questo metodo restituisce solo 5000 item
     * @param text stringa con cui filtrare i risultati
     * @returns 
     */
    public async gets(text: string): Promise<TaskItem[]> {
        console.debug(`${LOG_SOURCE} gets filter '${text}'`);

        // prepare filter
        const dataFilter = this.getSPListByTitle(this.listName)
            .items
            .top(5000)
            //.filter(`startswith(Title,'${text ?? ''}')`)
            .select(...FIELDS)
            //select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
            //.expand("FieldValuesAsText")
            .orderBy("Id", true);
        if (stringIsNullOrEmpty(text) === false) {
            //dataFilter.filter(f => f.text("Title").startsWith(text ?? ''));
            // funziona solo con liste con meno di 5000 items
            dataFilter.filter(f => f.text("Title").contains(text ?? ''));
        }

        // execute query
        const data = await dataFilter();

        // map to DTO
        const items = data.map<TaskItem>(spItem => mapToTaskItem(spItem));

        console.debug(`${LOG_SOURCE}`, items);

        return items;
    }


    /**
     * Metodo per recuperare un singolo item 
     * @param id id dell'item
     * @returns 
     */
    public async get(id: number): Promise<TaskItem> {
        console.debug(`${LOG_SOURCE} get ${id}`);

        const spItem = await this.getSPListByTitle(this.listName)
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
        console.debug(`${LOG_SOURCE} add ${item.title}`);

        const data = mapFromTaskItem(item);
        const newSpitem = await this.getSPListByTitle(this.listName)
            .items
            .add(data);

        return mapToTaskItem(newSpitem);
    }

    /**
     * Metodo per aggiornare un item
     * @param item 
     */
    public async update(item: TaskItem): Promise<void> {
        console.debug(`${LOG_SOURCE} update ${item.id}`);

        const data = mapFromTaskItem(item);
        await this.getSPListByTitle(this.listName)
            .items
            .getById(item.id)
            .update(data);
    }

    /**
     * Metodo per cancellare un item 
     * @param id 
     */
    public async delete(id: number): Promise<void> {
        console.debug(`${LOG_SOURCE} delete ${id}`);

        await this.getSPListByTitle(this.listName)
            .items
            .getById(id)
            .delete();
    }

}