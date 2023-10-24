import { ClientDashboard } from "./components/Client/ClientDashboard";
import { EmployeeDashboard } from "./components/Employee/EmployeeDashboard";
import { CallCenterDept } from "./components/Departments/CallCenterDept";
import { ClientMaintenanceDept } from "./components/Departments/ClientMaintenanceDept";
import { ContractMaintenanceDept } from "./components/Departments/ContractMaintenanceDept";
import { ServiceDept } from "./components/Departments/ServiceDept";
import { LoginSignup } from "./components/Login-Signup";
import { EmployeeAccSetup } from "./components/Employee/EmployeeAccSetup";
import { FetchData } from "./components/FetchData";


const AppRoutes = [
  {
    index: true,
    element: <LoginSignup />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/employee-dashboard',
    element: <EmployeeDashboard />
  },
  {
    path: '/client-dashboard',
    element: <ClientDashboard />
  },
  {
    path: '/service-department',
    element: <ServiceDept />
  },
  {
    path: '/call-center',
    element: <CallCenterDept />
  },
  {
    path: '/contract-maintenance',
    element: <ContractMaintenanceDept />
  },
  {
    path: '/client-maintenance',
    element: <ClientMaintenanceDept />
  },
  {
    path: '/account-setup',
    element: <EmployeeAccSetup />
  }
];

export default AppRoutes;