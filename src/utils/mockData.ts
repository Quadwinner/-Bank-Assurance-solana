// Mock data for insurance products, policies, and claims for development

// Insurance Product
export interface InsuranceProduct {
  id: string;
  name: string;
  description: string;
  annualPremium: number;
  coverageAmount: number;
  terms: string;
  provider: string;
  type: string;
  createdAt: number;
  minAge?: number;
  maxAge?: number;
  riskProfile?: string;
  features?: string[];
  benefits?: string[];
}

// Policy
export interface Policy {
  id: string;
  productId: string;
  customer: string;
  bank: string;
  startDate: number;
  endDate: number;
  premium: number;
  status: 'active' | 'expired' | 'claimed';
  createdAt: number;
  policyNumber?: string;
  coverageDetails?: string[];
}

// Claim
export interface Claim {
  id: string;
  policyId: string;
  userId: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  incidentDate: number;
  reviewedAt?: number;
  paidAt?: number;
  type: 'medical' | 'home' | 'auto' | 'life' | 'other';
  policyName: string;
  documents?: {
    name: string;
    type: string;
    uploadDate: number;
    url?: string;
  }[];
  rejectionReason?: string;
}

// User Profile
export interface UserProfile {
  id: string;
  did: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  riskProfile?: string;
  kycVerified?: boolean;
  createdAt?: number;
}

// Mock Insurance Products
export const mockInsuranceProducts: InsuranceProduct[] = [
  {
    id: 'product-1',
    name: 'Basic Life Insurance',
    description: 'Provides financial protection to your family in case of death. This plan offers a simple and affordable way to ensure your loved ones are taken care of financially.',
    annualPremium: 1200,
    coverageAmount: 100000,
    terms: 'Coverage for natural death, accidental death, and terminal illness.',
    provider: 'SafeGuard Insurance',
    type: 'Life',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    minAge: 18,
    maxAge: 65,
    riskProfile: 'low',
    features: [
      'Guaranteed death benefit',
      'No medical examination required',
      'Coverage up to age 80',
      'Fixed premium rate'
    ],
    benefits: [
      'Financial security for dependents',
      'Funeral expense coverage',
      'Debt settlement',
      'Easy application process'
    ]
  },
  {
    id: 'product-2',
    name: 'Premium Health Insurance',
    description: 'Comprehensive health coverage for individuals and families. This plan covers a wide range of medical expenses, from routine check-ups to major surgeries and treatments.',
    annualPremium: 2500,
    coverageAmount: 500000,
    terms: 'Covers hospitalization, surgery, medication, and preventive care.',
    provider: 'MediCare Plus',
    type: 'Health',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    minAge: 0,
    maxAge: 75,
    riskProfile: 'medium',
    features: [
      'Cashless hospitalization',
      'Coverage for pre-existing conditions after 2 years',
      'Annual health check-ups',
      'Alternative treatment coverage'
    ],
    benefits: [
      'Reduced medical expenses',
      'Access to network hospitals',
      'Tax benefits',
      'Family floater option'
    ]
  },
  {
    id: 'product-3',
    name: 'Full Coverage Auto Insurance',
    description: 'Protects your vehicle against damage, theft, and liability. This comprehensive plan ensures your vehicle is covered against all possible risks on the road.',
    annualPremium: 1800,
    coverageAmount: 50000,
    terms: 'Includes collision, comprehensive, liability, and uninsured motorist coverage.',
    provider: 'DriveSafe Insurance',
    type: 'Auto',
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    features: [
      'Roadside assistance',
      'No claim bonus',
      'Engine protection',
      '24/7 claim assistance'
    ],
    benefits: [
      'Complete vehicle protection',
      'Third-party liability coverage',
      'Personal accident cover',
      'Fast claim settlement'
    ]
  },
  {
    id: 'product-4',
    name: 'Home Insurance',
    description: 'Protects your home and belongings from damage and theft. This plan ensures your most valuable asset is protected against various risks, providing peace of mind.',
    annualPremium: 1500,
    coverageAmount: 300000,
    terms: 'Covers damage from fire, water, wind, theft, and liability.',
    provider: 'HomeShield Security',
    type: 'Home',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    riskProfile: 'medium',
    features: [
      'Structure and content coverage',
      'Alternative accommodation',
      'Public liability protection',
      'Burglary and theft protection'
    ],
    benefits: [
      'Financial protection against disasters',
      'Liability coverage for accidents',
      'Repair and replacement costs covered',
      'Peace of mind for homeowners'
    ]
  },
  {
    id: 'product-5',
    name: 'Senior Citizen Health Plan',
    description: 'Specialized health insurance plan designed for senior citizens. This plan covers age-related illnesses and conditions with lower waiting periods.',
    annualPremium: 3200,
    coverageAmount: 400000,
    terms: 'Covers hospitalization, pre-existing diseases after 1 year, specialized treatments for senior citizens.',
    provider: 'MediCare Plus',
    type: 'Health',
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    minAge: 60,
    maxAge: 80,
    riskProfile: 'high',
    features: [
      'Lower waiting period for pre-existing conditions',
      'Coverage for age-related illnesses',
      'Home healthcare services',
      'Preventive health check-ups'
    ],
    benefits: [
      'Financial security during health emergencies',
      'Tax benefits under Section 80D',
      'Cashless treatment at network hospitals',
      'No medical check-up up to age 65'
    ]
  }
];

