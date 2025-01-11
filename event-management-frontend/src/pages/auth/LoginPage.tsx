import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await authApi.post('/users/login', values);
        setAuth(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password ? formik.errors.password : undefined}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={formik.isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}; 