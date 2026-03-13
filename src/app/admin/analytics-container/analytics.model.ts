export interface ListenerStats {
  currentListeners: number;
  peakListeners: number;
  averageListeners: number;
}

export interface ListenerLocation {
  country: string;
  listeners: number;
}

export interface DeviceStats {
  device: string;
  listeners: number;
}
