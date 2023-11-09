import { UserScopeProvider } from './UserScopeContext';
import { DeploymentFilterProvider } from './DeploymentFilterContext';
import { SnackbarProvider } from './SnackbarContext';

/**
 * Wrapper for all contexts used in QuickTa.
 * @param {Children components} children
 * @returns 
 */
export const QuickTaProvider = ({ children }) => {

  return (
    <div>
      <SnackbarProvider>
      <UserScopeProvider>
      <DeploymentFilterProvider>
          {children}
      </DeploymentFilterProvider>
      </UserScopeProvider>
      </SnackbarProvider>
    </div>
  );
};
