import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function LanguageTestView() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            🌍 {t('common.appName')} - {t('language.selectLanguage')}
          </h1>
          <p className="text-lg font-semibold text-slate-600">
            Test internationalization (i18n) feature
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Switcher */}
          <div className="lg:col-span-1">
            <LanguageSwitcher />
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Common Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">📝 {t('common.appName')} - Common</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-semibold text-slate-600">Loading:</span>
                  <p className="text-base font-bold text-slate-900">{t('common.loading')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-semibold text-slate-600">Save:</span>
                  <p className="text-base font-bold text-slate-900">{t('common.save')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-semibold text-slate-600">Cancel:</span>
                  <p className="text-base font-bold text-slate-900">{t('common.cancel')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-semibold text-slate-600">Submit:</span>
                  <p className="text-base font-bold text-slate-900">{t('common.submit')}</p>
                </div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">🔐 Authentication</h2>
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900">{t('auth.welcome')}</p>
                <p className="text-base font-semibold text-slate-700">{t('auth.loginTitle')}</p>
                <p className="text-base font-semibold text-slate-700">{t('auth.registerTitle')}</p>
                <p className="text-sm font-semibold text-slate-600">{t('auth.loginWithGoogle')}</p>
              </div>
            </div>

            {/* Dashboard Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">📊 {t('dashboard.title')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-sm font-semibold text-emerald-700">Breakfast:</span>
                  <p className="text-base font-bold text-emerald-900">{t('dashboard.breakfast')}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-sm font-semibold text-amber-700">Lunch:</span>
                  <p className="text-base font-bold text-amber-900">{t('dashboard.lunch')}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-semibold text-blue-700">Dinner:</span>
                  <p className="text-base font-bold text-blue-900">{t('dashboard.dinner')}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-semibold text-purple-700">Snacks:</span>
                  <p className="text-base font-bold text-purple-900">{t('dashboard.snacks')}</p>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">👤 {t('profile.title')}</h2>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-700">
                  {t('profile.gender')}: {t('profile.male')} / {t('profile.female')}
                </p>
                <p className="text-base font-semibold text-slate-700">
                  {t('profile.height')} / {t('profile.weight')} / {t('profile.targetWeight')}
                </p>
                <p className="text-base font-semibold text-slate-700">
                  {t('profile.goal')}: {t('profile.gainWeight')} / {t('profile.loseWeight')} / {t('profile.maintain')}
                </p>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">💬 {t('feedback.title')}</h2>
              <p className="text-base font-semibold text-slate-700 mb-3">{t('feedback.description')}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-red-50 rounded text-sm font-semibold text-red-900">
                  {t('feedback.types.wrong_image')}
                </div>
                <div className="p-2 bg-orange-50 rounded text-sm font-semibold text-orange-900">
                  {t('feedback.types.abnormal_macro')}
                </div>
                <div className="p-2 bg-yellow-50 rounded text-sm font-semibold text-yellow-900">
                  {t('feedback.types.not_working')}
                </div>
                <div className="p-2 bg-green-50 rounded text-sm font-semibold text-green-900">
                  {t('feedback.types.ui_glitch')}
                </div>
              </div>
            </div>

            {/* Admin Section */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h2 className="text-xl font-black text-slate-900 mb-4">⚙️ {t('admin.title')}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                  {t('admin.users')}
                </span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                  {t('admin.foods')}
                </span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                  {t('admin.feedback')}
                </span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                  {t('admin.statistics')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Language Switcher Demo */}
        <div className="mt-8 bg-white rounded-2xl border-2 border-slate-200 p-6">
          <h2 className="text-xl font-black text-slate-900 mb-4">🎨 Compact Language Switcher (for Header/Navbar)</h2>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <span className="text-sm font-semibold text-slate-700">Preview:</span>
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
