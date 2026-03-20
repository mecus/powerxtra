
export interface IAdvert {
  title: string;
  business_name: string;
  start_date: Date;
  end_date: Date;
  type: string;
  category: string;
  tags: string;
  description: string;
  createdBy?: string;
  fileUrl?: string;
  active: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  published: boolean;
  status: string;
  _id?: string;
}
