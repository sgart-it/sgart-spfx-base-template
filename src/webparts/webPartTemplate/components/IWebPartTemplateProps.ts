import SPDataService from "../../../services/SPDataService";

export interface IWebPartTemplateProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  dataService: SPDataService;
}
