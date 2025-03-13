import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadHttpClientFactory, AadTokenProviderFactory, HttpClient } from "@microsoft/sp-http";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
import { IDataService } from "./IDataService";
import { SPDataLists } from "./lists/SPDataLists";
import { SPDataItems } from "./items/SPDataItems";
import { SPDataFiles } from "./lists/SPDataFiles";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

const LOG_SOURCE: string = 'SPDataService';

export default class SPDataService implements IDataService {
    //Registro il servizio
    public static readonly serviceKey: ServiceKey<IDataService> = ServiceKey.create<IDataService>('SPFx:SPDataService', SPDataService);

    private _sp: SPFI;
    private _graph: GraphFI;
    private httpClient: HttpClient;
    private aadHttpClientFactory: AadHttpClientFactory;
    //definisco le classi "d'estensione"
    private _lists: SPDataLists | undefined = undefined;
    private _items: SPDataItems | undefined = undefined;
    private _files: SPDataFiles | undefined = undefined;

    //Costruttore per inizializzare pnp/pnpjs, usa gli scope.
    //https://ypcode.io/posts/2019/01/spfx-webpart-scoped-service/
    constructor(serviceScope: ServiceScope) {
        console.log(LOG_SOURCE + " - constructor() - ServiceScope: ", serviceScope);

        serviceScope.whenFinished(() => {
            this.aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - aadHttpClientFactory: ", this.aadHttpClientFactory);
            
            this.httpClient = serviceScope.consume(HttpClient.serviceKey);
            console.log(LOG_SOURCE + " - constructor() - httpClient: ", this.httpClient);

            //SharePoint
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this._sp = spfi().using(spSPFx({ pageContext }));
            console.log(LOG_SOURCE + " - constructor() - _sp: ", this._sp);
            
            //Graph
            const aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);
            this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
            console.log(LOG_SOURCE + " - constructor() - _graph: ", this._graph);
        });
    }

    //Istanzio classe SPDataLists solo se necessaria - Lazy loading
    public get lists(): SPDataLists {
        if (this._lists === undefined) {
            this._lists = new SPDataLists(this._sp, this._graph);
        }
        return this._lists;
    }

    public get items(): SPDataItems {
        if (this._items === undefined) {
            this._items = new SPDataItems(this._sp, this._graph);
        }
        return this._items;
    }

    public get files(): SPDataFiles {
        if (this._files === undefined) {
            this._files = new SPDataFiles(this._sp, this._graph);
        }
        return this._files;
    }
}