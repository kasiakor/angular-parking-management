export interface IParkingReservationRequest {
  parkId: number;
  floorId: number;
  custName: string;
  custMobileNo: string;
  vehicleNo: string;
  parkDate: string;
  parkSpotNo: number;
  inTime: string;
  outTime: string;
  amount: number;
  extraCharge: number;
  parkingNo: string;
}

export interface IParkingReservationResponse {
  message: string;
  result: boolean;
  data: any;
}

export interface IParkingResponse {
  parkId: number;
  custName: any;
  custMobileNo: string;
  vehicleNo: string;
  parkDate: string;
  parkSpotNo: number;
  inTime: string;
  outTime: string;
  amount: number;
  extraCharge: number;
  floorNo: string;
  buildingName: string;
  siteName: string;
  parkingNo: string;
  clientName: string;
}

export interface IReleaseSpace {
  parkId: number;
  outTime: string;
  extraCharge: number;
}
