"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { BellIcon, Users } from 'lucide-react';
import { useState, useEffect } from "react"
import Cookies from "js-cookie"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const serviceList = [
  "Stewards", "Security Services", "Corporate Manpower Supply",
  "Valet Driver", "Bouncers", "House Keeping",
  "Kitchen Stewards", "Chefs"
];

const Home = () => {
  const [serviceCounts, setServiceCounts] = useState<Record<string,number>>({})
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long'
  });

  useEffect(() => {
    fetchServiceUsage()
  }, []);

  /** Fetch all professionals and group them by serviceType */
  const fetchServiceUsage = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(
        'https://server.sivagroupmanpower.com/api/v1/registration-form',
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const json = await res.json()
      const profs: Array<{ serviceType: string }> = json.data || []

      // init counts
      const counts: Record<string,number> = {}
      serviceList.forEach(s => counts[s] = 0)

      // tally
      profs.forEach(p => {
        if (p.serviceType && counts[p.serviceType] !== undefined) {
          counts[p.serviceType] += 1
        }
      })
      setServiceCounts(counts)

    } catch (err) {
      console.error("Error loading service usage", err)
    }
  }

  // const salesComparisonData = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
  //   datasets: [{
  //     label: 'Sales',
  //     data: [20, 28, 10, 45, 30, 35, 18],
  //     backgroundColor: '#98E165',
  //   }]
  // };

  // const revenueTrackData = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  //   datasets: [{
  //     label: 'Revenue',
  //     data: [18, 38, 35, 45, 28, 38, 35],
  //     backgroundColor: '#FFD700',
  //   }]
  // };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Hi XYZ, Welcome to your Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -ml-2 -mt-3">
              1
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">120</h2>
                <p className="text-gray-600">Total Man Power</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">4120</h2>
                <p className="text-gray-600">Toal Users</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">24</h2>
                <p className="text-gray-600">Approved Manpower</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">32</h2>
                <p className="text-gray-600">Rejected Manpower</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Usage Section */}
      <Card className="bg-white rounded-lg shadow mb-6">
        <CardHeader>
          <CardTitle>Service Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          {serviceList.map(service => (
            <div
              key={service}
              className="flex flex-col items-center justify-center border border-gray-100 p-4 rounded"
            >
              <span className="text-2xl font-bold">
                {serviceCounts[service] ?? 0}
              </span>
              <span className="text-gray-600 text-center">{service}</span>
            </div>
          ))}
        </CardContent>
      </Card>

    

      {/* Orders Table */}
      <Card className="bg-white rounded-lg shadow">
        <CardContent className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-2">SN</th>
                <th className="py-2">Order ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Product</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date & time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, orderId: '0A123', name: 'Rathore', product: 'Dress', status: 'Delivered', date: '10/11/2023, 14:23' },
                { id: 2, orderId: '0A123', name: 'Rathore', product: 'Dress', status: 'Delivered', date: '10/11/2023, 14:23' },
                { id: 3, orderId: '0A123', name: 'Rathore', product: 'Bag', status: 'Pending', date: '10/11/2023, 14:23' },
                { id: 4, orderId: '0A123', name: 'Rathore', product: 'Dress', status: 'Cancelled', date: '10/11/2023, 14:23' },
                { id: 5, orderId: '0A123', name: 'Rathore', product: 'Bags', status: 'Delivered', date: '10/11/2023, 14:23' },
              ].map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.orderId}</td>
                  <td className="py-2">{order.name}</td>
                  <td className="py-2">{order.product}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
