import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, Router, CanActivateFn} from '@angular/router';

import { AuthService }
from '../services/auth.service';

export const roleGuard:
CanActivateFn =
(route: ActivatedRouteSnapshot) => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const requiredRoles =
    route.data['roles'] || [route.data['role']];

  const user =
    authService.getCurrentUser() as any;

  const userRole =
    user?.role ||
    user?.roleName ||
    user?.userRole ||
    user?.user?.role ||
    user?.user?.roleName;

  if (
    userRole &&
    requiredRoles.some((role: string) =>
      normalizeRole(userRole) === normalizeRole(role)
    )
  ) {
    return true;
  }

  router.navigate(['/dashboard']);

  return false;
};

function normalizeRole(role: string): string {
  return (role || '').replace(/[-_]/g, ' ').trim().toLowerCase();
}
