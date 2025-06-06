import { Permissions } from '#apps/shared/enums/permissions'

export default class PermissionsService {
  declare permissionSet: Permissions

  isValidMask(mask: number): boolean {
    const maxPermissionValue = this.calculateMaxPermissionValue()
    const maxPermissionLength = this.calculateMaxPermissionLength()
    const maxPermissionSum = this.calculateMaxPermissionSum()

    if (mask > maxPermissionSum) return false

    if (mask < 0) return false

    // Convert mask to binary string and get its length
    const maskBinary = mask.toString(2)
    if (maskBinary.length > maxPermissionLength) return false

    // Extract the highest permission from the mask
    const highestPermissionInMask = this.extractHighestPermission(mask)

    // Compare with the max allowed permission value
    if (highestPermissionInMask > maxPermissionValue) return false

    return true
  }

  calculateMaxPermissionValue() {
    return Math.max(
      ...(Object.values(Permissions).filter((value) => typeof value === 'number') as number[])
    )
  }

  calculateMaxPermissionLength() {
    return this.calculateMaxPermissionValue().toString(2).length
  }

  calculateMaxPermissionSum(): number {
    const allPermissions: number[] = Object.values(Permissions).filter(
      (value) => typeof value === 'number'
    ) as number[]

    return allPermissions.reduce((sum, permission) => sum + permission, 0)
  }

  has_permission(mask: number, permission: Permissions): boolean {
    // Check if mask is valid
    if (!this.isValidMask(mask)) return false

    // Bitwise AND to check if all required permissions are present
    return (mask & permission) === permission
  }

  validate_permissions(mask: number, permissions: Permissions[]): boolean {
    return permissions.every((permission) => this.has_permission(mask, permission))
  }

  private extractHighestPermission(mask: number): number {
    if (mask === 0) return 0

    // Convert to binary string
    const binary = mask.toString(2)

    // Find the position of the leftmost '1'
    const highestBitPosition = binary.length - 1

    // Create a number with only the highest bit set
    return 1 << highestBitPosition
  }
}
