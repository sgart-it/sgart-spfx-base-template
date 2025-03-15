import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPDataLists } from "./lists/SPDataLists";
import { SPDataItems } from "./items/SPDataItems";
import { SPDataFiles } from "./lists/SPDataFiles";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { SPDataTasksItems } from "./items/SPDataTasksItems";
import { objectDefinedNotNull, stringIsNullOrEmpty } from "@pnp/core";
import { SOLUTION_NAME } from "../constants";

const LOG_SOURCE: string = SOLUTION_NAME + ':SPDataService:';

export default class SPDataService {
    //Registro il servizio
    public static readonly serviceKey: ServiceKey<SPDataService> = ServiceKey.create<SPDataService>('SPFx:SPDataService', SPDataService);

    //Costruttore per inizializzare pnp/pnpjs, usa gli scope.
    //https://ypcode.io/posts/2019/01/spfx-webpart-scoped-service/
    constructor(private serviceScope: ServiceScope) {
        console.log(`${LOG_SOURCE} dataService: ${objectDefinedNotNull(serviceScope)}`);
        
        // serviceScope.whenFinished(() => { ...  });
    }

    // metodi generici
    private _lists: SPDataLists | undefined = undefined;
    public get lists(): SPDataLists {
        if (this._lists === undefined) {
            this._lists = new SPDataLists(this.serviceScope);
        }
        return this._lists;
    }

    private _items: SPDataItems | undefined = undefined;
    public get items(): SPDataItems {
        if (this._items === undefined) {
            this._items = new SPDataItems(this.serviceScope);
        }
        return this._items;
    }

    private _files: SPDataFiles | undefined = undefined;
    public get files(): SPDataFiles {
        if (this._files === undefined) {
            this._files = new SPDataFiles(this.serviceScope);
        }
        return this._files;
    }

    // Metodi tipizzati
    // Tasks
    private _taskListName: string;
    private _tasks: SPDataTasksItems | undefined = undefined;

    public setTaskListName = (listName: string): void => {
        this._taskListName = listName;
        if (stringIsNullOrEmpty(this._taskListName)) {
            console.error(`TaskListName is null`);
        }
    };

    public get tasks(): SPDataTasksItems {
        if (this._tasks === undefined) {
            this._tasks = new SPDataTasksItems(this.serviceScope, this._taskListName);
        }
        return this._tasks;
    }
}

