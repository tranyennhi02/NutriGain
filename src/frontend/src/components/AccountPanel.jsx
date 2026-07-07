import { useState, useRef } from 'react';

export default function AccountPanel({ email }) {
  const initials = (email || "NG").slice(0, 2).toUpperCase();
  const [avatar, setAvatar] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        // TODO: Upload to server
        console.log('Avatar uploaded:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="account-panel" className="glass-panel p-5">
      <div className="flex items-center gap-4">
        <div 
          className="relative cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleAvatarClick}
        >
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-primary to-sys-info text-lg font-black text-white shadow-lg shadow-brand-navy/20 transition-transform group-hover:scale-105">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full rounded-3xl object-cover" />
            ) : (
              initials
            )}
          </div>
          {isHovered && (
            <div className="absolute inset-0 rounded-3xl bg-black/50 flex items-center justify-center transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font900 text-brand-text-main">{email || "user@nutrigain.vn"}</p>
          <p className="mt-1 text-sm font700 text-brand-text-sub">Hồ sơ dinh dưỡng Premium</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-brand-mint p-4">
          <div className="text-xs font900 uppercase tracking-[0.12em] text-brand-primary">Trạng thái</div>
          <div className="mt-2 flex items-center gap-2 text-sm font900 text-brand-text-main">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
            Hoạt động
          </div>
        </div>
        <div className="rounded-2xl bg-brand-cream p-4">
          <div className="text-xs font900 uppercase tracking-[0.12em] text-brand-orange">Kế hoạch</div>
          <div className="mt-2 text-sm font900 text-brand-text-main">Tăng cân</div>
        </div>
      </div>
    </section>
  );
}
