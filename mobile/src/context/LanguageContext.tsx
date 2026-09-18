import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'uz' | 'ru' | 'en';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
    en: string;
  };
}

export const translations: Translations = {
  appTitle: { uz: 'EduFlow', ru: 'EduFlow', en: 'EduFlow' },
  appTagline: { uz: 'Taʼlim boshqaruv tizimi', ru: 'Система управления обучением', en: 'Education Management System' },
  login: { uz: 'Kirish', ru: 'Войти', en: 'Login' },
  logout: { uz: 'Chiqish', ru: 'Выйти', en: 'Logout' },
  register: { uz: "Ro'yxatdan o'tish", ru: 'Регистрация', en: 'Register' },
  email: { uz: 'Email manzili', ru: 'Электронная почта', en: 'Email address' },
  password: { uz: 'Parol', ru: 'Пароль', en: 'Password' },
  dashboard: { uz: 'Boshqaruv', ru: 'Панель', en: 'Dashboard' },
  students: { uz: 'Talabalar', ru: 'Студенты', en: 'Students' },
  teachers: { uz: "O'qituvchilar", ru: 'Преподаватели', en: 'Teachers' },
  groups: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' },
  courses: { uz: 'Kurslar', ru: 'Курсы', en: 'Courses' },
  attendance: { uz: 'Davomat', ru: 'Посещаемость', en: 'Attendance' },
  schedule: { uz: 'Jadval', ru: 'Расписание', en: 'Schedule' },
  finance: { uz: 'Moliya', ru: 'Финансы', en: 'Finance' },
  grades: { uz: 'Baholar', ru: 'Оценки', en: 'Grades' },
  homework: { uz: 'Vazifalar', ru: 'Задания', en: 'Homework' },
  profile: { uz: 'Profil', ru: 'Профиль', en: 'Profile' },
  settings: { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' },
  quickDemoLogin: { uz: 'Tezkor demo kirish', ru: 'Быстрый демо-вход', en: 'Quick Demo Login' },
  searchPlaceholder: { uz: 'Qidirish...', ru: 'Поиск...', en: 'Search...' },
  todaySchedule: { uz: 'Bugungi darslar', ru: 'Уроки на сегодня', en: "Today's Classes" },
  recentGrades: { uz: 'Oxirgi baholar', ru: 'Последние оценки', en: 'Recent Grades' },
  myChild: { uz: 'Mening farzandim', ru: 'Мой ребенок', en: 'My Child' },
  attendanceRate: { uz: 'Davomat ko‘rsatkichi', ru: 'Посещаемость', en: 'Attendance Rate' },
  totalBalance: { uz: 'Hisob balansi', ru: 'Баланс', en: 'Balance' },
  statusActive: { uz: 'Faol', ru: 'Активен', en: 'Active' },
  statusPending: { uz: 'To‘lov kutilmoqda', ru: 'Ожидает оплаты', en: 'Payment Pending' },
  statusInactive: { uz: 'Nofaol', ru: 'Неактивен', en: 'Inactive' },
  markPresent: { uz: 'Bor', ru: 'Был', en: 'Present' },
  markAbsent: { uz: 'Yo‘q', ru: 'Нет', en: 'Absent' },
  markLate: { uz: 'Kechikdi', ru: 'Опоздал', en: 'Late' },
  saveSuccess: { uz: 'Muvaffaqiyatli saqlandi!', ru: 'Успешно сохранено!', en: 'Saved successfully!' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    AsyncStorage.getItem('eduflow_lang').then((saved) => {
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        setLanguageState(saved as Language);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('eduflow_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
