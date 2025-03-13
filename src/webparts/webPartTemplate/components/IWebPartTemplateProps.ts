import { IDataService } from "../../../services/IDataService";

export interface IWebPartTemplateProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  dataService: IDataService; //DG aggiunta
  listName: string //DG
}
