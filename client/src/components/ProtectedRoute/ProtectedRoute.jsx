import React, { useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState(true);
  const [userHasRole, setUserHasRole] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkUserRole = async () => {
        try {
          // Attempt to acquire token silently to access ID token claims
          const account = accounts[0];
          const idTokenClaims = account?.idTokenClaims;

          // Check for required role in the user's roles claim
          const hasRole = idTokenClaims?.roles?.includes(requiredRole);

          setUserHasRole(hasRole);
        } catch (error) {
          console.error('Error checking user roles:', error);
        } finally {
          setLoading(false); // Authentication and role check complete
        }
      };

      checkUserRole();
    } else {
      setLoading(false); // User is not authenticated
    }
  }, [isAuthenticated, accounts, requiredRole]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    instance.loginRedirect();
    return null;
  }

  if (!userHasRole) {
    // Redirect or display an unauthorized message if user lacks the role
    return <Navigate to="/" replace />;
  }

  // Render children if user is authenticated and has the correct role
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
};

export default ProtectedRoute;
