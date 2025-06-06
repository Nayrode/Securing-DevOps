import { UserRole } from '../enums/user-roles'

export interface UserEntity {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
  totpAuthentication: boolean
  roles?: UserRole[]
  verifiedAt: Date | null
  createdAt?: string
  updatedAt?: string
}
