import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Eye, 
  EyeOff,
  LogOut,
  Mail,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgImage?: string;
  pdfUrls?: {
    teoria: string;
    mapas: string;
    questoes: string;
  };
}

interface ComplementaryMaterial {
  id: string;
  name: string;
  code: string;
  bgImage?: string;
  pdfUrl?: string;
  checkoutUrl?: string;
}

type Page = 'login' | 'studies' | 'subject_detail' | 'complementary_detail';

// --- Constants ---
const LOGO_URL = "https://i.ibb.co/mFbSYv6j/1000112350.webp";
const EDITOR_URL = "https://editoraeditalconcursos.vercel.app";

const SUBJECTS: Subject[] = [
  { 
    id: 'portugues', 
    name: 'Português', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/qFjPbFP2/Design-sem-nome-8.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1FQSfBXJHupysIioKi03GZaP1zjmRTiqw/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1Kzr-LMCcv7SiPYFKQ9Faxr0bMe_66GxG/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1_LejTkBSYI8d_TCPPUIdYWE2pMDxTUmF/view?usp=drive_link'
    }
  },
  { 
    id: 'raciocinio', 
    name: 'Raciocínio Lógico', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/Lh80qVny/Design-sem-nome-10.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1i2N2LWC98ZWoJarRanzsbWn-oQPInxIv/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1Thb9ug4Wyyn4NXKPR7yx7SbAJTZca9zE/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/11uj36TRH4EZvEczYg3XDq8u_lY89i4Ll/view?usp=drive_link'
    }
  },
  { 
    id: 'admin', 
    name: 'Direito Administrativo', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/wryfhd17/Design-sem-nome-11.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1j2zAQFyNBPy_XOm0eKO-gWhXVMFx-1xd/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1rwYbuGkLjPtJaW57OrsPCr7or2RZUgCP/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1JjSQhx94YtOqZRMRaf_WZYmtUcWvsbyK/view?usp=drive_link'
    }
  },
  { 
    id: 'const', 
    name: 'Direito Constitucional', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/Z1TQdjkN/Design-sem-nome-12.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1imSQuClUOK6Zv8Tg0UKPNlnzREORFoDL/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1yRUkwgsOn_lvnUsi44BI7aF2oEdhxS_a/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1vokq2AvKTxDKIkGQYcUdCitkAPLrqzr9/view?usp=drive_link'
    }
  },
  { 
    id: 'etica', 
    name: 'Ética no Serviço Público', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/sJdgnwy0/Design-sem-nome-14.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/13BQn8MdzxVky_9mVYrkmbyJaRqqzmZk_/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/18dP0hg4yRu9FY2Rnrqa1-yGnrKphEI1m/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/12ofXW6CXHHY4tKO__cbV5x64RxnelUPH/view?usp=drive_link'
    }
  },
  { 
    id: 'leg_prf', 
    name: 'Legislação Relativa à PRF', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/93CfnVKR/Design-sem-nome-9.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1EQ-k3vKQtgUQYa5CQJldIQfQW4F8Ritm/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1uJ7XGWICUN2wOUh57Gl65nmIazLu2QqR/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1N8Atq76_b9sSB0AKyq7mUXcZ3R8hynlO/view?usp=drive_link'
    }
  },
  { 
    id: 'informatica', 
    name: 'Informática Básica', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/sdQLnnS3/Design-sem-nome-16.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1WsDfDipX5Kb5_ItJAiIIGW9IfXAsYg87/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1BLrzVgmzpumHmwlb8zM4AM7F4_-v4C85/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1_cuXKDmmtGDJ46P-iJtSqKD7v-M0YM3p/view?usp=drive_link'
    }
  },
  { 
    id: 'n_admin', 
    name: 'Noções de Administração', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/4Z1SKsnV/Design-sem-nome-17.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/1VmVKwiySnSp1eYhEfuv0ezzMipnCJoCZ/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/19mhpLXsW3MHmBPImsp7qWyjAWFXJuHWj/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/16UDIh7M3xZCi5-KyVmTUxWGG97kCU8ns/view?usp=drive_link'
    }
  },
  { 
    id: 'n_arqui', 
    name: 'Noções de Arquivologia', 
    icon: <BookOpen className="w-5 h-5" />, 
    bgImage: 'https://i.ibb.co/PsqSMM2m/Design-sem-nome-15.png',
    pdfUrls: {
      teoria: 'https://drive.google.com/file/d/11ixJRB5UjCAyWV_37q2HDv1rrqIqnaPk/view?usp=drive_link',
      mapas: 'https://drive.google.com/file/d/1GYRQwGJoKPxljhix9vFe7A_3jxJ6UUCI/view?usp=drive_link',
      questoes: 'https://drive.google.com/file/d/1iiy1ZVSJ-7x7-mHw-iW9G_g93xFwZ1gY/view?usp=drive_link'
    }
  },
];

