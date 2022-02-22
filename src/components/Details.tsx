import { TableContainer } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom'


const Details: React.FC = () => {
    const { state } = useLocation();
    return (
        <div>
                 <pre>
                        {JSON.stringify(state, null, 2)}
                 </pre>
        </div>
    );
};

export default Details;