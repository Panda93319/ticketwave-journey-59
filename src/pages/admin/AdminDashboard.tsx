
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  User, 
  LogOut, 
  Settings, 
  Home, 
  LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/login');
      return;
    }

    // Fetch users and orders
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users`, { headers }),
          axios.get(`${API_URL}/admin/orders`, { headers })
        ]);

        setUsers(usersRes.data.users);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 mt-1">Manage your concert platform</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button 
                onClick={() => navigateTo('/')}
                variant="outline" 
                className="border-gray-700 hover:bg-gray-800"
              >
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
              <Button 
                onClick={handleLogout}
                variant="destructive" 
                className="bg-red-900 hover:bg-red-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <Card className="md:col-span-3 bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-6 px-5 ${activeTab === 'overview' ? 'bg-gray-700/50' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Overview
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-6 px-5 ${activeTab === 'users' ? 'bg-gray-700/50' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Users
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-6 px-5 ${activeTab === 'orders' ? 'bg-gray-700/50' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start rounded-none py-6 px-5 ${activeTab === 'settings' ? 'bg-gray-700/50' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="overview" className="p-0 border-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card className="bg-blue-900/20 border-blue-700/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-blue-300">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white">{users.length}</div>
                          <Users className="absolute top-4 right-4 h-8 w-8 text-blue-400/40" />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-900/20 border-purple-700/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-purple-300">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white">{orders.length}</div>
                          <ShoppingCart className="absolute top-4 right-4 h-8 w-8 text-purple-400/40" />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-green-900/20 border-green-700/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-green-300">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white">
                            ${orders.reduce((sum, order: any) => sum + parseFloat(order.amount), 0).toFixed(2)}
                          </div>
                          <CreditCard className="absolute top-4 right-4 h-8 w-8 text-green-400/40" />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription className="text-gray-400">
                          Latest 5 orders across the platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-4 py-3 text-left text-gray-400">Order ID</th>
                                <th className="px-4 py-3 text-left text-gray-400">User</th>
                                <th className="px-4 py-3 text-left text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-left text-gray-400">Payment Type</th>
                                <th className="px-4 py-3 text-left text-gray-400">Status</th>
                                <th className="px-4 py-3 text-left text-gray-400">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map((order: any) => (
                                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                  <td className="px-4 py-3 text-white">#{order.id}</td>
                                  <td className="px-4 py-3 text-white">{order.user_email}</td>
                                  <td className="px-4 py-3 text-white">${parseFloat(order.amount).toFixed(2)}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.payment_type === 'oneTime' ? 'bg-blue-900/20 text-blue-300' : 'bg-purple-900/20 text-purple-300'
                                    }`}>
                                      {order.payment_type === 'oneTime' ? 'One Time' : 'Installment'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.status === 'active' ? 'bg-green-900/20 text-green-300' :
                                      order.status === 'completed' ? 'bg-blue-900/20 text-blue-300' :
                                      order.status === 'cancelled' ? 'bg-red-900/20 text-red-300' :
                                      'bg-yellow-900/20 text-yellow-300'
                                    }`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-300">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="users" className="p-0 border-none">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage registered users
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-4 py-3 text-left text-gray-400">ID</th>
                                <th className="px-4 py-3 text-left text-gray-400">Name</th>
                                <th className="px-4 py-3 text-left text-gray-400">Email</th>
                                <th className="px-4 py-3 text-left text-gray-400">Verified</th>
                                <th className="px-4 py-3 text-left text-gray-400">Admin</th>
                                <th className="px-4 py-3 text-left text-gray-400">Registered</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user: any) => (
                                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                  <td className="px-4 py-3 text-white">#{user.id}</td>
                                  <td className="px-4 py-3 text-white">{user.name}</td>
                                  <td className="px-4 py-3 text-white">{user.email}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      user.is_email_verified ? 'bg-green-900/20 text-green-300' : 'bg-yellow-900/20 text-yellow-300'
                                    }`}>
                                      {user.is_email_verified ? 'Verified' : 'Pending'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      user.is_admin ? 'bg-purple-900/20 text-purple-300' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                      {user.is_admin ? 'Admin' : 'User'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-300">
                                    {new Date(user.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="p-0 border-none">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle>Order Management</CardTitle>
                        <CardDescription className="text-gray-400">
                          View and manage all orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-4 py-3 text-left text-gray-400">Order ID</th>
                                <th className="px-4 py-3 text-left text-gray-400">Customer</th>
                                <th className="px-4 py-3 text-left text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-left text-gray-400">Payment Type</th>
                                <th className="px-4 py-3 text-left text-gray-400">Status</th>
                                <th className="px-4 py-3 text-left text-gray-400">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order: any) => (
                                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                                  <td className="px-4 py-3 text-white">#{order.id}</td>
                                  <td className="px-4 py-3">
                                    <div className="text-white">{order.user_name}</div>
                                    <div className="text-gray-400 text-xs">{order.user_email}</div>
                                  </td>
                                  <td className="px-4 py-3 text-white">${parseFloat(order.amount).toFixed(2)}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.payment_type === 'oneTime' ? 'bg-blue-900/20 text-blue-300' : 'bg-purple-900/20 text-purple-300'
                                    }`}>
                                      {order.payment_type === 'oneTime' ? 'One Time' : 'Installment'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.status === 'active' ? 'bg-green-900/20 text-green-300' :
                                      order.status === 'completed' ? 'bg-blue-900/20 text-blue-300' :
                                      order.status === 'cancelled' ? 'bg-red-900/20 text-red-300' :
                                      'bg-yellow-900/20 text-yellow-300'
                                    }`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-300">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="p-0 border-none">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle>Admin Settings</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage your admin account and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-medium text-white">{user?.name}</h3>
                              <p className="text-gray-400">{user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              onClick={() => navigateTo('/admin/register')}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Register New Admin
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
