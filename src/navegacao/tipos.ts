export type TabParamList = {
  Home: undefined;
  Map: { focusStationId?: string } | undefined;
  Filters: undefined;
  Favorites: undefined;
  Community: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  StationDetail: { stationId: string };
  ReportExperience: undefined;
  Accessibility: undefined;
  TripPlanner: undefined;
  Login: undefined;
  Cadastro: undefined;
};
