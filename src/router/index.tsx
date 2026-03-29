import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Test from '../pages/Test';
import Result from '../pages/Result';
import History from '../pages/History';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import TimeJourney from '../pages/TimeJourney';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'test',
        element: <Test />
      },
      {
        path: 'journey/:scenario',
        element: <TimeJourney />
      },
      {
        path: 'result',
        element: <Result />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

export { router };
