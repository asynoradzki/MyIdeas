import React from 'react'
import { ACCESS_TOKEN } from '../constants/constants'
import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({children} : React.PropsWithChildren ) => {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return <Navigate to={"/login"} replace />
    }

  return <>{children}</>;
}
