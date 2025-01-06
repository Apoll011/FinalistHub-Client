import {HashLoader} from "react-spinners";
import React from "react";

export const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <HashLoader />
    </div>
);
