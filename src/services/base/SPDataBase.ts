import { ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { AadHttpClientFactory, AadTokenProviderFactory, HttpClient } from "@microsoft/sp-http";
import { IList } from "@pnp/sp/lists";
import { objectDefinedNotNull, stringIsNullOrEmpty } from "@pnp/core";
import { LOG_SOURCE_BASE } from "../../constants";

const LOG_SOURCE: string = LOG_SOURCE_BASE + ':SPDataBase:';
/*
Classe base per iniziallizzare PnP/PnPjs
*/
export abstract class SPDataBase {
    
    private _serviceScope: ServiceScope
    private _sp: SPFI;
    private _graph: GraphFI;
    private _httpClient: HttpClient;
    private _aadHttpClientFactory: AadHttpClientFactory;

    constructor(serviceScope: ServiceScope) {
        this._serviceScope = serviceScope;
    }

    protected getSP(): SPFI {
        if (this._sp === undefined) {
            const pageContext = this._serviceScope.consume(PageContext.serviceKey);
            this._sp = spfi().using(spSPFx({ pageContext }));
            console.debug(`${LOG_SOURCE} getSP() ${objectDefinedNotNull(this._sp)}`);
        }
        return this._sp;
    }

    protected getGraph(): GraphFI {
        if (this._graph !== undefined) {
            const aadTokenProviderFactory = this._serviceScope.consume(AadTokenProviderFactory.serviceKey);
            this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
            console.debug(`${LOG_SOURCE} getGraph() ${objectDefinedNotNull(this._graph)}`);
        }

        return this._graph;
    }

    protected getHttpClient(): HttpClient {
        if (this._httpClient === undefined) {
            this._httpClient = this._serviceScope.consume(HttpClient.serviceKey);
            console.debug(`${LOG_SOURCE} getHttpClient() ${objectDefinedNotNull(this._httpClient)}`);
        }
        return this._httpClient;
    }

    protected getAadHttpClientFactory(): AadHttpClientFactory {
        if (this._aadHttpClientFactory === undefined) {
            this._aadHttpClientFactory = this._serviceScope.consume(AadHttpClientFactory.serviceKey);
            console.debug(`${LOG_SOURCE} getAadHttpClientFactory() ${objectDefinedNotNull(this._aadHttpClientFactory)}`);
        }
        return this._aadHttpClientFactory;
    }

    /* FUNZIONI PER SHAREPOINT */
 
    protected getListByTitle(listName: string): IList {
        if (stringIsNullOrEmpty(listName))
            throw new Error("Listname is null");

        return this.getSP().web.lists.getByTitle(listName);
    }

    protected getListById(listId: string): IList {
        if (stringIsNullOrEmpty(listId))
            throw new Error("ListId is null");

        return this.getSP().web.lists.getById(listId);
    }
}