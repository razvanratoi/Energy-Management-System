export const USER_PATH = "http://localhost:8088";
export const DEVICE_PATH = "http://localhost:5555";
export const MONITORING_PATH = "http://localhost:8089";
export const USER = "user";
export const DEVICE = "device";
export const MAPPING = "mapping";
export const MONITORING = "monitoring";

export const DIALOG_CONFIG = {
  hasBackdrop: true,
  disableClose: true,
  closeOnNavigation: true,
}

export const BASIC_GUID = 'bec331aa-1566-1f59-1bf1-0a709be9a710';
export const displayedColumnsObject = {
  user: ['id', 'name', 'address', 'role', 'actions'],
  device: ['id', 'name', 'description', 'address', 'maxHourlyConsumption', 'actions'],
  mapping: ['id', "client", "device"]
};
