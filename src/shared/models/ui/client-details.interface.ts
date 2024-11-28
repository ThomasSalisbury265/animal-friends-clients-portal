import { Dob, Name } from "../api/client-response.interface";

export interface ClientDetails {
  id: string
  name: Name
  email?: string
  username?: string
  country?: string
  city?: string
  state?: string
  dateOfBirth?: string
  registered?: string
  phone?: string
  picture?: string
}
