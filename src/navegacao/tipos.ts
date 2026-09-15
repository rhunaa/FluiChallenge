export type TabParamList = {
  Home: undefined;
  Map: { focusStationId?: string } | undefined;
  Filters: undefined;
  Favorites: undefined;
  Community: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  StationDetail: { stationId: string };
  ReportExperience: undefined;
  Accessibility: undefined;
  TripPlanner: undefined;
};
