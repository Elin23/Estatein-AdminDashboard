export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-lg font-bold text-black dark:text-white">Access Denied</h1>
      <p className="text-lg font-bold text-black dark:text-white">You do not have permission to access this page.</p>
    </div>
  );
}