export type DeliveryAddressProps = {
  _id: string;
  customer: string;
  deliveryAddressName: string;
  consigneeName: string;
  consigneePhone: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  active: number;
  createdAt: string;
  updatedAt: string;
};

export type ProvinceProps = {
  Id: string;
  Name: string;
  Districts: DistrictProps[];
};

export type DistrictProps = {
  Id: string;
  Name: string;
  Wards: WardProps[];
};

export type WardProps = {
  Id?: string;
  Name?: string;
  Level?: string;
};
