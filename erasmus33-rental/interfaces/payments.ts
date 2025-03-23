import { UUID } from "crypto";

export interface Payment {
  id?: UUID;
  user_id: UUID;
  room_id: UUID;
  payment_date: Date;
  payment_amount: number;
  payment_method: string;
  payment_status: string;
  payment_description: string;
}
