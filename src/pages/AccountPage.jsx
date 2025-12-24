import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AccountPage = () => {
  const authContext = useAuth();
  const { 
    user,
    profile,
    signOut,
    rewardTasks, 
    completeTask, 
    getTotalPoints, 
    getCompletedTasksCount,
    getPendingTasks 
  } = authContext;


  const [activeTab, setActiveTab] = useState('earn-points');
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleCompleteTask = async (taskId) => {
    const result = await completeTask(taskId);
    if (result.success) {
      setShowTaskModal(null);
    } else {
      console.error('Failed to complete task:', result.error);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setIsSavingSettings(true);
    try {
      // Change language in the interface immediately
      changeLanguage(newLanguage);
      
      // Save to user profile (you'll need to implement this in your database hooks)
      // For now, we'll just store it locally
      localStorage.setItem('userPreferredLanguage', newLanguage);
      
    } catch (error) {
      console.error('Error saving language preference:', error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Backup logout function
  const handleDirectLogout = async () => {
    try {
      console.log('Direct logout started');
      setIsLoggingOut(true);
      
      await supabase.auth.signOut();
      
      // Clear localStorage
      localStorage.removeItem('userPreferredLanguage');
      localStorage.removeItem('authRedirect');
      
      console.log('Direct logout completed');
      navigate('/');
    } catch (error) {
      console.error('Direct logout error:', error);
      // Force clear session and navigate
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getDisplayName = () => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getAvatarUrl = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  const TaskModal = ({ task, onClose, onComplete }) => {
    if (!task) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">
                +{task.points} {t('points')}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => onComplete(task.id)}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                {t('complete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (!user && authContext.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка аккаунта... / Loading account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Добро пожаловать!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Войдите в свой аккаунт, чтобы отслеживать заказы, накапливать баллы и получать персональные скидки
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => authContext?.openAuthModal?.('login')}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Войти в аккаунт
              </button>
              
              <button
                onClick={() => authContext?.openAuthModal?.('signup')}
                className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Создать новый аккаунт
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full text-gray-500 py-2 px-6 rounded-xl font-medium hover:text-gray-700 transition-colors"
              >
                Продолжить покупки
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Новые клиенты получают <span className="font-semibold text-blue-600">100 бонусных баллов</span> при регистрации!
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header with Account Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('hello') || (currentLanguage === 'ru' ? 'Привет' : 'Hello')}, {getDisplayName()}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('loyaltyProgramMember') || (currentLanguage === 'ru' ? 'Вы теперь часть нашей программы лояльности' : 'You are now part of our loyalty program')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-500">KZT | USD</span>
              </div>
              <button
                onClick={() => {
                  // IMMEDIATE EMERGENCY LOGOUT - bypass all errors
                  try {
                    console.log('EMERGENCY LOGOUT STARTED');
                    
                    // Clear everything immediately
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Force page reload to root
                    window.location.href = window.location.origin;
                  } catch (e) {
                    // If even this fails, just reload
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 border border-red-600 rounded"
              >
                ⚡ ВЫЙТИ СЕЙЧАС
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Points Display */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            {t('yourPointsAvailableForRedemption') || (currentLanguage === 'ru' ? 'Ваши баллы доступные для использования' : 'Your points available for redemption')}:
          </p>
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {getTotalPoints()} {t('points') || (currentLanguage === 'ru' ? 'баллов' : 'points')}
          </div>
          <p className="text-gray-600">
            {getCompletedTasksCount()} {t('completed') || (currentLanguage === 'ru' ? 'выполнено' : 'completed')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { 
                key: 'your-rewards', 
                label: t('yourRewards') || (currentLanguage === 'ru' ? 'Ваши награды' : 'Your Rewards') 
              },
              { 
                key: 'rewards', 
                label: t('rewards') || (currentLanguage === 'ru' ? 'Награды' : 'Rewards') 
              },
              { 
                key: 'earn-points', 
                label: t('earnPoints') || (currentLanguage === 'ru' ? 'Заработать баллы' : 'Earn Points') 
              },
              { 
                key: 'history', 
                label: t('history') || (currentLanguage === 'ru' ? 'История' : 'History') 
              },
              { 
                key: 'faq', 
                label: t('faq') || (currentLanguage === 'ru' ? 'FAQ' : 'FAQ') 
              },
              { 
                key: 'settings', 
                label: t('settings') || (currentLanguage === 'ru' ? 'Настройки' : 'Settings') 
              }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'earn-points' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('earnPoints') || (currentLanguage === 'ru' ? 'Заработать баллы' : 'Earn Points')}
              </h2>
              <p className="text-gray-600">
                {t('earnPointsDescription') || (currentLanguage === 'ru' ? 'Зарабатывайте баллы, выполняя эти действия. Каждое приближает вас к эксклюзивным наградам.' : 'Earn points by completing these actions. Each one brings you closer to exclusive rewards.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Account Creation Task */}
              <div className={`bg-white rounded-lg shadow-sm border ${
                user ? 'border-gray-300 bg-gray-50' : 'border-gray-200'
              } overflow-hidden`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">ACC</span>
                    </div>
                    {user && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {t('completed')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('createAnAccount')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('joinLoyaltyProgram')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">+200 {t('points')}</span>
                    <span className="text-gray-600 text-sm font-medium">
                      {user ? t('completed') : t('available')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward Tasks from Database */}
              {rewardTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg shadow-sm border ${
                    task.completed ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:shadow-md cursor-pointer'
                  } overflow-hidden transition-shadow`}
                  onClick={() => !task.completed && setShowTaskModal(task)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {task.action_type === 'social' ? 'SOC' : 
                           task.action_type === 'birthday' ? 'BD' :
                           task.action_type === 'newsletter' ? 'NEWS' : 'REF'}
                        </span>
                      </div>
                      {task.completed && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {t('completed')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-black font-medium">+{task.points} {t('points')}</span>
                      {!task.completed && (
                        <button className="text-gray-600 text-sm font-medium hover:text-black">
                          {task.action_type === 'social' ? t('follow') : t('complete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Purchase Points */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">SHOP</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {t('automatic')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('makeAPurchase')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('earnPointsOnEveryPurchase')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">+2 {t('pointsPerDollar')}</span>
                    <button className="text-gray-600 text-sm font-medium hover:text-black">
                      {t('learnMore')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'your-rewards' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('yourRewards')}</h2>
              <p className="text-gray-600">{t('redeemEarnedRewards')}</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noRewardsYet')}</h3>
                <p className="text-gray-600 mb-6">{t('youDontHaveAnyClaimedRewards')}</p>
                <button
                  onClick={() => setActiveTab('earn-points')}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {t('earnPoints')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('rewards')}</h2>
              <p className="text-gray-600">{t('availableRewardsToRedeem')}</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('comingSoon')}</h3>
                <p className="text-gray-600">{t('rewardsCatalogComingSoon')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('history')}</h2>
              <p className="text-gray-600">{t('viewPointsHistory')}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{t('recentActivity')}</h3>
                </div>
                <div className="p-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noActivityYet')}</h3>
                  <p className="text-gray-600">{t('completeSomeTasksToSeeHistory')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('faq')}</h2>
              <p className="text-gray-600">{t('frequentlyAskedQuestions')}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Delivery FAQ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('deliveryQuestion')}</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-600 text-xs font-medium">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{t('almatyDelivery')}</p>
                      <p className="text-sm">{t('almatyDeliveryDetails')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-600 text-xs font-medium">O</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{t('otherCitiesDelivery')}</p>
                      <p className="text-sm">
                        {t('otherCitiesDetails')} 
                        <a href="https://kazpochta.kz" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 ml-1 underline">
                          kazpochta.kz
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact FAQ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('additionalQuestions')}</h3>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">{t('contactUsForMoreQuestions')}</p>
                  <a 
                    href="mailto:clowncomm9@gmail.com" 
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    <span>clowncomm9@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Points FAQ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('pointsQuestion')}</h3>
                <div className="space-y-3 text-gray-600">
                  <p>{t('pointsAnswer1')}</p>
                  <p>{t('pointsAnswer2')}</p>
                  <p>{t('pointsAnswer3')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('settings')}</h2>
              <p className="text-gray-600">{t('manageYourAccountSettings')}</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Language Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('languageSettings')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('preferredLanguage')}
                    </label>
                    <select
                      value={currentLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      disabled={isSavingSettings}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('languageSettingsDescription')}
                    </p>
                  </div>
                  
                  {isSavingSettings && (
                    <div className="text-sm text-gray-600">
                      {t('savingSettings')}...
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('accountInformation')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      value={getDisplayName()}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('totalPoints')}
                    </label>
                    <input
                      type="text"
                      value={`${getTotalPoints()} ${t('points')}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={showTaskModal}
        onClose={() => setShowTaskModal(null)}
        onComplete={handleCompleteTask}
      />

      <Footer />
    </div>
  );
};

export default AccountPage; 