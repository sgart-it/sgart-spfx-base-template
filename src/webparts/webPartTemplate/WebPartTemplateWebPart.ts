import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'WebPartTemplateWebPartStrings';
import WebPartTemplate from './components/WebPartTemplate';
import { IWebPartTemplateProps } from './components/IWebPartTemplateProps';
import { IDataService } from '../../services/IDataService';
import SPDataService from '../../services/SPDataService';
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';

export interface IWebPartTemplateWebPartProps {
  description: string;
  toggleInfoHeaderValue: boolean;
  taskListName: string
}

export default class WebPartTemplateWebPart extends BaseClientSideWebPart<IWebPartTemplateWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _dataService: IDataService;
  //private _dataServicePartial: SPDataServicePartial; //DG Test utilizzo classe parziale

  public render(): void {
    const element: React.ReactElement<IWebPartTemplateProps> = React.createElement(
      WebPartTemplate,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        dataService: this._dataService
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._dataService = new SPDataService(this.context.serviceScope);
    this._dataService.setTaskListName(this.properties.taskListName);

    console.log("dataService: ", this._dataService);
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('taskListName', {
                  label: "List"
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "Information"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneWebPartInformation({
                  description: 'Solution <strong>sgart-spfx-base-template</strong>, by <a href="https://msys.it/" target="_blank">Microsys</a>',
                  //moreInfoLink: 'https://pnp.github.io/sp-dev-fx-property-controls/',
                  key: 'webPartInfoId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}