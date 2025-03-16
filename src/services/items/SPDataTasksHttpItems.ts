import { ServiceScope } from "@microsoft/sp-core-library";
import { SPDataBase } from "../base/SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { TaskItem } from "../../dto/TaskItem";
import { SOLUTION_NAME } from "../../constants";
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

const LOG_SOURCE: string = SOLUTION_NAME + ':SPDataTasksHttpItems:';

const FIELDS = 'Id,Title,ProjectName,Completed,Modified';

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


export class SPDataTasksHttpItems extends SPDataBase {

    constructor(serviceScope: ServiceScope, private listName: string) {
        super(serviceScope);

        console.debug(`${LOG_SOURCE}constructor listName '${this.listName}'`);
    }

    private getItemsUrl = (): string => `${this.geTWebAbsoluteUrl()}/_api/lists/getByTitle('${this.listName}')/items`;

    private async executeQueryGetItems<T>(queryUrl: string): Promise<T> {
        const url = this.getItemsUrl() + queryUrl;
        try {
            const response: SPHttpClientResponse = await this.getSPHttpClient().get(url, SPHttpClient.configurations.v1);
            const data = await response.json();
            return data.value as T
        } catch (err) {
            console.error(`${LOG_SOURCE}executeQueryGet ${url}`, err);
            throw err
        }
    }

    private async executeQueryAdd(data: unknown): Promise<unknown> {
        const url = this.getItemsUrl();
        try {
            const opt: ISPHttpClientOptions = {
                body: JSON.stringify(data)
            };
            const response: SPHttpClientResponse = await this.getSPHttpClient().post(url, SPHttpClient.configurations.v1, opt);
            if (response.status !== 201) {
                throw new Error('Errore durante la creazione dell\'item');
            }
            const dataNew = await response.json();

            return dataNew;

        } catch (err) {
            console.error(`${LOG_SOURCE}executeQueryAdd ${url}`, err);
            throw err
        }
    }

    private async executeQueryUpdate(id: number, data: unknown): Promise<void> {
        const url = this.getItemsUrl()+ `(${id})`;
        try {
            const opt: ISPHttpClientOptions = {
                headers: {
                    'X-HTTP-Method': 'MERGE',
                    'IF-MATCH': '*'
                },
                body: JSON.stringify(data)
            };
            const response: SPHttpClientResponse = await this.getSPHttpClient().post(url, SPHttpClient.configurations.v1, opt);
            if (response.status !== 204) {
                throw new Error('Errore durante l\'aggiornameto dell\'item');
            }

        } catch (err) {
            console.error(`${LOG_SOURCE}executeQueryUpdate ${url}`, err);
            throw err
        }
    }

    private async executeQueryDelete(id: number): Promise<void> {
        const url = this.getItemsUrl()+ `(${id})`;
        try {
            const opt: ISPHttpClientOptions = {
                headers: {
                    'X-HTTP-Method': 'DELETE',
                    'IF-MATCH': '*'
                }
            };
            const response: SPHttpClientResponse = await this.getSPHttpClient().post(url, SPHttpClient.configurations.v1, opt);
            if (response.status !== 204) {
                throw new Error('Errore durante la cancellazione dell\'item');
            }

        } catch (err) {
            console.error(`${LOG_SOURCE}executeQueryDelete ${url}`, err);
            throw err
        }
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
        const queryUrl = '?$top=5000'
            + `&$select=${FIELDS}`
            + (stringIsNullOrEmpty(text) ? '' : `&$filter=contains(Title, '${text}')`) // funziona solo con liste con meno di 5000 items
            + '&$orderby=Id asc';

        // execute query
        const data = await this.executeQueryGetItems<TaskItem[]>(queryUrl);

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

        // prepare filter
        const queryUrl = `(${id})?&$select=${FIELDS}`;

        // execute query
        const spItem = await this.executeQueryGetItems<TaskItem>(queryUrl);

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

        const newSpitem = await this.executeQueryAdd(data);

        return mapToTaskItem(newSpitem);
    }

    /**
     * Metodo per aggiornare un item
     * @param item 
     */
    public async update(item: TaskItem): Promise<void> {
        console.debug(`${LOG_SOURCE} update ${item.id}`);

        const data = mapFromTaskItem(item);

        await this.executeQueryUpdate(item.id, data);
    }

    /**
     * Metodo per cancellare un item 
     * @param id 
     */
    public async delete(id: number): Promise<void> {
        console.debug(`${LOG_SOURCE} delete ${id}`);

        await this.executeQueryDelete(id);
    }

}