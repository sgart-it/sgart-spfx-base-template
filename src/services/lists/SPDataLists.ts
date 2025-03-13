import { SPDataBase } from "../SPDataBase";
import { IList } from "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

export class SPDataLists extends SPDataBase {
    //Metodo per leggere tutte le liste e libraries di un sito
    public async getLists(): Promise<IList[]> {
        return await this._sp.web.lists();
    }
}