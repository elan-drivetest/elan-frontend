export type DriveTestCenter = {
    id: string;
    name: string;
    address: string;
    basePrice: number;
    region: string;
  };
  
  export type Addon = {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    description?: string;
    disabled?: boolean;
  };
  
  export type SearchData = {
    roadTestType: string;
    testDate: string;
    testTime: string;
    driveTestCentreId: string;
    meetAtCentre: boolean;
    pickupAddress: string;
    pickupPostalCode: string;
    dropoffAddress: string;
    dropoffPostalCode: string;
    selectedAddons: Addon[];
  };
  
  export type SearchFormProps = {
    onSearch?: (data: SearchData) => void;
    initialValues?: SearchData;
    className?: string;
  };
  
  export type SearchFieldProps = {
    label: string;
    secondaryLabel?: string;
    value: string | boolean;
    onChange: (value: string | boolean) => void;
    type?: string;
    className?: string;
    placeholder?: string;
  };