// Mock Policies
export const mockPolicies: Policy[] = [
  {
    id: 'policy-1',
    productId: 'product-1',
    customer: 'did:sol:customer1',
    bank: 'did:sol:bank1',
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 335 * 24 * 60 * 60 * 1000,
    premium: 1200,
    status: 'active',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    policyNumber: 'POL-LIFE-10001',
    coverageDetails: [
      'Natural death benefit: $100,000',
      'Accidental death benefit: $200,000',
      'Terminal illness advance: 50% of sum assured'
    ]
  },
  {
    id: 'policy-2',
    productId: 'product-2',
    customer: 'did:sol:customer1',
    bank: 'did:sol:bank1',
    startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 305 * 24 * 60 * 60 * 1000,
    premium: 2500,
    status: 'active',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    policyNumber: 'POL-HEALTH-20045',
    coverageDetails: [
      'In-patient hospitalization: 100% covered',
      'Pre and post hospitalization expenses: 60 days',
      'Day care procedures: All covered',
      'Ambulance charges: Up to $500'
    ]
  },
  {
    id: 'policy-3',
    productId: 'product-3',
    customer: 'did:sol:customer1',
    bank: 'did:sol:bank1',
    startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
    endDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    premium: 1800,
    status: 'expired',
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    policyNumber: 'POL-AUTO-30078',
    coverageDetails: [
      'Own damage cover: Up to insured value',
      'Third-party liability: As per regulations',
      'Personal accident cover: $15,000',
      'Zero depreciation add-on included'
    ]
  },
  {
    id: 'policy-4',
    productId: 'product-4',
    customer: 'did:sol:customer2',
    bank: 'did:sol:bank2',
    startDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 275 * 24 * 60 * 60 * 1000,
    premium: 1500,
    status: 'active',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    policyNumber: 'POL-HOME-40123',
    coverageDetails: [
      'Building structure: $200,000',
      'Household contents: $50,000',
      'Valuable items: $10,000',
      'Temporary accommodation: Up to $5,000'
    ]
  },
  {
    id: 'policy-5',
    productId: 'product-5',
    customer: 'did:sol:customer2',
    bank: 'did:sol:bank2',
    startDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 320 * 24 * 60 * 60 * 1000,
    premium: 3200,
    status: 'active',
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    policyNumber: 'POL-HEALTH-50456',
    coverageDetails: [
      'In-patient hospitalization: 100% covered',
      'Pre-existing diseases: Covered after 12 months',
      'Domiciliary treatment: Up to $5,000',
      'Annual health check-up: Free'
    ]
  }
];

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    policyId: 'policy-1',
    userId: 'user-1',
    description: 'I was diagnosed with pneumonia and hospitalized for 5 days. I\'m claiming for hospital expenses, medications, and follow-up consultations.',
    amount: 4500,
    status: 'approved',
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    incidentDate: Date.now() - 50 * 24 * 60 * 60 * 1000,
    reviewedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    paidAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
    type: 'medical',
    policyName: 'Premium Health Insurance',
    documents: [
      {
        name: 'Hospital_Bill.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 45 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Doctor_Prescription.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 45 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Medical_Reports.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 44 * 24 * 60 * 60 * 1000
      }
    ]
  },
  {
    id: 'claim-2',
    policyId: 'policy-2',
    userId: 'user-1',
    description: 'My house suffered water damage due to a burst pipe. The damage affected the kitchen and living room flooring, as well as some furniture.',
    amount: 8500,
    status: 'pending',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    incidentDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
    type: 'home',
    policyName: 'Home Insurance',
    documents: [
      {
        name: 'Damage_Photos.jpg',
        type: 'image',
        uploadDate: Date.now() - 10 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Repair_Estimate.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 9 * 24 * 60 * 60 * 1000
      }
    ]
  },
  {
    id: 'claim-3',
    policyId: 'policy-3',
    userId: 'user-1',
    description: 'My car was involved in a collision with another vehicle at an intersection. The front bumper, headlights, and hood were damaged.',
    amount: 3200,
    status: 'rejected',
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    incidentDate: Date.now() - 95 * 24 * 60 * 60 * 1000,
    reviewedAt: Date.now() - 85 * 24 * 60 * 60 * 1000,
    type: 'auto',
    policyName: 'Full Coverage Auto Insurance',
    documents: [
      {
        name: 'Accident_Report.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 90 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Car_Damage_Photos.jpg',
        type: 'image',
        uploadDate: Date.now() - 90 * 24 * 60 * 60 * 1000
      }
    ],
    rejectionReason: 'The policy had expired at the time of the incident. The accident occurred 5 days after the policy expiration date.'
  },
  {
    id: 'claim-4',
    policyId: 'policy-4',
    userId: 'user-2',
    description: 'I underwent emergency surgery for appendicitis and was hospitalized for 3 days. Claiming for surgery costs, hospital stay, and medications.',
    amount: 6800,
    status: 'approved',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    incidentDate: Date.now() - 62 * 24 * 60 * 60 * 1000,
    reviewedAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
    paidAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
    type: 'medical',
    policyName: 'Premium Health Insurance',
    documents: [
      {
        name: 'Surgery_Bill.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 60 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Hospital_Discharge_Summary.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 59 * 24 * 60 * 60 * 1000
      }
    ]
  },
  {
    id: 'claim-5',
    policyId: 'policy-5',
    userId: 'user-2',
    description: 'My spouse passed away due to a heart attack. I am filing a claim for the life insurance benefit as the designated beneficiary.',
    amount: 100000,
    status: 'pending',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    incidentDate: Date.now() - 8 * 24 * 60 * 60 * 1000,
    type: 'life',
    policyName: 'Basic Life Insurance',
    documents: [
      {
        name: 'Death_Certificate.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 5 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Medical_Report.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 5 * 24 * 60 * 60 * 1000
      },
      {
        name: 'Beneficiary_ID.pdf',
        type: 'pdf',
        uploadDate: Date.now() - 5 * 24 * 60 * 60 * 1000
      }
    ]
  }
];

// Mock User Profiles
export const mockUserProfiles: UserProfile[] = [
  {
    id: 'user-1',
    did: 'did:sol:customer1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 555-123-4567',
    address: '123 Blockchain Ave, Crypto City, CC 12345',
    dateOfBirth: '1985-06-15',
    riskProfile: 'medium',
    kycVerified: true,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000
  },
  {
    id: 'user-2',
    did: 'did:sol:customer2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+1 555-987-6543',
    address: '456 DeFi Street, Tokenville, TV 67890',
    dateOfBirth: '1975-11-22',
    riskProfile: 'low',
    kycVerified: true,
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000
  }
]; 