import BotCommands from "../components/BotCommands";
import NotificationSection from "../components/Notifications/NotificationSection";
import Reporting from "../components/Reporting/Reporting";


const Dashboard = () => {


  return (
    <div className="p-6 space-y-6 mx-auto huge:max-w-[1930px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      </div>
      <Reporting />
      <div className="flex flex-col lg-custom:flex-row w-full gap-4">      
        <NotificationSection />
        <BotCommands />
      </div>

    </div>
  );
};

export default Dashboard;

