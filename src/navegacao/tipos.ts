import type { NavigatorScreenParams } from '@react-navigation/native';
export type TabParamList = {
  Home: undefined;
  Map: { focusStationId?: string; focusRequestId?: number } | undefined;
  Filters: undefined;
  Favorites: undefined;
  Community: undefined;
  Profile: undefined;
};
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  StationDetail: { stationId: string };
  ReportExperience: { stationId?: string } | undefined;
  Accessibility: undefined;
  TripPlanner: undefined;
  Login: undefined;
  Cadastro: undefined;
};
