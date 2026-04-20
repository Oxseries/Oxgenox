import React, { useState } from 'react';
import { EXCELLENCE_V2_INGREDIENTS } from '../constants';

const TELEGRAM_BOT_TOKEN = '8268291221:AAGjOqG-nKzXxjbd4uuZ0A9OBnRtRnE7Lco'; 
const TELEGRAM_CHAT_ID = '1205997493'; 

interface ApplicationRequestProps {
  t: (key: any) => string;
}

const ApplicationRequest: React.FC<ApplicationRequestProps> = ({ t }) => {
  const [pharmacyName, setPharmacyName] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantRole, setApplicantRole] = useState<'İşveren' | 'Uzman' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hours = Array.from({ length: 13 }, (_, i) => (i + 9).toString().padStart(2, '0')); 
  const minutes = ['00', '15', '30', '45'];

  const handleSubmit = async () => {
    if (!pharmacyName || !applicantName || !phoneNumber || !applicantRole) {
      alert(t('form_missing'));
      return;
    }

    setIsSubmitting(true);
    const appTime = `${selectedHour}:${selectedMinute}`;

    if (!navigator.geolocation) {
      await sendRequest("Konum Alınamadı / No Location", appTime, phoneNumber);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const locationLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        await sendRequest(locationLink, appTime, phoneNumber);
      },
      async (err) => {
        console.error("Konum hatası:", err);
        await sendRequest("Konum İzni Reddedildi / Location Denied", appTime, phoneNumber);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const sendRequest = async (location: string, appTime: string, phone: string) => {
    const message = `🚀 *Yeni Uygulama Talebi*\n\n` +
                    `👤 *Yetkili:* ${applicantName}\n` +
                    `🎓 *Ünvan:* ${applicantRole}\n` +
                    `🏢 *Kurum/Şube:* ${pharmacyName}\n` +
                    `📱 *GSM:* ${phone}\n` +
                    `⏰ *Saat:* ${appTime}\n` +
                    `🗺️ *Harita Konumu:* ${location}`;
    
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setPharmacyName('');
        setApplicantName('');
        setApplicantRole(null);
        setPhoneNumber('');
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Telegram gönderim hatası:", err);
      alert(t('ai_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="application" className="relative py-24 md:py-48 px-6 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center space-y-16">
          
          {/* Header Section */}
          <div className="text-center space-y-6 max-w-3xl animate-fade-up">
            <span className="text-brand-gold text-[10px] md:text-[12px] font-bold tracking-[0.5em] uppercase block">
              {t('app_request_subtitle')}
            </span>
            <h2 className="text-5xl md:text-7xl font-header font-black tracking-widest leading-tight uppercase">
              {t('app_request_title')}
            </h2>
            <p className="text-xl md:text-2xl text-brand-black/40 font-light leading-relaxed italic">
              {t('app_request_desc')}
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="w-full relative group overflow-hidden rounded-[2.5rem] md:rounded-[4rem] aspect-[21/9] shadow-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
             <img 
                src="https://lh3.googleusercontent.com/d/1QIEDv4B50zPlmG3mvA4-Tmie2oZkjMce" 
                alt="Professional Application" 
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent opacity-60"></div>
          </div>

          {/* Professional Booking Form */}
          <div className="w-full max-w-4xl flex items-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-full bg-brand-gray/30 rounded-[3rem] p-8 md:p-14 lg:p-20 border border-brand-border backdrop-blur-sm shadow-xl">
              {isSuccess ? (
                <div className="py-20 text-center space-y-8 animate-fade-up">
                  <div className="w-24 h-24 mx-auto rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-4xl">✓</div>
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-header font-black uppercase tracking-widest">{t('form_success')}</h3>
                    <p className="text-xs font-bold text-brand-black/30 tracking-[0.4em] uppercase">{t('form_success_sub')}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-brand-border">
                    <h4 className="text-2xl md:text-3xl font-header font-black uppercase tracking-widest">{t('registration_form')}</h4>
                    <span className="text-[10px] font-mono font-bold text-brand-gold tracking-widest uppercase">{t('app_exclusive_badge')}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.3em] ml-2">
                        {t('applicant_name_label')}
                      </label>
                      <input 
                        type="text" 
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder={t('applicant_name_placeholder')}
                        className="w-full bg-white border border-brand-border rounded-2xl px-6 py-4 text-brand-black focus:outline-none focus:border-brand-gold/50 transition-all duration-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.3em] ml-2">
                        {t('pharmacy_name_label')}
                      </label>
                      <input 
                        type="text" 
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        placeholder={t('pharmacy_placeholder')}
                        className="w-full bg-white border border-brand-border rounded-2xl px-6 py-4 text-brand-black focus:outline-none focus:border-brand-gold/50 transition-all duration-500 text-base italic"
                      />
                    </div>
                  </div>

                  {/* New Role Selection Buttons */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.3em] ml-2">
                      {t('role_label')}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setApplicantRole('İşveren')}
                        className={`py-4 md:py-6 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 border ${
                          applicantRole === 'İşveren'
                            ? 'bg-brand-gold text-white border-brand-gold shadow-lg scale-[1.02]'
                            : 'bg-white text-brand-black/40 border-brand-border hover:border-brand-gold/30'
                        }`}
                      >
                        {t('role_pharmacist')}
                      </button>
                      <button
                        onClick={() => setApplicantRole('Uzman')}
                        className={`py-4 md:py-6 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 border ${
                          applicantRole === 'Uzman'
                            ? 'bg-brand-gold text-white border-brand-gold shadow-lg scale-[1.02]'
                            : 'bg-white text-brand-black/40 border-brand-border hover:border-brand-gold/30'
                        }`}
                      >
                        {t('role_assistant')}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.3em] ml-2">
                        {t('contact_label')}
                      </label>
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="05xx xxx xx xx"
                        className="w-full bg-white border border-brand-border rounded-2xl px-6 py-4 text-brand-black focus:outline-none focus:border-brand-gold/50 transition-all duration-500 text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-[0.3em] ml-2">
                        {t('app_time_label')}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <select 
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="w-full bg-white border border-brand-border rounded-2xl pl-6 pr-10 py-4 text-brand-black appearance-none focus:outline-none focus:border-brand-gold/50 transition-all cursor-pointer font-bold text-lg"
                          >
                            {hours.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gold font-mono text-[10px] uppercase">Hr</span>
                        </div>
                        <div className="relative">
                          <select 
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            className="w-full bg-white border border-brand-border rounded-2xl pl-6 pr-10 py-4 text-brand-black appearance-none focus:outline-none focus:border-brand-gold/50 transition-all cursor-pointer font-bold text-lg"
                          >
                            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gold font-mono text-[10px] uppercase">Mn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group relative w-full h-20 rounded-full overflow-hidden transition-all duration-700 disabled:opacity-30 shadow-2xl mt-4"
                  >
                    <div className="absolute inset-0 bg-brand-black group-hover:bg-brand-gold transition-colors duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-4 text-white">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-[0.4em]">{t('btn_request_app')}</span>
                          <span className="text-xl group-hover:translate-x-2 transition-transform duration-500">→</span>
                        </>
                      )}
                    </div>
                  </button>
                  
                  <div className="pt-6 flex items-center justify-center gap-4 opacity-20">
                     <div className="w-8 h-px bg-brand-black"></div>
                     <span className="text-[8px] font-bold tracking-widest uppercase">Certified Partner Protocol</span>
                     <div className="w-8 h-px bg-brand-black"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationRequest;