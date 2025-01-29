import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Typography,
  ListSubheader,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import EmployeeClockInfo from "../../components/EmployeeClockInfo/EmployeeClockInfo";

function EmployeeHierarchy({ filterLeaderEmail }) {
  const [employees, setEmployees] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState(filterLeaderEmail);

  // Debounce effect to avoid frequent API calls while typing
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedEmail(filterLeaderEmail);
    }, 500);

    return () => clearTimeout(delay);
  }, [filterLeaderEmail]);

  useEffect(() => {
    if (!debouncedEmail) {
      setEmployees([]);
      setError("");
      return;
    }

    const fetchHierarchy = async () => {
      try {
        const response = await axios.get(`/back/employees-by-leader/${debouncedEmail}`);
        setEmployees(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching employee hierarchy:", error);
        setError("No employees found for this email.");
        setEmployees([]);
      }
    };

    fetchHierarchy();
  }, [debouncedEmail]);

  // Toggle expand/collapse for a manager
  const handleToggle = (email) => {
    setExpanded((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  // Recursive function to render employees
  const renderEmployees = (employeeList, level = 0) =>
    employeeList.map((employee) => {
      const children = Array.isArray(employee.children) ? employee.children : [];

      return (
        <div key={employee.email}>
          {/* Main Employee List Item */}
          <ListItemButton onClick={() => handleToggle(employee.email)} sx={{ pl: level * 4 }}>
            <ListItemIcon>
              <Avatar sx={{ width: 32, height: 32 }}>{employee.name.charAt(0)}</Avatar>
            </ListItemIcon>
            <ListItemText primary={employee.name} secondary={employee.email} />
            {children.length > 0 && (expanded[employee.email] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* EmployeeClockInfo component */}
          <EmployeeClockInfo employee={employee} />

          {/* Render children inside a nested Collapse */}
          {children.length > 0 && (
            <Collapse in={expanded[employee.email]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderEmployees(children, level + 1)}
              </List>
            </Collapse>
          )}
        </div>
      );
    });

  return (
    <div className="employee-list-container paddings">
      <List
        sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Employee Hierarchy
          </ListSubheader>
        }
      >
        {error ? <Typography color="error">{error}</Typography> : renderEmployees(employees)}
      </List>
    </div>
  );
}

export default EmployeeHierarchy;
