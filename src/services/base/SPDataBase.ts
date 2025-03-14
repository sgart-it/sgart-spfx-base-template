import { ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { AadHttpClientFactory, AadTokenProviderFactory, HttpClient } from "@microsoft/sp-http";
import { IList } from "@pnp/sp/lists";
import { stringIsNullOrEmpty } from "@pnp/core";

const LOG_SOURCE: string = 'SPDataBase';
/*
Classe base per iniziallizzare PnP/PnPjs
*/
export class SPDataBase {
    
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
            console.log(LOG_SOURCE + " - getSP() : ", this._sp);
        }
        return this._sp;
    }

    protected getGraph(): GraphFI {
        if (this._graph !== undefined) {
            const aadTokenProviderFactory = this._serviceScope.consume(AadTokenProviderFactory.serviceKey);
            this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
            console.log(LOG_SOURCE + " - getGraph(): ", this._graph);
        }

        return this._graph;
    }

    protected getHttpClient(): HttpClient {
        if (this._httpClient === undefined) {
            this._httpClient = this._serviceScope.consume(HttpClient.serviceKey);
            console.log(LOG_SOURCE + " - getHttpClient(): ", this._httpClient);
        }
        return this._httpClient;
    }

    protected getAadHttpClientFactory(): AadHttpClientFactory {
        if (this._aadHttpClientFactory === undefined) {
            this._aadHttpClientFactory = this._serviceScope.consume(AadHttpClientFactory.serviceKey);
            console.log(LOG_SOURCE + " - getAadHttpClientFactory(): ", this._aadHttpClientFactory);
        }
        return this._aadHttpClientFactory;
    }

    /* FUNZIONI PER SHAREPOINT */
 
    protected getListByTitle(listName: string): IList {
        if (stringIsNullOrEmpty(listName))
            throw new Error("Listname is null");

        return this.getSP().web.lists.getByTitle(listName);
    }
}