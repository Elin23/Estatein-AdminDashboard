// Property Types
export interface Property {
  createdAt?: string;
  id: string;
  title: string;
  type: "villa" | "apartment" | "house" | string;
  location: string;
  price: number;
  description: string;
  bedrooms: string;
  bathrooms: string;
  area: number;
  buildYear: string;
  features: string[];
  status: "available" | "sold";
  tags: string;
  mapUrl: string;
  images: string[];

  additionalFees: {
    transferTax: number,
    legalFees: number,
    inspection: number,
    insurance: number,
  },

  monthlyCosts: {
    propertyTaxes: number,
    hoa: number,
  },

  totalInitialCosts: {
    listingPrice: number,
    additionalFees: number,
    downPayment: number,
    mortgageAmount: number,
  },

  monthlyExpenses: {
    propertyTaxes: number,//same above
    hoa: number,//the same one above
    insurance: number,//total insurance / 12
  },
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
  status: 'new' | 'read' | 'replied' | 'rejected' | "reviewed" | "approved";
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
  branch: string;
  address: string;
  details: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  createdAt: number;
  mapLink: string;
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
  twitterLink: string;
  email: string;
}

export type TeamMemberFormData = Omit<TeamMember, 'id' | 'createdAt' | 'imageUrl'>;

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}


export interface Testimonial {
  id: string;
  clientImage: string;
  location: string;
  name: string;
  rate: number;
  review: string;
  show: boolean;
  subject: string;
}

export interface User {
  id: string; // uid
  email: string;
  role: "admin" | "support" | "sales";
  createdAt?: number;
}