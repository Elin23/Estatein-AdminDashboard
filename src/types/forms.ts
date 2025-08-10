// Location data structure (matches Firebase fields)
export interface LocationData {
  id?: string; 
  branch: string;
  address: string;
  details: string;
  email: string;
  phone: string;
  city: string;
  category: "regional" | "international" | string;
  createdAt?: number;
}

// Props for LocationCard
export interface LocationCardProps {
  data: LocationData;
  onEdit: () => void;
  onDelete: () => void;
}

// Props for LocationForm
export interface LocationFormProps {
  initialData?: Partial<LocationData>;
  onSubmit: (data: Omit<LocationData, "createdAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}
