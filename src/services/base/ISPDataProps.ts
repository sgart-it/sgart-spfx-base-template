import { GraphFI } from "@pnp/graph";
import { SPFI } from "@pnp/sp";
import { AadHttpClientFactory, HttpClient } from "@microsoft/sp-http";

export type ISPDataProps = {
    sp: SPFI;
    graph: GraphFI;
    httpClient: HttpClient;
    aadHttpClientFactory: AadHttpClientFactory;
};
