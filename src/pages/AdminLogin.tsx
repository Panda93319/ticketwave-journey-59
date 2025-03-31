
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
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, loading } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    const redirectPath = await adminLogin(data.email, data.password);
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
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">
              Access the administrator dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder="Enter your password"
                  type="password"
                  icon="Lock"
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login as Admin'}
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

export default AdminLogin;
