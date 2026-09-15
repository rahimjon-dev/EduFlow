import React, { useState } from 'react';
import { Save, Shield, Bell, Building, Lock } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
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
    { id: 'general', label: t('settings.general') },
    { id: 'notifications', label: t('settings.notifications') },
    { id: 'permissions', label: t('settings.permissions') },
    { id: 'api', label: t('settings.api') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.desc')}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
            {saved ? t('settings.changesSaved') : t('settings.saveSettings')}
          </Button>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              {t('settings.orgIdentity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
              <Input
                label={t('settings.institutionName')}
                value={generalForm.institutionName}
                onChange={(e) => setGeneralForm({ ...generalForm, institutionName: e.target.value })}
              />
              <Input
                label={t('settings.tagline')}
                value={generalForm.tagline}
                onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('settings.contactEmail')}
                  value={generalForm.contactEmail}
                  onChange={(e) => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                />
                <Input
                  label={t('settings.phone')}
                  value={generalForm.phone}
                  onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label={t('settings.timezone')}
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
                  label={t('settings.currency')}
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
              {t('settings.alertPreferences')}
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
                  <p className="text-xs font-semibold text-slate-900">{t('settings.absenceAlerts')}</p>
                  <p className="text-xs text-slate-500">{t('settings.absenceAlertsDesc')}</p>
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
                  <p className="text-xs font-semibold text-slate-900">{t('settings.examAlerts')}</p>
                  <p className="text-xs text-slate-500">{t('settings.examAlertsDesc')}</p>
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
                  <p className="text-xs font-semibold text-slate-900">{t('settings.tuitionAlerts')}</p>
                  <p className="text-xs text-slate-500">{t('settings.tuitionAlertsDesc')}</p>
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
              {t('settings.roleMatrix')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead>
                  <tr className="text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5">{t('settings.capability')}</th>
                    <th className="py-2.5">{t('roles.admin')}</th>
                    <th className="py-2.5">{t('roles.teacher')}</th>
                    <th className="py-2.5">{t('roles.student')}</th>
                    <th className="py-2.5">{t('roles.parent')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 font-medium">{t('settings.capManage')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.fullAccess')}</td>
                    <td className="text-slate-400">{t('settings.viewOnly')}</td>
                    <td className="text-slate-400">{t('settings.restricted')}</td>
                    <td className="text-slate-400">{t('settings.restricted')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">{t('settings.capAttendance')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.fullAccess')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.assignedCohorts')}</td>
                    <td className="text-slate-400">{t('settings.viewSelf')}</td>
                    <td className="text-slate-400">{t('settings.viewChild')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">{t('settings.capGrading')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.fullAccess')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.assignedCohorts')}</td>
                    <td className="text-slate-400">{t('settings.submitWork')}</td>
                    <td className="text-slate-400">{t('settings.viewReports')}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">{t('settings.capFinance')}</td>
                    <td className="text-emerald-600 font-bold">{t('settings.fullAccess')}</td>
                    <td className="text-slate-400">{t('settings.restricted')}</td>
                    <td className="text-slate-400">{t('settings.payInvoices')}</td>
                    <td className="text-slate-400">{t('settings.payInvoices')}</td>
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
              {t('settings.apiGuide')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600">
            <p className="leading-relaxed">
              {t('settings.apiDesc1')}
            </p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs">
              VITE_API_BASE_URL=https://api.yourdomain.com/v1
            </div>
            <p className="leading-relaxed">
              {t('settings.apiDesc2')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
