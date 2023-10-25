import { UserScopeProvider } from './UserScopeContext';
import { DeploymentFilterProvider } from './DeploymentFilterContext';

/**
 * Wrapper for all contexts used in QuickTa.
 * @param {Children components} children
 * @returns 
 */
export const QuickTaProvider = ({ children }) => {

  return (
    <div>
      <UserScopeProvider>
      <DeploymentFilterProvider>
          {children}
      </DeploymentFilterProvider>
      </UserScopeProvider>
    </div>
  );
};