const COMPLEMENTARY: ComplementaryMaterial[] = [
  { id: 'simulados', name: 'Simulados Esquematizados', code: 'SIESQ', bgImage: 'https://i.ibb.co/sJdgnwy0/Design-sem-nome-14.png', pdfUrl: 'https://drive.google.com/file/d/1Cp4QE0uGU9XnklwyQf7UbfQQnXXZzxmL/view?usp=drive_link', checkoutUrl: 'https://pay.wiapy.com/Wd0jfGvJot' },
  { id: 'revisao', name: 'Revisão Esquematizada', code: 'REVESQ', bgImage: 'https://i.ibb.co/wryfhd17/Design-sem-nome-11.png', pdfUrl: 'https://drive.google.com/file/d/1uLekOLWNYDsgvU-axbbXUU6UAnGyaF2s/view?usp=drive_link', checkoutUrl: 'https://pay.wiapy.com/Tyn1d8pFs-' },
  { id: 'redacao', name: 'Redação Discursiva para Concursos', code: 'REDCON', bgImage: 'https://i.ibb.co/sdQLnnS3/Design-sem-nome-16.png', pdfUrl: 'https://drive.google.com/file/d/1NXhBdWnb7jkfDOxta4XUkIwaagxKxTtl/view?usp=drive_link', checkoutUrl: 'https://pay.wiapy.com/lRFSmwYQYg' },
  { id: 'ferro', name: 'Disciplina de Ferro - Controle Emocional', code: 'DIFECOE', bgImage: 'https://i.ibb.co/Z1TQdjkN/Design-sem-nome-12.png', pdfUrl: 'https://drive.google.com/file/d/1BIQVlJMNV58C-9EbxdA9prE0PpygEZlo/view?usp=drive_link', checkoutUrl: 'https://pay.wiapy.com/Hn-9DRvIDW' },
  { id: 'estudar_pdf', name: 'Como Estudar com PDFs', code: 'COESPS', bgImage: 'https://i.ibb.co/PsqSMM2m/Design-sem-nome-15.png', pdfUrl: 'https://drive.google.com/file/d/1gJ0d-5JIdXitUp0IDZo_IbOLBL8V9_Lw/view?usp=drive_link', checkoutUrl: 'https://pay.wiapy.com/7cALG9VMpK' },
];

// --- Components ---

