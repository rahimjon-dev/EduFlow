import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Admin Screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { StudentsListScreen } from '../screens/admin/StudentsListScreen';
import { GroupsScreen } from '../screens/admin/GroupsScreen';
import { FinanceScreen } from '../screens/admin/FinanceScreen';

// Teacher Screens
import { TeacherDashboardScreen } from '../screens/teacher/TeacherDashboardScreen';
import { AttendanceScreen } from '../screens/teacher/AttendanceScreen';
import { TeacherHomeworkScreen } from '../screens/teacher/TeacherHomeworkScreen';
import { TeacherGroupsScreen } from '../screens/teacher/TeacherGroupsScreen';

// Student Screens
import { StudentDashboardScreen } from '../screens/student/StudentDashboardScreen';
import { ScheduleScreen } from '../screens/student/ScheduleScreen';
import { GradesScreen } from '../screens/student/GradesScreen';
import { StudentHomeworkScreen } from '../screens/student/StudentHomeworkScreen';

// Parent Screens
import { ParentDashboardScreen } from '../screens/parent/ParentDashboardScreen';
import { ChildAttendanceScreen } from '../screens/parent/ChildAttendanceScreen';
import { ParentPaymentsScreen } from '../screens/parent/ParentPaymentsScreen';

// Common
import { ProfileScreen } from '../screens/common/ProfileScreen';

// Icons
import {
  LayoutDashboard,
  Users,
  Layers,
  DollarSign,
  User as UserIcon,
  CheckSquare,
  BookOpen,
  Calendar,
  Award,
  HeartHandshake,
  CheckCircle2,
  CreditCard,
} from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
};

// Admin Tabs
const AdminTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        title: 'Boshqaruv',
        tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Students"
      component={StudentsListScreen}
      options={{
        title: 'Talabalar',
        tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Groups"
      component={GroupsScreen}
      options={{
        title: 'Guruhlar',
        tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Finance"
      component={FinanceScreen}
      options={{
        title: 'Moliya',
        tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Teacher Tabs
const TeacherTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="TeacherDashboard"
      component={TeacherDashboardScreen}
      options={{
        title: 'Boshqaruv',
        tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Attendance"
      component={AttendanceScreen}
      options={{
        title: 'Davomat',
        tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Homework"
      component={TeacherHomeworkScreen}
      options={{
        title: 'Vazifalar',
        tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="TeacherGroups"
      component={TeacherGroupsScreen}
      options={{
        title: 'Guruhlar',
        tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Student Tabs
const StudentTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="StudentDashboard"
      component={StudentDashboardScreen}
      options={{
        title: 'Kabinet',
        tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Schedule"
      component={ScheduleScreen}
      options={{
        title: 'Jadval',
        tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Grades"
      component={GradesScreen}
      options={{
        title: 'Baholar',
        tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Homework"
      component={StudentHomeworkScreen}
      options={{
        title: 'Vazifalar',
        tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Parent Tabs
const ParentTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="ParentDashboard"
      component={ParentDashboardScreen}
      options={{
        title: 'Farzand',
        tabBarIcon: ({ color, size }) => <HeartHandshake size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="ChildAttendance"
      component={ChildAttendanceScreen}
      options={{
        title: 'Davomat',
        tabBarIcon: ({ color, size }) => <CheckCircle2 size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Payments"
      component={ParentPaymentsScreen}
      options={{
        title: "To'lovlar",
        tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : currentUser?.role === 'ADMIN' ? (
          <Stack.Screen name="AdminApp" component={AdminTabs} />
        ) : currentUser?.role === 'TEACHER' ? (
          <Stack.Screen name="TeacherApp" component={TeacherTabs} />
        ) : currentUser?.role === 'PARENT' ? (
          <Stack.Screen name="ParentApp" component={ParentTabs} />
        ) : (
          <Stack.Screen name="StudentApp" component={StudentTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
