import { ClientDashboard } from "./components/Client/ClientDashboard";
import { EmployeeDashboard } from "./components/Employee/EmployeeDashboard";
import { CallCenterDept } from "./components/Departments/CallCenterDept";
import { ClientMaintenanceDept } from "./components/Departments/ClientMaintenanceDept";
import { ContractMaintenanceDept } from "./components/Departments/ContractMaintenanceDept";
import { TechDashboard } from "./components/Technician/TechnicianDashboard";
import { ServiceDept } from "./components/Departments/ServiceDept";
import { ServiceDeptJobList } from "./components/Departments/ServiceDeptJobList";
import { LoginSignup } from "./components/Login-Signup";
import { EmployeeAccSetup } from "./components/Employee/EmployeeAccSetup";
import { ServicesOffered } from "./components/Client/ServicesOffered"
import { EmployeeSettings } from "./components/Employee/EmployeeSettings"
import { MaintenanceTab } from "./components/Client/MaintenanceTab";
import { ClientSettings } from "./components/Client/ClientSettings";
import { EmployeeManagement } from "./components/Employee/EmployeeManagement";

//Messaging
import Messaging from "./components/Messaging";
import JobForm from "./components/JobForm";
import ChannelForm from "./components/ChannelForm";
import { SendEmail } from "./components/SendEmail";


const AppRoutes = [
  {
    index: true,
    element: <LoginSignup />
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
    path: '/jobs-list',
    element: <ServiceDeptJobList />
  },
  {
    path: '/technician-dashboard',
    element: <TechDashboard />
  },
  {
    path: '/call-center',
    element: <CallCenterDept />
  },
  {
    path: '/services-offered',
    element: <ServicesOffered />
  },
  {
    path: '/client-maintenance',
    element: <ClientMaintenanceDept />
  },
  {
    path: '/contract-maintenance',
    element: <ContractMaintenanceDept />
  },
  {
    path: '/maintenance-tab',
    element: <MaintenanceTab />
  },
  {
    path: '/client-account-settings',
    element: <ClientSettings />
  },
  {
    path: '/employee-account-settings',
    element: <EmployeeSettings />
  },
  {
    path: '/account-setup',
    element: <EmployeeAccSetup />
  },
  {
    path: '/employee-management',
    element: <EmployeeManagement />
  },
  {
    path: '/message',
    element: <Messaging />
  },
  {
    path: '/job',
    element: <JobForm />
  },
  {
    path: '/channel',
    element: <ChannelForm />
  },
  {
    path: '/send-email',
    element: <SendEmail />
  }
];

export default AppRoutes;