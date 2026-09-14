import React, { useState } from 'react';
import { Save, Shield, Bell, Building, Lock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [generalForm, setGeneralForm] = useState({
    institutionName: 'EduFlow International Academy of Technology',
    tagline: 'Excellence in Modern Engineering and Design',
    contactEmail: 'admissions@eduflow.edu',
    phone: '+1 (555) 019-2831',
    timezone: 'America/New_York (UTC-05:00)',
    currency: 'USD ($)',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAttendanceAlerts: true,
    smsExamReminders: true,
    weeklyDigest: false,
    tuitionOverdueNotices: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General Institution' },
    { id: 'notifications', label: 'Notification Alerts' },
    { id: 'permissions', label: 'Role Permissions & Access' },
    { id: 'api', label: 'Backend REST API Integration' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Settings & Configuration"
        description="Configure organization details, localization, communication channels, and security policies."
        actions={
          <Button variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
            {saved ? 'Changes Saved!' : 'Save Settings'}
          </Button>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              Organization Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
              <Input
                label="Institution Name"
                value={generalForm.institutionName}
                onChange={(e) => setGeneralForm({ ...generalForm, institutionName: e.target.value })}
              />
              <Input
                label="Motto / Tagline"
                value={generalForm.tagline}
                onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Official Contact Email"
                  value={generalForm.contactEmail}
                  onChange={(e) => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                />
                <Input
                  label="Switchboard Phone"
                  value={generalForm.phone}
                  onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Campus Primary Timezone"
                  value={generalForm.timezone}
                  onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                  options={[
                    { value: 'America/New_York (UTC-05:00)', label: 'Eastern Time (US & Canada)' },
                    { value: 'America/Chicago (UTC-06:00)', label: 'Central Time (US & Canada)' },
                    { value: 'America/Los_Angeles (UTC-08:00)', label: 'Pacific Time (US & Canada)' },
                    { value: 'Europe/London (UTC+00:00)', label: 'London, Edinburgh, GMT' },
                  ]}
                />
                <Select
                  label="Tuition Currency"
                  value={generalForm.currency}
                  onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
                  options={[
                    { value: 'USD ($)', label: 'USD ($) United States Dollar' },
                    { value: 'EUR (€)', label: 'EUR (€) Euro' },
                    { value: 'GBP (£)', label: 'GBP (£) British Pound' },
                  ]}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              Automated Alert Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-w-2xl">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAttendanceAlerts}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, emailAttendanceAlerts: e.target.checked })
                  }
                  className="mt-1 rounded text-indigo-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Guardian Attendance Absence Alerts</p>
                  <p className="text-xs text-slate-500">Send instant email notice when a student is marked Absent without excuse.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.smsExamReminders}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, smsExamReminders: e.target.checked })
                  }
                  className="mt-1 rounded text-indigo-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">SMS Upcoming Examination Notices</p>
                  <p className="text-xs text-slate-500">Notify enrolled students 48 hours before scheduled midterm or final test dates.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.tuitionOverdueNotices}
                  onChange={(e) =>
                    setNotificationSettings({ ...notificationSettings, tuitionOverdueNotices: e.target.checked })
                  }
                  className="mt-1 rounded text-indigo-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Overdue Tuition Reminders</p>
                  <p className="text-xs text-slate-500">Automate friendly fee balance notifications for pending invoice installments.</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Role Permissions Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead>
                  <tr className="text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5">System Capability</th>
                    <th className="py-2.5">Admin</th>
                    <th className="py-2.5">Teacher</th>
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Parent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 font-medium">Manage Students, Teachers & Courses</td>
                    <td className="text-emerald-600 font-bold">Full Access</td>
                    <td className="text-slate-400">View Only</td>
                    <td className="text-slate-400">Restricted</td>
                    <td className="text-slate-400">Restricted</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Record Attendance Rolls</td>
                    <td className="text-emerald-600 font-bold">Full Access</td>
                    <td className="text-emerald-600 font-bold">Assigned Cohorts</td>
                    <td className="text-slate-400">View Self</td>
                    <td className="text-slate-400">View Child</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Grade Exams & Assign Homework</td>
                    <td className="text-emerald-600 font-bold">Full Access</td>
                    <td className="text-emerald-600 font-bold">Assigned Cohorts</td>
                    <td className="text-slate-400">Submit Work</td>
                    <td className="text-slate-400">View Reports</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Tuition Invoicing & Financial Reports</td>
                    <td className="text-emerald-600 font-bold">Full Access</td>
                    <td className="text-slate-400">Restricted</td>
                    <td className="text-slate-400">Pay Invoices</td>
                    <td className="text-slate-400">Pay Invoices</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              REST API Connectivity Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600">
            <p className="leading-relaxed">
              EduFlow frontend is architected with strict decoupling between UI components and data providers.
              When connecting your backend REST API, configure your environment variable:
            </p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
              VITE_API_BASE_URL=https://api.yourdomain.com/v1
            </div>
            <p className="leading-relaxed">
              All services located in <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">src/services/*.service.ts</code>
              support one-line transition to <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">apiClient.get()</code>,
              <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">apiClient.post()</code>, etc. without modifying any React page components.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
