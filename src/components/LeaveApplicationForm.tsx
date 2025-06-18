
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays } from 'lucide-react';
import { LeaveRequest } from './EmployeeDashboard';

interface LeaveApplicationFormProps {
  onSubmit: (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
}

const LeaveApplicationForm = ({ onSubmit }: LeaveApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Casual Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fromDate < today) {
        newErrors.fromDate = 'From date cannot be in the past';
      }

      if (toDate < fromDate) {
        newErrors.toDate = 'To date must be after from date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        fromDate: '',
        toDate: '',
        leaveType: '',
        reason: ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fromDate">From Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fromDate"
              type="date"
              value={formData.fromDate}
              onChange={(e) => handleInputChange('fromDate', e.target.value)}
              className={`pl-10 ${errors.fromDate ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.fromDate && <p className="text-sm text-red-500">{errors.fromDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="toDate">To Date</Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="toDate"
              type="date"
              value={formData.toDate}
              onChange={(e) => handleInputChange('toDate', e.target.value)}
              className={`pl-10 ${errors.toDate ? 'border-red-500' : ''}`}
              min={formData.fromDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.toDate && <p className="text-sm text-red-500">{errors.toDate}</p>}
        </div>
      </div>

      {formData.fromDate && formData.toDate && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Duration:</strong> {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type</Label>
        <Select value={formData.leaveType} onValueChange={(value) => handleInputChange('leaveType', value)}>
          <SelectTrigger className={errors.leaveType ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.leaveType && <p className="text-sm text-red-500">{errors.leaveType}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Leave</Label>
        <Textarea
          id="reason"
          placeholder="Please provide the reason for your leave application..."
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          className={`min-h-[100px] ${errors.reason ? 'border-red-500' : ''}`}
        />
        {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Submit Leave Application
        </Button>
      </div>
    </form>
  );
};

export default LeaveApplicationForm;
