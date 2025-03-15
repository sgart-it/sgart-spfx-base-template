import { SPDataBase } from "../base/SPDataBase";
import { stringIsNullOrEmpty } from "@pnp/core";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItem } from "@pnp/sp/items";
import { SOLUTION_NAME } from "../../constants";

const LOG_SOURCE: string = SOLUTION_NAME + ':SPDataItems:';

export class SPDataItems extends SPDataBase {
    /**
     * Metodo per recuperare tutti gli item di una lista TODO verificare con lista di grandi dimensioni
     * questo metodo restituisce solo 100 item
     * @param listName 
     * @param text 
     * @param top numero di item da recuperare (max 5000) 
     * @returns 
     */
    public async getItems(listName: string, text: string, top: number = 5000): Promise<IItem[]> {
        console.debug(`${LOG_SOURCE} getItems() '${listName}'`);

        // prepare filter
        const dataFilter = this.getListByTitle(listName)
            .items
            .top(top)
            //.filter(`startswith(Title,'${text ?? ''}')`)
            //.select(...FIELDS)
            //select("Title", "FileRef", "FieldValuesAsText/MetaInfo")
            //.expand("FieldValuesAsText")
            .orderBy("Id", true);
        if (stringIsNullOrEmpty(text) === false) {
            //dataFilter.filter(f => f.text("Title").startsWith(text ?? ''));
            // funziona solo con liste con meno di 5000 items
            dataFilter.filter(f => f.text("Title").contains(text ?? ''));
        }

        // execute query
        const items = await dataFilter();

        console.debug(`${LOG_SOURCE}`, items);

        return items;
    }


    /**
     * Metodo per recuperare un singolo item 
     * @param listName displayName della lista
     * @param itemId id dell'item
     * @returns 
     */
    public async getItem(listName: string, itemId: number): Promise<IItem> {
        return await this.getListByTitle(listName)
            .items
            .select()
            .getById(itemId)
            ();
    }

    /**
     * Metodo per aggiornare un item
     * @param listName displayName della lista
     * @param id id dell'item
     * @param data serie di dati nomeCampo/valore
     */
    public async updateItem(listName: string, id: number, data: Record<string, unknown>): Promise<void> {
        await this.getListByTitle(listName)
            .items
            .getById(id)
            .update(data);
    }

    /**
     * Metodo per aggiungere un item 
     * @param listName displayName della lista
     * @param data serie di dati nomeCampo/valore
     * @returns 
     */
    public async addItem(listName: string, data: Record<string, unknown>): Promise<IItem> {
        return await this.getListByTitle(listName)
            .items
            .add(data);
    }

    /**
     * Metodo per cancellare un item 
     * @param listName displayName della lista
     * @param id id dell'item
     */
    public async deleteItem(listName: string, id: number): Promise<void> {
        await this.getListByTitle(listName)
            .items
            .getById(id)
            .delete();
    }
}