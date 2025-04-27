export interface Bed {
  id: number;
  center_id: number;
  code: string;
  status: 'active' | 'inactive';
}

export interface BedFormValues {
  code: string;
  status: 'active' | 'inactive';
}
