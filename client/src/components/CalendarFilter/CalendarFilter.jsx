import React, { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { useMsal } from '@azure/msal-react';
import './CalendarFilter.css';

const typeMapping = {
	'Paid Time Off': 'PTO',
	'Maternity License': 'ML',
	'Paternity License': 'PL',
	'Domestic Calamity License': 'DCL',
	'Bereavement License': 'BL',
	'Unpaid Time Off': 'UTO',
	'Inability': 'Ina',
};

const requestTypes = Object.keys(typeMapping);

const filterOptions = [
	{ label: 'Filter for Type', key: 'type' },
	{ label: 'Filter for Decision', key: 'decided' },
	{ label: 'Filter for Acceptance', key: 'accepted' },
	{ label: 'Filter for Department', key: 'department' },
	{ label: 'Filter for Employee', key: 'employee' },
];

const departmentOptions = [
	'Management', 'Collections', 'QA', 'CSU', 'GP', 'Underwriting',
	'Marketing', 'Servicing', 'Payment', 'Odonaga', 'TBI', 'SCOF',
];

function CalendarFilter({ onFilterChange, filterLeaderEmail }) {
	const { accounts } = useMsal();
	const [requests, setRequests] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedDecisions, setSelectedDecisions] = useState([]);
	const [selectedAcceptances, setSelectedAcceptances] = useState([]);
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	const [selectedEmployees, setSelectedEmployees] = useState([]);

	useEffect(() => {
		if (!accounts || accounts.length === 0) return;

		const fetchRequestsAndEmployees = async () => {
			setEmployees([]);
			setRequests([]);
			let events = [];

			const roles = accounts[0]?.idTokenClaims?.roles || [];
			const isUsTeamReader = roles.includes('Us_Team_Reader');
			const isColTeamReader = roles.includes('Col_Team_Reader');
			const isAllTeamReader = roles.includes('All_Team_Reader');

			try {
				let requestsData = [];

				// ALL TEAM
				if (isAllTeamReader) {
					const response = await fetch('/back/request?col_team=1&us_team=1');
					requestsData = await response.json();
				}

				// US TEAM ONLY
				else if (isUsTeamReader) {
					const response = await fetch('/back/request?col_team=0&us_team=1');
					requestsData = await response.json();
				}

				// COL TEAM ONLY
				else if (isColTeamReader) {
					const employeeResponse = filterLeaderEmail
						? await fetch(`/back/employees-by-leader/${filterLeaderEmail}`)
						: await fetch('/back/employee');
					const employeeData = await employeeResponse.json();
					setEmployees(employeeData);

					const employeeIds = employeeData.map(emp => emp.employee_id);

					const requestResponse = await fetch('/back/request');
					const allRequests = await requestResponse.json();

					requestsData = allRequests.filter(req =>
						employeeIds.includes(req.employee_id)
					);
				}

				// NO PERMISSION
				else {
					console.warn('No valid role assigned for viewing requests.');
					return; // Exit early — no role
				}

				// Map requests to calendar events
				for (const request of requestsData) {
					const start = new Date(request.start_date);
					const end = new Date(request.end_date);
					start.setDate(start.getDate() + 1);
					end.setDate(end.getDate() + 1);

					for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
						events.push({
							name: request.name,
							type: typeMapping[request.type],
							start: new Date(d),
							end: new Date(d),
							allDay: true,
							employeeId: request.employee_id,
							accepted: request.accepted,
							decided: request.decided,
							cancelled: request.cancelled,
							taken: request.taken,
							requestId: request.request_id,
							details: request,
							department: request.department,
						});
					}
				}

				setRequests(events);
				onFilterChange(events);
			} catch (error) {
				console.error('Error fetching requests:', error);
			}
		};

		fetchRequestsAndEmployees();
	}, [filterLeaderEmail, onFilterChange, accounts]);


	useEffect(() => {
		if (selectedDepartments.length) {
			setFilteredEmployees(
				employees.filter(emp => selectedDepartments.includes(emp.department))
			);
		} else {
			setFilteredEmployees(employees);
		}
	}, [selectedDepartments, employees]);


	useEffect(() => {
		if (selectedDepartments.length) {
			setFilteredEmployees(
				employees.filter(emp => selectedDepartments.includes(emp.department))
			);
		} else {
			setFilteredEmployees(employees);
		}
	}, [selectedDepartments, employees]);

	const handleFilterChange = (key, value) => {
		switch (key) {
			case 'type':
				setSelectedTypes(value);
				break;
			case 'decided':
				setSelectedDecisions(value);
				break;
			case 'accepted':
				setSelectedAcceptances(value);
				break;
			case 'department':
				setSelectedDepartments(value);
				break;
			case 'employee':
				setSelectedEmployees(value);
				break;
			default:
				break;
		}
		onFilterChange(
			applyFilters(
				key === 'type' ? value : selectedTypes,
				key === 'decided' ? value : selectedDecisions,
				key === 'accepted' ? value : selectedAcceptances,
				key === 'department' ? value : selectedDepartments,
				key === 'employee' ? value : selectedEmployees
			)
		);
	};

	const applyFilters = (types, decisions, acceptances, departments, employees) => {
		return requests.filter(request => {
			const typeMatch = types.length ? types.includes(request.type) : true;
			const decisionMatch = decisions.length ? decisions.includes(request.decided) : true;
			const acceptanceMatch = acceptances.length ? acceptances.includes(request.accepted) : true;
			const departmentMatch = departments.length ? departments.includes(request.department) : true;
			const employeeMatch = employees.length
				? employees.some(emp => emp.employee_id === request.employeeId)
				: true;
			return typeMatch && decisionMatch && acceptanceMatch && departmentMatch && employeeMatch;
		});
	};

	return (
		<Box className="calendar-filter" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
			{filterOptions.map(({ label, key }) => {
				const value = {
					type: selectedTypes,
					decided: selectedDecisions,
					accepted: selectedAcceptances,
					department: selectedDepartments,
					employee: selectedEmployees,
				}[key];

				const options = {
					type: requestTypes.map(type => ({
						label: type,
						value: typeMapping[type],
					})),
					decided: [false, true].map(val => ({
						label: val ? 'Decided' : 'Undecided',
						value: val,
					})),
					accepted: [false, true].map(val => ({
						label: val ? 'Accepted' : 'Denied',
						value: val,
					})),
					department: departmentOptions.map(dep => ({
						label: dep,
						value: dep,
					})),
					employee: filteredEmployees.map(emp => ({
						label: emp.name,
						value: emp,
					})),
				}[key];

				return (
					<Box key={key} flex={1} minWidth="200px">
						<div className="filter-description">{label}</div>
						<Select
							multiple
							value={value}
							onChange={event => handleFilterChange(key, event.target.value)}
							renderValue={selected =>
								selected
									.map(opt => (typeof opt === 'object' ? opt.label : opt))
									.join(', ') || `Select ${label}`
							}
							fullWidth
						>
							{options.map(({ label, value: optValue }) => (
								<MenuItem key={label} value={optValue}>
									<Checkbox
										checked={Array.isArray(value) && value.includes(optValue)}
									/>
									<ListItemText primary={label} />
								</MenuItem>
							))}
						</Select>
					</Box>
				);
			})}
		</Box>
	);
}

export default CalendarFilter;
