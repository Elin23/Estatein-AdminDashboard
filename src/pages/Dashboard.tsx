import NotificationSection from "../components/Notifications/NotificationSection";
import Reporting from "../components/Reporting/Reporting";


const Dashboard = () => {
  

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      </div>
      <Reporting />
      <NotificationSection />
    </div>
  );
};

export default Dashboard;

