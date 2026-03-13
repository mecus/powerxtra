// import { ObjectId} from "mongoose";

export interface IUser {
  displayName?: string,
  first_name?: string;
  last_name?: string;
  email: string;
  accountType?: string; // admin | user | super | general
  phone?: string;
  start_date: Date;
  photos?: string;
  createdBy?: string;
  date_created?: Date;
  status: string;
  active: boolean;
  tags?: string;
  uid?: string;
  category?: string; // internation | local
  password?: string;
}
