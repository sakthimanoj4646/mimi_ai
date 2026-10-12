import React from 'react';
import { useSettings } from './context/SettingsContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';

// 20 Application Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AIVideoCreateScreen } from './screens/AIVideoCreateScreen';
import { VideoUploadScreen } from './screens/VideoUploadScreen';
import { MultiClipScreen } from './screens/MultiClipScreen';
import { VideoEditingWorkspace } from './screens/VideoEditingWorkspace';
import { VideoEnhanceScreen } from './screens/VideoEnhanceScreen';
import { MimiChatScreen } from './screens/MimiChatScreen';
import { PlanReviewScreen } from './screens/PlanReviewScreen';
import { VideoPreviewScreen } from './screens/VideoPreviewScreen';
import { ExportScreen } from './screens/ExportScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { ProjectDetailsScreen } from './screens/ProjectDetailsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';

export const App: React.FC = () => {
  const { currentScreen } = useSettings();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'forgot_password':
        return <ForgotPasswordScreen />;
      case 'home':
        return <HomeScreen />;
      case 'ai_create':
        return <AIVideoCreateScreen />;
      case 'video_upload':
        return <VideoUploadScreen />;
      case 'multi_clip':
        return <MultiClipScreen />;
      case 'editing_workspace':
        return <VideoEditingWorkspace />;
      case 'enhancement':
        return <VideoEnhanceScreen />;
      case 'mimi_chat':
        return <MimiChatScreen />;
      case 'plan_review':
        return <PlanReviewScreen />;
      case 'video_preview':
        return <VideoPreviewScreen />;
      case 'export':
        return <ExportScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'project_details':
        return <ProjectDetailsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'help_support':
        return <HelpSupportScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isFullscreenScreen = ['splash', 'onboarding', 'login', 'register', 'forgot_password'].includes(currentScreen);

  if (isFullscreenScreen) {
    return (
      <div className="min-h-screen bg-ocean-950 text-white font-sans antialiased selection:bg-cyan-neon selection:text-ocean-950">
        <ToastContainer />
        {renderScreen()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-950 text-white font-sans antialiased selection:bg-cyan-neon selection:text-ocean-950 flex flex-col">
      <ToastContainer />
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
