import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import Messaging from './components/Messaging';

import JobAssignmentForm from './components/JobForm';
import ChannelForm from "./components/ChannelForm";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
      path: '/message',
      element: <Messaging />
  },
  {
      path: '/job',
      element: <JobAssignmentForm />
   },
   {
      path: '/channel',
       element: <ChannelForm />
   }

];

export default AppRoutes;
