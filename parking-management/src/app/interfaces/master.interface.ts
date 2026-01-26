export interface IMasterResponse {
  message: string;
  result: boolean;
  data: any;
}

export interface ISite {
  siteId: number;
  clientId: number;
  siteName: string;
  siteCity: string;
  siteAddress: string;
  sitePinCode: string;
  totalBuildings: number;
  createdDate: string;
}

export interface IBuilding {
  buildingId: number;
  siteId: number;
  buildingName: string;
  buildingManagerName: string;
  contactNo: string;
  siteName: string;
}

export interface IFloor {
  floorId: number;
  buildingId: number;
  floorNo: string;
  isOperational: boolean;
  totalParkingSpots: number;
}
