export interface DialogOption {
  name: string;
  type: string;
  action?: () => void | Promise<void>;
}

export interface DialogPayload {
  title: string;
  subtitle: string;
  options: DialogOption[];
}
