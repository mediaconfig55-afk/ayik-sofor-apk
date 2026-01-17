
export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address: string;
  error?: string;
}

export interface FormData {
  fullName: string;
  plate: string;
  passengerCount: string;
}

export enum AppState {
  SPLASH = 'SPLASH',
  MAIN = 'MAIN',
  FORM = 'FORM',
  QR = 'QR'
}