const Header = ({ onLogout, showLogout = false }: { onLogout?: () => void, showLogout?: boolean }) => (
  <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-b border-white/10 z-50 h-16">
    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
      <a 
        href={EDITOR_URL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="bg-white p-1 rounded-lg">
          <img src={LOGO_URL} alt="Edital Concursos" className="h-8 w-auto object-contain" />
        </div>
        <span className="font-black text-white text-lg hidden sm:inline tracking-tighter uppercase font-display">Edital Concursos</span>
      </a>
      {showLogout && (
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      )}
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-slate-950/50 border-t border-white/5 py-16 mt-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <a 
        href={EDITOR_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity mb-2"
      >
        <h3 className="font-black text-white text-2xl tracking-tighter uppercase font-display">Edital Concursos</h3>
      </a>
      <p className="text-slate-500 text-xs mb-10 uppercase tracking-[0.2em]">© 2026 – Todos os direitos reservados</p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-3 text-slate-400 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <Mail className="w-5 h-5 text-blue-400 group-hover:text-white" />
          </div>
          <span className="text-sm font-semibold">editoraeditalconcursos@gmail.com</span>
        </div>
        <a 
          href="https://w.app/editoraeditalconcursos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-slate-400 group cursor-pointer hover:text-green-400 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center group-hover:bg-green-600 transition-colors">
            <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-white" />
          </div>
          <span className="text-sm font-semibold">(41) 98842-0201</span>
        </a>
      </div>
    </div>
  </footer>
);

const PDFSection = ({ title, pdfUrl }: { title: string, pdfUrl?: string }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Função para formatar links do Drive para exibição em iframe
  const getEmbedUrl = (url: string) => {
    if (!url || url === 'about:blank') return 'about:blank';
    
    if (url.includes('drive.google.com')) {
      // Converte links de visualização/edição para o formato de preview do iframe
      let embedUrl = url.replace(/\/view.*$/, '/preview');
      embedUrl = embedUrl.replace(/\/edit.*$/, '/preview');
      if (!embedUrl.endsWith('/preview')) {
        embedUrl = embedUrl.split('?')[0].replace(/\/$/, '') + '/preview';
      }
      return embedUrl;
    }
    return url;
  };

  const handleDownload = () => {
    if (pdfUrl && pdfUrl !== 'about:blank') {
      window.open(pdfUrl, '_blank');
    } else {
      alert('Link do material não configurado. Por favor, forneça um link válido do Google Drive ou servidor.');
    }
  };

  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1.5 h-5 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
        <h4 className="font-black text-white text-xs uppercase tracking-[0.2em] font-display">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center justify-center gap-2 ${showPreview ? 'bg-yellow-500 text-blue-950' : 'bg-blue-600 text-white'} px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95`}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Ocultar' : 'Visualizar'}
        </button>
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95 border border-white/5"
        >
          <Download className="w-4 h-4" />
          Baixar
        </button>
      </div>
      
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pdf-container overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 shadow-inner">
              <iframe 
                src={getEmbedUrl(pdfUrl || "")} 
                title="PDF Preview" 
                className="w-full h-[500px] border-none"
                allow="autoplay"
              ></iframe>
              <div className="py-3 px-4 bg-slate-900/80 backdrop-blur-sm border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  {pdfUrl && pdfUrl !== 'about:blank' ? 'Material Carregado' : 'Aguardando Link...'}
                </span>
                <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">Premium Content</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
  key?: string | number;
}

const SubjectCard = ({ subject, onClick }: SubjectCardProps) => {
  return (
    <motion.div 
      layout
      className="glass-card rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/10 hover:-translate-y-2 group relative"
    >
      {subject.bgImage && (
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <img 
            src={subject.bgImage} 
            alt="" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
      )}
      <button 
        onClick={() => onClick(subject)}
        className="w-full p-8 flex flex-col items-center text-center gap-5 relative z-10"
      >
        <div className="w-20 h-20 rounded-2xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 flex items-center justify-center transition-all duration-500 shadow-inner border border-blue-500/20">
          {React.cloneElement(subject.icon as React.ReactElement, { className: "w-10 h-10" })}
        </div>
        <div>
          <h4 className="font-black text-white text-xl leading-tight group-hover:text-yellow-400 transition-colors font-display uppercase tracking-tighter">{subject.name}</h4>
          <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-[0.3em]">PRF 2026 • Módulos</p>
        </div>
        
        <div className="absolute top-6 right-6 transition-transform duration-300 group-hover:translate-x-1">
          <ChevronUp className="w-5 h-5 text-slate-600 rotate-90 group-hover:text-yellow-400" />
        </div>
      </button>
    </motion.div>
  );
};

interface ComplementaryCardProps {
  material: ComplementaryMaterial;
  isUnlocked: boolean;
  onUnlock: (id: string, code: string) => boolean;
  onClick: (material: ComplementaryMaterial) => void;
  key?: string | number;
}

const ComplementaryCard = ({ material, isUnlocked, onUnlock, onClick }: ComplementaryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  const handleValidate = () => {
    const success = onUnlock(material.id, inputCode);
    if (!success) {
      setError('CÓDIGO INVÁLIDO');
    } else {
      setError('');
      setIsOpen(false);
    }
  };

  return (
    <motion.div 
      layout
      className={`glass-card rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-amber-500/10 hover:-translate-y-2 group relative ${isOpen ? 'ring-2 ring-amber-500/50' : ''}`}
    >
      {material.bgImage && (
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <img 
            src={material.bgImage} 
            alt="" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
      )}
      <div 
        onClick={() => isUnlocked ? onClick(material) : setIsOpen(!isOpen)}
        className="w-full p-8 flex flex-col items-center text-center gap-5 relative z-10 cursor-pointer"
      >
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner border ${isUnlocked ? 'bg-green-600/20 text-green-400 border-green-500/20 group-hover:bg-green-600 group-hover:text-white' : 'bg-amber-600/20 text-amber-400 border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110'}`}>
          {isUnlocked ? <Unlock className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
        </div>
        <div>
          <h4 className="font-black text-white text-xl leading-tight group-hover:text-amber-400 transition-colors font-display uppercase tracking-tighter">{material.name}</h4>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isUnlocked ? 'bg-green-900/40 text-green-400 border border-green-500/30' : 'bg-amber-900/40 text-amber-400 border border-amber-500/30'}`}>
              {isUnlocked ? 'Acesso Liberado' : 'Conteúdo Restrito'}
            </span>
          </div>
        </div>
        
        <div className={`absolute top-6 right-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isUnlocked ? (
            <ChevronUp className="w-5 h-5 text-slate-600 rotate-90 group-hover:text-green-400 group-hover:translate-x-1 transition-transform" />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-amber-400' : 'text-slate-600'}`} />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && !isUnlocked && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-20"
          >
            <div className="px-8 pb-10 pt-4 border-t border-white/5 bg-white/5">
              <div className="py-2" onClick={(e) => e.stopPropagation()}>
                <p className="text-[10px] text-slate-400 mb-5 font-black uppercase tracking-widest text-center">Insira o código de acesso premium:</p>
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="DIGITE O CÓDIGO"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-4 rounded-2xl bg-slate-950 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all uppercase text-center font-black tracking-[0.3em] text-white placeholder:text-slate-700"
                  />
                  <button 
                    onClick={handleValidate}
                    className="btn-gold py-4 rounded-2xl"
                  >
                    Desbloquear Agora
                  </button>
                  {material.checkoutUrl && (
                    <a 
                      href={material.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-2xl bg-slate-800 text-white font-black uppercase tracking-widest text-center hover:bg-slate-700 transition-all border border-white/5"
                    >
                      Adquirir Agora
                    </a>
                  )}
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[10px] mt-2 font-black text-center uppercase tracking-[0.2em]"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

const SubjectDetail = ({ subject, onBack }: { subject: Subject, onBack: () => void, key?: string | number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-5xl mx-auto"
  >
    <button 
      onClick={onBack}
      className="flex items-center gap-3 text-slate-500 hover:text-yellow-400 transition-all mb-10 font-black uppercase tracking-[0.2em] text-xs group"
    >
      <ChevronUp className="w-5 h-5 -rotate-90 group-hover:-translate-x-2 transition-transform" />
      Voltar para Matérias
    </button>

    <div className="flex flex-col sm:flex-row items-center gap-8 mb-16 text-center sm:text-left">
      <div className="w-24 h-24 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/20 border-4 border-white/10">
        {React.cloneElement(subject.icon as React.ReactElement, { className: "w-12 h-12" })}
      </div>
      <div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-display uppercase">{subject.name}</h2>
        <p className="text-yellow-400 mt-2 font-black uppercase tracking-[0.4em] text-xs">Módulos de Estudo • PRF 2026</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-8">
      <div className="glass-card rounded-[2.5rem] p-10">
        <PDFSection title="Conteúdo Teórico" pdfUrl={subject.pdfUrls?.teoria} />
      </div>
      <div className="glass-card rounded-[2.5rem] p-10">
        <PDFSection title="Mapas Mentais Estratégicos" pdfUrl={subject.pdfUrls?.mapas} />
      </div>
      <div className="glass-card rounded-[2.5rem] p-10">
        <PDFSection title="Questões Gabaritadas" pdfUrl={subject.pdfUrls?.questoes} />
      </div>
    </div>
  </motion.div>
);

const ComplementaryDetail = ({ material, onBack }: { material: ComplementaryMaterial, onBack: () => void, key?: string | number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-5xl mx-auto"
  >
    <button 
      onClick={onBack}
      className="flex items-center gap-3 text-slate-500 hover:text-amber-400 transition-all mb-10 font-black uppercase tracking-[0.2em] text-xs group"
    >
      <ChevronUp className="w-5 h-5 -rotate-90 group-hover:-translate-x-2 transition-transform" />
      Voltar para Materiais
    </button>

    <div className="flex flex-col sm:flex-row items-center gap-8 mb-16 text-center sm:text-left">
      <div className="w-24 h-24 rounded-[2rem] bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-600/20 border-4 border-white/10">
        <Unlock className="w-12 h-12" />
      </div>
      <div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-display uppercase">{material.name}</h2>
        <p className="text-green-400 mt-2 font-black uppercase tracking-[0.4em] text-xs">Material Premium Desbloqueado</p>
      </div>
    </div>

    <div className="glass-card rounded-[2.5rem] p-10">
      <PDFSection title="Material Completo" pdfUrl={material.pdfUrl} />
    </div>
  </motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userName, setUserName] = useState('');
  const [unlockedMaterials, setUnlockedMaterials] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedComplementary, setSelectedComplementary] = useState<ComplementaryMaterial | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('aluno_nome');
    const savedUnlocked = localStorage.getItem('unlocked_materials');
    
    if (savedName) {
      setUserName(savedName);
      setCurrentPage('studies');
    }
    
    if (savedUnlocked) {
      setUnlockedMaterials(JSON.parse(savedUnlocked));
    }
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleLogin = (name: string) => {
    if (!name.trim()) {
      alert('Digite seu nome.');
      return;
    }
    localStorage.setItem('aluno_nome', name);
    setUserName(name);
    setCurrentPage('studies');
  };

  const handleLogout = () => {
    localStorage.removeItem('aluno_nome');
    setUserName('');
    setCurrentPage('login');
  };

  const handleUnlock = (id: string, code: string) => {
    const material = COMPLEMENTARY.find(m => m.id === id);
    if (material && material.code === code) {
      const newUnlocked = [...unlockedMaterials, id];
      setUnlockedMaterials(newUnlocked);
      localStorage.setItem('unlocked_materials', JSON.stringify(newUnlocked));
      return true;
    }
    return false;
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 sm:p-16 rounded-[3rem] max-w-lg w-full text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600"></div>
            <div className="mb-10 flex justify-center">
              <a 
                href={EDITOR_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-3xl shadow-2xl shadow-white/10 hover:scale-105 transition-transform"
              >
                <img src={LOGO_URL} alt="Logo" className="h-20 w-auto" />
              </a>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tighter font-display uppercase leading-tight">Área de Membros<br/><span className="text-gradient-gold">PRF 2026</span></h1>
            <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">Identifique-se para acessar seu portal</p>
            
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-yellow-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="DIGITE SEU NOME"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-black text-white placeholder:text-slate-800 tracking-widest uppercase"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin((e.target as HTMLInputElement).value)}
                  id="name-input"
                />
              </div>
              <button 
                onClick={() => {
                  const input = document.getElementById('name-input') as HTMLInputElement;
                  handleLogin(input.value);
                }}
                className="btn-gold w-full py-5 rounded-2xl text-xl"
              >
                Acessar Portal
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} showLogout />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <AnimatePresence mode="wait">
          {currentPage === 'studies' && (
            <motion.div 
              key="studies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              {/* Welcome Message */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-20 text-center"
              >
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter font-display uppercase leading-tight">
                  Bem-vindo, <span className="text-gradient-gold">{userName}</span>,<br/>à sua área de estudos.
                </h2>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="h-px w-12 bg-white/10"></div>
                  <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">Portal Exclusivo PRF 2026</p>
                  <div className="h-px w-12 bg-white/10"></div>
                </div>
              </motion.div>

              {/* Section 1: Subjects */}
              <section className="mb-24">
                <div className="flex flex-col items-center gap-4 mb-12">
                  <div className="px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/20">
                    <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.4em]">Matérias</h3>
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-blue-600/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {SUBJECTS.map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={(s) => {
                        setSelectedSubject(s);
                        setCurrentPage('subject_detail');
                      }} 
                    />
                  ))}
                </div>
              </section>

              {/* Section 2: Complementary Materials */}
              <section>
                <div className="flex flex-col items-center gap-4 mb-12">
                  <div className="px-6 py-2 rounded-full bg-amber-600/10 border border-amber-500/20">
                    <h3 className="text-sm font-black text-amber-400 uppercase tracking-[0.4em]">Materiais Complementares</h3>
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-amber-600/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {COMPLEMENTARY.map(material => (
                    <ComplementaryCard 
                      key={material.id} 
                      material={material} 
                      isUnlocked={unlockedMaterials.includes(material.id)}
                      onUnlock={handleUnlock}
                      onClick={(m) => {
                        setSelectedComplementary(m);
                        setCurrentPage('complementary_detail');
                      }}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'subject_detail' && selectedSubject && (
            <SubjectDetail 
              key="subject_detail"
              subject={selectedSubject} 
              onBack={() => setCurrentPage('studies')} 
            />
          )}

          {currentPage === 'complementary_detail' && selectedComplementary && (
            <ComplementaryDetail 
              key="complementary_detail"
              material={selectedComplementary} 
              onBack={() => setCurrentPage('studies')} 
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
