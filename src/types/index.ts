// Property Types
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  category: 'residential' | 'business' | 'agricultural';
  features: string[];
  images: string[];
  mapUrl: string;
  area: number;
  createdAt: Date;
}

export type PropertyFormData = Omit<Property, 'id' | 'createdAt'>;

// Contact Types
export interface ContactType {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied';
}

// Form Types
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect';
  required: boolean;
  options?: string[];
}

export interface DynamicForm {
  id: string;
  name: string;
  category: string;
  fields: FormField[];
  createdAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  category: string;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  data: Record<string, string>;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  state: string;
  createdAt: Date;
}

export type LocationFormData = Omit<Location, 'id' | 'createdAt'>;

// Feedback Types
export interface FeedbackItem {
  id: string;
  user: string;
  message: string;
  date: Date;
}
// Team Member Types

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  clientImage: string;
}

export type TeamMemberFormData = Omit<TeamMember, 'id' | 'createdAt' | 'imageUrl'>;
