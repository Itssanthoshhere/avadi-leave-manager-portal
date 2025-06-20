
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import AdminDashboard from '@/components/AdminDashboard';

export interface LeaveRequest {
  id: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  adminRemarks?: string;
}

export interface Employee {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  pno: string;
  name: string;
  role: 'admin' | 'employee';
  employees?: Employee[];
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (pno: string, password: string) => {
    setIsLoading(true);
    
    // Simulate authentication - in real app this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    const mockUsers = [
      { 
        id: '1', 
        pno: '1001', 
        name: 'Admin User', 
        role: 'admin' as const, 
        password: 'admin123',
        employees: [
          { id: '2001', name: 'John Doe', status: 'active' as const },
          { id: '2002', name: 'Jane Smith', status: 'active' as const },
          { id: '2003', name: 'Bob Wilson', status: 'inactive' as const },
        ]
      },
      { id: '2', pno: '2001', name: 'John Doe', role: 'employee' as const, password: 'emp123' },
      { id: '3', pno: '2002', name: 'Jane Smith', role: 'employee' as const, password: 'emp123' },
    ];
    
    const foundUser = mockUsers.find(u => u.pno === pno && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} />;
  }

  return user.role === 'admin' ? (
    <AdminDashboard user={user} onLogout={handleLogout} />
  ) : (
    <EmployeeDashboard user={user} onLogout={handleLogout} />
  );
};

export default Index;
