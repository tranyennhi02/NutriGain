# 🌍 NutriGain Internationalization (i18n)

## 📚 Overview

NutriGain supports multiple languages using `react-i18next` and `i18next`.

**Supported Languages:**
- 🇻🇳 Tiếng Việt (Vietnamese) - Default
- 🇬🇧 English
- 🇯🇵 日本語 (Japanese)

---

## 🚀 Quick Start

### 1. Import useTranslation Hook

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('dashboard.overview')}</p>
    </div>
  );
}
```

### 2. Use Translation Keys

Translation keys follow the format: `namespace.key`

```jsx
// Common translations
t('common.save')        // → "Lưu" (vi) / "Save" (en)
t('common.cancel')      // → "Hủy" (vi) / "Cancel" (en)

// Dashboard translations
t('dashboard.breakfast') // → "Bữa sáng" (vi) / "Breakfast" (en)
t('dashboard.lunch')     // → "Bữa trưa" (vi) / "Lunch" (en)

// Profile translations
t('profile.height')      // → "Chiều cao" (vi) / "Height" (en)
t('profile.weight')      // → "Cân nặng" (vi) / "Weight" (en)
```

### 3. Add Language Switcher Component

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher';

function SettingsPage() {
  return (
    <div>
      <h2>Settings</h2>
      {/* Full version with styling */}
      <LanguageSwitcher />
      
      {/* Compact version for header/navbar */}
      <LanguageSwitcher variant="compact" />
    </div>
  );
}
```

### 4. Change Language Programmatically

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };
  
  const switchToVietnamese = () => {
    i18n.changeLanguage('vi');
  };
  
  return (
    <div>
      <button onClick={switchToEnglish}>English</button>
      <button onClick={switchToVietnamese}>Tiếng Việt</button>
    </div>
  );
}
```

---

## 📁 File Structure

```
src/
├── i18n/
│   ├── config.js          # i18next configuration
│   ├── locales/
│   │   ├── vi.json        # Vietnamese translations
│   │   ├── en.json        # English translations
│   │   └── ja.json        # Japanese translations
│   └── README.md          # This file
├── components/
│   └── LanguageSwitcher.jsx  # Language switcher component
└── main.jsx               # Import i18n config here
```

---

## 📝 Adding New Translations

### Step 1: Add Keys to Translation Files

Add the same key to all language files:

**vi.json:**
```json
{
  "myFeature": {
    "title": "Tiêu đề tính năng mới",
    "description": "Mô tả chi tiết"
  }
}
```

**en.json:**
```json
{
  "myFeature": {
    "title": "New Feature Title",
    "description": "Detailed description"
  }
}
```

**ja.json:**
```json
{
  "myFeature": {
    "title": "新機能のタイトル",
    "description": "詳細な説明"
  }
}
```

### Step 2: Use in Components

```jsx
const { t } = useTranslation();

<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
```

---

## 🎨 Language Switcher Variants

### Full Variant (Default)
- Card-style layout with flags
- Shows all languages with checkmarks
- Best for settings pages

```jsx
<LanguageSwitcher />
```

### Compact Variant
- Dropdown menu style
- Shows current language flag + code
- Best for headers and navbars

```jsx
<LanguageSwitcher variant="compact" />
```

---

## 🔧 Advanced Usage

### Interpolation (Dynamic Values)

```jsx
// In translation file:
{
  "greeting": "Xin chào, {{name}}!"
}

// In component:
t('greeting', { name: 'John' })
// → "Xin chào, John!"
```

### Pluralization

```jsx
// In translation file:
{
  "items_one": "{{count}} món",
  "items_other": "{{count}} món"
}

// In component:
t('items', { count: 1 })  // → "1 món"
t('items', { count: 5 })  // → "5 món"
```

### Get Current Language

```jsx
const { i18n } = useTranslation();
console.log(i18n.language); // → "vi" / "en" / "ja"
```

---

## 🎯 Best Practices

1. **Always provide translations for all languages**
   - If a key is missing, fallback language (vi) will be used
   
2. **Use nested keys for organization**
   ```json
   {
     "dashboard": {
       "nutrition": {
         "calories": "Calories",
         "protein": "Protein"
       }
     }
   }
   ```

3. **Keep keys descriptive and hierarchical**
   - ✅ `dashboard.nutrition.calories`
   - ❌ `cal`, `c1`, `nutrition_cal`

4. **Store user language preference**
   - Language is automatically saved to `localStorage`
   - Key: `nutrigain_language`

5. **Test all languages**
   - Use `LanguageTestView.jsx` to preview all translations

---

## 🧪 Testing

Visit the test page to see all translations in action:

```jsx
import LanguageTestView from './views/LanguageTestView';

// In your router or App.jsx
<Route path="/test-i18n" element={<LanguageTestView />} />
```

---

## 🌐 Adding a New Language

### Step 1: Create Translation File

Create `src/i18n/locales/[lang].json` with all translation keys.

### Step 2: Import in config.js

```javascript
import frTranslations from './locales/fr.json';

const resources = {
  // ... existing languages
  fr: {
    translation: frTranslations
  }
};
```

### Step 3: Add to Language Switcher

```javascript
const LANGUAGES = [
  // ... existing languages
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];
```

---

## 📞 Support

If you encounter any issues with i18n:
1. Check browser console for errors
2. Verify translation keys exist in all language files
3. Ensure i18n config is imported in `main.jsx`
4. Clear localStorage and refresh if language doesn't change

---

**Happy Coding! 🚀**
