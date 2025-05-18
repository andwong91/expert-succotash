const Home = () => {
  return (
    <div className="flex-1 min-h-screen bg-graphics p-4 w-full">
      <div className="flex justify-between items-center pr-2">
        <h1 className="text-2xl">Performance Metrics</h1>
        <select className="border rounded p-1 bg-slate-800 text-gray-400" defaultValue="option2">
          <option key="1" value="option1">Last 24 hours</option>
          <option key="2" value="option2">Last 7 days</option>
          <option key="3" value="option3">Last 30 days</option>
        </select>
      </div>
    </div>
  );
}

export default Home;
