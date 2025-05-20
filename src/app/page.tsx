'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const cache: { [key: string]: Record<string, any>[] } = {};

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [iopsTimeline, setIopsTimeline] = useState<Record<string, any>[]>([]);
  const [throughputTimeline, setThroughputTimeline] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const getTimeline = async (id: string) => {
      if (cache[id]) {
        if (id === '1') {
          setIopsTimeline(cache[id]);
        } else {
          setThroughputTimeline(cache[id]);
        }
        return;
      }
      const data = await axios.get(`http://localhost:3333/timelines/${id}`);
      if (id === '1') {
        setIopsTimeline(data.data);
      } else {
        setThroughputTimeline(data.data);
      }
      cache[id] = data.data;
    };

    setIsLoading(true);
    try {
      getTimeline('1');
      getTimeline('2');
    } catch (e) {
      toast.error('Error fetching timelines. Please try again later.');
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-graphics p-4">
      <div className="flex justify-between items-center mr-2">
        <h1 className="text-2xl">Performance Metrics</h1>
        <select className="border rounded p-1 bg-slate-800 text-gray-400" defaultValue="option2">
          <option key="1" value="option1">Last 24 hours</option>
          <option key="2" value="option2">Last 7 days</option>
          <option key="3" value="option3">Last 30 days</option>
        </select>
      </div>
      <div className="mt-10 ml-6">
        <ResponsiveContainer width="90%" height={300}>
          <LineChart data={iopsTimeline}>
            <XAxis dataKey="time" />
            <YAxis dataKey="value" />
            <Line type="monotone" dataKey="iops" stroke="#8884d8" />
            <Line type="monotone" dataKey="throughput" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-10 ml-6">
        <ResponsiveContainer width="90%" height={300}>
          <LineChart data={throughputTimeline}>
            <XAxis dataKey="time" />
            <YAxis dataKey="value" />
            <Line type="monotone" dataKey="iops" stroke="#8884d8" />
            <Line type="monotone" dataKey="throughput" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Home;
