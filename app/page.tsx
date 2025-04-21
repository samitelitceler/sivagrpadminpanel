"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
import { BellIcon, ShoppingBag, Users, DollarSign, LineChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// interface SalonDistribution {
//   _count: {
//     salonID: number;
//   };
//   verification: string;
// }

// interface DashboardData {
//   overview: {
//     totalSalons: {
//       count: number;
//       distribution: SalonDistribution[];
//     };
//     totalUsers: number;
//     totalBookings: {
//       count: number;
//     };
//     totalRevenue: number;
//   };
//   charts: {
//     monthlyRevenue: {
//       month: string;
//       revenue: number;
//     }[];
//   };
//   totalOrders: number;
//   monthlySales: number;
//   totalCustomers: number;
//   dailyRevenue: number;
//   salesData: {
//     labels: string[];
//     values: number[];
//   };
//   revenueData: {
//     labels: string[];
//     values: number[];
//   };
//   recentOrders: Array<{
//     id: number;
//     orderId: string;
//     name: string;
//     product: string;
//     status: 'Delivered' | 'Pending' | 'Cancelled';
//     date: string;
//   }>;
// }


const Home = () => {
  // const router = useRouter();
  // const [loading, setLoading] = useState(true);
  // const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  // const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long'
  });

  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   if (!token) {
  //     router.push("/login");
  //   } else {
  //     // fetchDashboardData();
  //     // fetchTodayStats();
  //   }
  // }, []);

  // const fetchDashboardData = async () => {
  //   const token = Cookies.get("token");
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     // const data = await response.json();
  //     // setDashboardData(data.data);
  //   } catch (error) {
  //     console.error('Error fetching dashboard data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchTodayStats = async () => {
  //   // const token = Cookies.get("token");
  //   try {
  //     // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard/today-stats`, {
  //     //   headers: {
  //     //     'Authorization': `Bearer ${token}`
  //     //   }
  //     // });
  //     // const data = await response.json();
  //     // setTodayStats(data.data.summary);
  //   } catch (error) {
  //     console.error('Error fetching today\'s stats:', error);
  //   }
  // };

  // const revenueData = {
  //   labels: ["Pending", "Approved", "Rejected"],
  //   datasets: [
  //     {
  //       data: [
  //         dashboardData?.overview.totalSalons.distribution.find((d: SalonDistribution) => d.verification === "PENDING")?._count.salonID || 0,
  //         dashboardData?.overview.totalSalons.distribution.find((d: SalonDistribution) => d.verification === "APPROVED")?._count.salonID || 0,
  //         dashboardData?.overview.totalSalons.distribution.find((d: SalonDistribution) => d.verification === "REJECTED")?._count.salonID || 0,
  //       ],
  //       backgroundColor: ["#E8F1FD", "#013DC0", "#FF5733"],
  //     },
  //   ],
  // };

  // const totalRevenueData = {
  //   labels: dashboardData?.charts.monthlyRevenue.map((item) => item.month) || [],
  //   datasets: [
  //     {
  //       label: "Monthly Revenue",
  //       data: dashboardData?.charts.monthlyRevenue.map((item) => item.revenue) || [],
  //       backgroundColor: "#013DC0",
  //     },
  //   ],
  // };

  const salesComparisonData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sales',
      data: [20, 28, 10, 45, 30, 35, 18],
      backgroundColor: '#98E165',
    }]
  };

  const revenueTrackData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue',
      data: [18, 38, 35, 45, 28, 38, 35],
      backgroundColor: '#FFD700',
    }]
  };

  // if (loading) return <p className="text-center mt-20">Loading...</p>;

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
                <p className="text-gray-600">Total Orders Today</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">4120</h2>
                <p className="text-gray-600">Monthly Sales</p>
              </div>
              <LineChart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">24</h2>
                <p className="text-gray-600">Total Customers Today</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">32k</h2>
                <p className="text-gray-600">Daily Revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle>Sales Comparison Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={salesComparisonData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle>Revenue Track</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={revenueTrackData} options={{ responsive: true }} />
          </CardContent>
        </Card>
      </div>

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
