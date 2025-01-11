import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { EventsPage } from '@/pages/events/EventsPage'
import { useAuthStore } from '@/stores/authStore'
import { CreateEventPage } from '@/pages/events/CreateEventPage'
import { EventDetailsPage } from '@/pages/events/EventDetailsPage'
import { EditEventPage } from '@/pages/events/EditEventPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'

const queryClient = new QueryClient()

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user)
  return user ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Navigate to="/events" replace />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <MainLayout>
                <EventsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateEventPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EventDetailsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditEventPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App 