
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AuthFormField } from '@/components/auth/FormField';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  adminSecret: z.string().min(1, 'Admin secret key is required'),
});

type FormValues = z.infer<typeof formSchema>;

const AdminRegister = () => {
  const navigate = useNavigate();
  const { adminRegister, loading } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      adminSecret: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    const redirectPath = await adminRegister(data.name, data.email, data.password, data.adminSecret);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Admin Registration</CardTitle>
            <CardDescription className="text-gray-400">
              Create a new administrator account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AuthFormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                  icon="User"
                />
                
                <AuthFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="admin@example.com"
                  type="email"
                  icon="Mail"
                />
                
                <AuthFormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Create a secure password"
                  type="password"
                  icon="Lock"
                />
                
                <AuthFormField
                  control={form.control}
                  name="adminSecret"
                  label="Admin Secret Key"
                  placeholder="Enter admin secret key"
                  type="password"
                  icon="Lock"
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register as Admin'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminRegister;
