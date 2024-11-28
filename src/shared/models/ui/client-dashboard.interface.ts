import { Name } from "../api/client-response.interface";

export interface ClientDashboard {
  id: string
  name: Name
  email?: string
  username?: string
  country?: string
  picture?: string
}
