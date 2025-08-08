
import Feedback from '../components/Feedback';


const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Feedback />
        {/* <FAQSection /> */}
      </div>
    </div>
  );
};

export default Dashboard;