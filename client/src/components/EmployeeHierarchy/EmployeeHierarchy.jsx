import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import EmployeeClockInfo from '../../components/EmployeeClockInfo/EmployeeClockInfo';

function EmployeeHierarchy({ leaderEmail }) {
    const [employeeTree, setEmployeeTree] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                const response = await axios.get(`/back/employees-by-leader/${leaderEmail}`);
                setEmployeeTree(response.data);
            } catch (err) {
                setError('Failed to load employee hierarchy');
                console.error(err);
            }
        };
        
        if (leaderEmail) fetchHierarchy();
    }, [leaderEmail]);

    const renderTree = (nodes) => {
        return nodes.map((node) => (
            <TreeItem key={node.email} nodeId={node.email} label={node.name}>
                {node.children && node.children.length > 0 && renderTree(node.children)}
            </TreeItem>
        ));
    };

    return (
        <div>
            <h2>Employee Hierarchy</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <TreeView
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
            >
                {renderTree(employeeTree)}
            </TreeView>
            <EmployeeClockInfo />
        </div>
    );
}

export default EmployeeHierarchy;
