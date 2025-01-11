import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const response = await authApi.post('/users/register', values);
        setAuth(response.data.user, response.data.token);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="sr-only">
                  First name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  error={formik.touched.first_name ? formik.errors.first_name : undefined}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="sr-only">
                  Last name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  error={formik.touched.last_name ? formik.errors.last_name : undefined}
                />
              </div>
            </div>
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
              Create account
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};