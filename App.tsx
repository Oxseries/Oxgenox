import React, { useState } from 'react';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import ApplicationRequest from './components/ApplicationRequest';

const App: React.FC = () => {
  const [lang] = useState<Language>('tr');

  const t = (key: keyof typeof TRANSLATIONS['tr']) => TRANSLATIONS[lang][key];

  return (
    <div className="min-h-screen bg-brand-white text-brand-black">
      <main>
        <ApplicationRequest t={t} />
      </main>
    </div>
  );
};

export default App;