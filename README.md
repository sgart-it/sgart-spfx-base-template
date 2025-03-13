# sgart-spfx-base-template

## Summary

Esempio di progetto SPFX da utilizzare come template realizzato con **React functional components**.

TODO:
- npm install
- nvm use

## List

Per funzionare richiede una  lista SharePoint di nome **Tasks** con i seguenti campi
- Title (text)
- ProjectName (text)
- Completed (yes/no)

## Debug

La prima volta che si scarica il progetto (git clone)

npm install

Nom modificare il file **serve.json** deve avere la variabile **{tenantDomain}** ( initialPage="https://{tenantDomain}/sites/siteName/_layouts/workbench.aspx" ) aggiornare **siteName**.

Per fare dedug sostituire **tenantName**:

 $env:SPFX_SERVE_TENANT_DOMAIN="tenantName.sharepoint.com"; gulp serve

## Deploy

gulp clean ; gulp bundle --ship ; gulp package-solution --ship

caricare il file .\sharepoint\solution\packageName.sppkg nell [App Catalog](https://tenantName-admin.sharepoint.com/_layouts/15/tenantAppCatalog.aspx) o di [site collection](https://tenantName.sharepoint.com/sites/siteName/AppCatalog).

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.19.0-green.svg)
Node 18.20.4

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

### Install external package

1. [PnP/PnPjs](https://pnp.github.io/pnpjs/) v. - npm install @pnp/sp @pnp/graph --save
2. [@pnp/spfx-property-controls](https://pnp.github.io/sp-dev-fx-property-controls/) v.3 - npm install @pnp/spfx-property-controls --save --save-exact
3. [@pnp/spfx-controls-react](https://pnp.github.io/sp-dev-fx-controls-react/) v.3 - npm install @pnp/spfx-controls-react --save --save-exact

## Solution

| Solution                 | Author(s)         |
| ------------------------ | ----------------- |
| sgart-spfx-base-template | Alberto Ballabio  |

## Version history

| Version | Date             | Comments                        |
| ------- | ---------------- | ------------------------------- |
| 2.0.0.0 | Marzo 28, 2025   | SPFx React functional component |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Preparazione ambiente

Per vedere la versione di Node JS corrente

node -v

Per installare una versione di Node JS aggiuntiva

nvm install 18.19.0

Per cambiare versione di Node JS (https://github.com/coreybutler/nvm-windows)

nvm use 18.19.0

npm install gulp-cli yo @microsoft/generator-sharepoint --global

gulp trust-dev-cert

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
