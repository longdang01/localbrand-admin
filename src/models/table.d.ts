export interface VehicleType {
    key: React.Key;
    vehicle_name: string;
}

export interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    date?: string;
    content?: string;
    vehicles?: VehicleType[];
}
