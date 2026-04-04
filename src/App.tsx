import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
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
  MessageCircle,
  LayoutDashboard,
  HelpCircle,
  Calendar,
  Users,
  ExternalLink,
  Settings,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface User {
  id: number;
  fullName: string;
  nickname?: string;
  email: string;
  password?: string;
  phone?: string;
  birthDate?: string;
  profilePic?: string;
  course?: string;
}

interface SupportTicket {
  id: number;
  userId: number;
  fullName: string;
  course: string;
  email: string;
  phone: string;
  comment: string;
  createdAt: string;
}

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

type Tab = 'conteudo' | 'suporte' | 'duvidas' | 'cronograma' | 'comunidade' | 'concursos' | 'conta' | 'admin';
type Page = 'login' | 'register' | 'main' | 'subject_detail' | 'complementary_detail';

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
      questoes: 'https://drive.google.com/file/d/1BxKab9uOz1-r4-5F4M-T68HHaH9xYpD7/view?usp=drive_link'
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

const Header = ({ onLogout, showLogout = false, user, onTabChange }: { onLogout?: () => void, showLogout?: boolean, user?: User | null, onTabChange?: (tab: Tab) => void }) => (
  <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-b border-white/10 z-50 h-16">
    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
      <a 
        href={EDITOR_URL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="relative">
          <img 
            src={LOGO_URL} 
            alt="Edital Concursos" 
            className="h-10 w-10 object-contain rounded-full border-2 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.4)] bg-slate-900" 
          />
        </div>
        <span className="font-black text-white text-lg hidden sm:inline tracking-tighter uppercase font-display">Edital Concursos</span>
      </a>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <button 
              onClick={() => onTabChange?.('conteudo')}
              className="text-[10px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-widest transition-colors hidden sm:block"
            >
              Página Inicial
            </button>
            <button 
              onClick={() => onTabChange?.('conta')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 overflow-hidden bg-slate-900">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            </button>
          </>
        )}
        
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
    </div>
  </header>
);

const NotificationBanner = () => (
  <div className="fixed top-16 left-0 right-0 bg-blue-600/10 border-b border-blue-500/20 z-40 py-2 h-8 flex items-center">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 w-full">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] text-center">
          Aviso: Estamos atualizando a plataforma com novas ferramentas para acelerar sua aprovação! 🚀
        </p>
      </div>
    </div>
  </div>
);

const Sidebar = ({ activeTab, onTabChange, isOpen, setIsOpen }: { activeTab: Tab, onTabChange: (tab: Tab) => void, isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
  const menuItems: { id: Tab, label: string, icon: React.ReactNode }[] = [
    { id: 'conteudo', label: 'Conteúdo', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'suporte', label: 'Suporte', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'duvidas', label: 'Dúvidas', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'cronograma', label: 'Cronograma', icon: <Calendar className="w-5 h-5" /> },
    { id: 'comunidade', label: 'Comunidade', icon: <Users className="w-5 h-5" /> },
    { id: 'concursos', label: 'Concursos', icon: <ExternalLink className="w-5 h-5" /> },
    { id: 'conta', label: 'Minha conta', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Toggle - Only visible on small screens */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] lg:hidden w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isOpen ? 280 : 80,
          x: 0 
        }}
        className="fixed top-24 left-0 bottom-0 bg-slate-950/95 backdrop-blur-xl border-r border-white/5 z-40 transition-all duration-300 hidden lg:block overflow-hidden"
      >
        <div className="p-4 flex flex-col h-full">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="mb-8 p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors self-start"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="space-y-2 flex-grow">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={!isOpen ? item.label : ""}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all relative group ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="min-w-[20px] flex justify-center">
                  {item.icon}
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/5">
            <p className={`text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] text-center transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              Edital Concursos
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Drawer Version */}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed top-24 left-0 bottom-0 w-72 bg-slate-950/95 backdrop-blur-xl border-r border-white/5 z-40 transition-all duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="space-y-2 flex-grow">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const Footer = ({ onTabChange }: { onTabChange?: (tab: Tab) => void }) => (
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
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
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

      <div className="flex justify-start">
        <button 
          onClick={() => onTabChange?.('admin')}
          className="text-[8px] text-slate-800 hover:text-slate-600 transition-colors uppercase tracking-widest font-bold"
        >
          ADM
        </button>
      </div>
    </div>
  </footer>
);

const SuporteTab = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      userId: user.id,
      fullName: formData.get('fullName'),
      course: formData.get('course'),
      phone: formData.get('phone'),
      comment: formData.get('comment'),
      email: user.email, // Mantemos o email do usuário logado para registro interno
    };

    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSuccess(true);
    } catch (error) {
      alert('Erro ao enviar suporte.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-600/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Mensagem Enviada!</h2>
        <p className="text-slate-400 mb-10">Sua dúvida foi enviada para o painel administrativo. Nossa equipe entrará em contato com você pelo número informado o mais breve possível.</p>
        <button onClick={() => setSuccess(false)} className="btn-gold px-8 py-4 rounded-2xl">Enviar outra mensagem</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter font-display">Suporte ao Aluno</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Estamos aqui para ajudar você em sua jornada</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[2.5rem] space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Nome Completo</label>
          <input name="fullName" defaultValue={user.fullName} required className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Curso / Concurso</label>
          <input name="course" defaultValue={user.course || 'PRF 2026'} required className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Número de Contato (WhatsApp)</label>
          <input name="phone" defaultValue={user.phone} required className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(00) 00000-0000" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Sua Mensagem / Comentário</label>
          <textarea name="comment" required rows={5} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Descreva sua dúvida ou problema..."></textarea>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full py-5 rounded-2xl text-lg">
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </form>
    </div>
  );
};

const DuvidasTab = () => {
  const faqs = [
    { q: "Como baixar os arquivos em PDF?", a: "Dentro de cada matéria, clique no botão 'Baixar' ao lado do título do módulo. O arquivo será aberto em uma nova aba para download." },
    { q: "Como tirar dúvidas com o suporte?", a: "Acesse a aba 'Suporte' na barra lateral, preencha o formulário com seu número de contato e sua mensagem será enviada diretamente para o painel administrativo da editora." },
    { q: "Como funciona o cronograma de estudos?", a: "O cronograma é interativo. Você pode marcar as tarefas concluídas (Teoria, Mapas, Questões) para cada dia da semana." },
    { q: "Encontrei um erro no conteúdo, o que fazer?", a: "Utilize a aba 'Suporte' para nos informar. Valorizamos muito seu feedback para manter a qualidade dos materiais." },
    { q: "Preciso de senha para acessar?", a: "Não. O acesso é simplificado apenas com seu Nome e E-mail. Seus dados ficam salvos para acessos futuros." },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter font-display">Dúvidas Frequentes</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Tudo o que você precisa saber sobre a plataforma</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl border border-white/5">
            <h4 className="text-yellow-400 font-black uppercase tracking-widest text-sm mb-3 flex items-center gap-3">
              <HelpCircle className="w-5 h-5" />
              {faq.q}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CronogramaTab = () => {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const toggleTask = (day: string, task: string) => {
    const key = `${day}-${task}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter font-display">Cronograma de Estudos</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Sua rota para a aprovação na PRF 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <div key={day} className="glass-card p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter border-b border-white/10 pb-4">{day}</h3>
            <div className="space-y-3">
              {['Estudo Teórico', 'Mapas Mentais', 'Questões'].map(task => (
                <button 
                  key={task}
                  onClick={() => toggleTask(day, task)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${progress[`${day}-${task}`] ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-slate-900 text-slate-500 border border-white/5 hover:border-blue-500/30'}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{task}</span>
                  {progress[`${day}-${task}`] ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-700" />}
                </button>
              ))}
              
              {day === 'Domingo' && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-2">Foco Especial:</p>
                  {['Redação Discursiva', 'Revisão Geral', 'Simulado'].map(task => (
                    <div key={task} className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/20 text-amber-400 flex items-center justify-between opacity-80">
                      <span className="text-[10px] font-black uppercase tracking-widest">{task}</span>
                      <Lock className="w-4 h-4" />
                    </div>
                  ))}
                  <p className="text-[9px] text-slate-600 text-center uppercase font-bold mt-2 italic">Adquira os materiais complementares para liberar estas tarefas</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComunidadeTab = () => (
  <div className="max-w-3xl mx-auto text-center py-10">
    <div className="w-24 h-24 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/20">
      <Users className="w-12 h-12" />
    </div>
    <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter font-display leading-tight">Você não está sozinho<br/><span className="text-gradient-gold">nessa jornada.</span></h2>
    <div className="glass-card p-10 rounded-[3rem] mb-12">
      <p className="text-slate-300 text-lg leading-relaxed italic mb-8">
        "A aprovação é a soma de pequenos esforços repetidos dia após dia. O caminho pode ser árduo, mas a vista do topo é gratificante. Junte-se a centenas de outros guerreiros que, assim como você, buscam a farda da PRF."
      </p>
      <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-black">Faça parte da nossa comunidade exclusiva</p>
    </div>
    <a 
      href="https://chat.whatsapp.com/H7wj7v0bi2cIzsJ9BccMUg?mode=gi_t" 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-gold inline-flex items-center gap-4 px-12 py-6 rounded-2xl text-xl"
    >
      <MessageCircle className="w-6 h-6" />
      Entrar no Grupo de Estudos
    </a>
  </div>
);

const ContaTab = ({ user, onUpdate }: { user: User, onUpdate: (user: User) => void }) => {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      userId: user.id,
      fullName: formData.get('fullName'),
      nickname: formData.get('nickname'),
      phone: formData.get('phone'),
      birthDate: formData.get('birthDate'),
      password: formData.get('password') || undefined,
      profilePic,
    };

    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        onUpdate(result.user);
        alert('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      alert('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter font-display">Minha Conta</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Gerencie seus dados e personalização</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-blue-600/30 overflow-hidden bg-slate-900 shadow-2xl">
                {profilePic ? (
                  <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <UserIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">{user.fullName}</h3>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{user.email}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-10 rounded-[2.5rem] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Nome Completo</label>
                <input name="fullName" defaultValue={user.fullName} required className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Apelido</label>
                <input name="nickname" defaultValue={user.nickname} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Celular / WhatsApp</label>
                <input name="phone" defaultValue={user.phone} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Data de Nascimento</label>
                <input name="birthDate" type="date" defaultValue={user.birthDate} className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-6">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">
                Acesso simplificado por nome ativado.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-5 rounded-2xl text-lg">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const AdminTab = () => {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adminView, setAdminView] = useState<'users' | 'tickets'>('users');

  const handleAuth = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (result.success) {
        setUsers(result.users);
        setTickets(result.tickets || []);
        setAuthorized(true);
      } else {
        alert('Senha incorreta.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-8" />
        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Acesso Restrito ADM</h2>
        <div className="space-y-6">
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="SENHA DE ACESSO" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl bg-slate-950 border border-white/10 text-white text-center font-black tracking-widest outline-none focus:ring-2 focus:ring-red-500 pr-14"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button onClick={handleAuth} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 transition-all">Entrar no Painel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-display">Painel Administrativo</h2>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setAdminView('users')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminView === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Alunos ({users.length})
          </button>
          <button 
            onClick={() => setAdminView('tickets')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminView === 'tickets' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Suporte ({tickets.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {adminView === 'users' ? (
          <motion.div 
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-card p-6 rounded-[2rem] max-h-[600px] overflow-y-auto">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Lista de Alunos</h3>
                <div className="space-y-2">
                  {users.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 ${selectedUser?.id === u.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                        {u.profilePic && <img src={u.profilePic} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-xs font-bold uppercase truncate">{u.fullName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedUser ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-10 rounded-[2.5rem]"
                >
                  <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
                    <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-white/10 overflow-hidden shadow-2xl">
                      {selectedUser.profilePic ? (
                        <img src={selectedUser.profilePic} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700"><UserIcon className="w-10 h-10" /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedUser.fullName}</h3>
                      <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-1">{selectedUser.nickname || 'Sem Apelido'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">E-mail</p>
                      <p className="text-white font-bold">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="text-white font-bold">{selectedUser.phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Nascimento</p>
                      <p className="text-white font-bold">{selectedUser.birthDate || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Data Cadastro</p>
                      <p className="text-white font-bold">{new Date(selectedUser.createdAt || '').toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 glass-card rounded-[2.5rem] p-20 text-center">
                  <LayoutDashboard className="w-16 h-16 mb-6 opacity-20" />
                  <p className="uppercase tracking-widest font-black text-xs">Selecione um aluno para visualizar os detalhes</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tickets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <div key={ticket.id} className="glass-card p-8 rounded-[2.5rem] border-l-4 border-red-600">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-red-400">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-tight">{ticket.fullName}</h4>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{ticket.course}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href={`https://wa.me/55${ticket.phone?.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-green-600/20 text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp: {ticket.phone}
                      </a>
                      <div className="px-6 py-3 bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{ticket.comment}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass-card rounded-[2.5rem]">
                <MessageCircle className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Nenhuma mensagem de suporte pendente</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<Tab>('conteudo');
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unlockedMaterials, setUnlockedMaterials] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedComplementary, setSelectedComplementary] = useState<ComplementaryMaterial | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedUnlocked = localStorage.getItem('unlocked_materials');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('main');
    }
    
    if (savedUnlocked) {
      setUnlockedMaterials(JSON.parse(savedUnlocked));
    }
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, activeTab]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName');
    const email = formData.get('email');

    try {
      const res = await fetch('/api/login-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setCurrentPage('main');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    setCurrentPage('login');
    setActiveTab('conteudo');
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
        <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-10">
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
            
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tighter font-display uppercase leading-tight">Acessar Portal<br/><span className="text-gradient-gold">PRF 2026</span></h1>
            <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">Identifique-se para acessar seu portal</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-yellow-400 transition-colors" />
                <input 
                  name="fullName" 
                  type="text" 
                  placeholder="NOME COMPLETO" 
                  required 
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-black text-white placeholder:text-slate-800 tracking-widest uppercase" 
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-yellow-400 transition-colors" />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="SEU MELHOR E-MAIL" 
                  required 
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-black text-white placeholder:text-slate-800 tracking-widest uppercase" 
                />
              </div>
              <button type="submit" className="btn-gold w-full py-5 rounded-2xl text-xl mt-4">Acessar Portal</button>
            </form>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header 
        onLogout={handleLogout} 
        showLogout 
        user={user} 
        onTabChange={(t) => {
          setActiveTab(t);
          setCurrentPage('main');
        }} 
      />
      <NotificationBanner />
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(t) => {
          if (t === 'concursos') {
            window.open(EDITOR_URL, '_blank');
          } else {
            setActiveTab(t);
            setCurrentPage('main');
          }
        }} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <main className={`flex-grow pt-32 pb-20 px-4 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'}`}>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentPage === 'main' && (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {activeTab === 'conteudo' && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-20 text-center"
                    >
                      <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter font-display uppercase leading-tight">
                        Bem-vindo, <span className="text-gradient-gold">{user?.nickname || user?.fullName?.split(' ')[0]}</span>,<br/>à sua área de estudos.
                      </h2>
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-px w-12 bg-white/10"></div>
                        <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">Portal Exclusivo PRF 2026</p>
                        <div className="h-px w-12 bg-white/10"></div>
                      </div>
                    </motion.div>

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
                  </>
                )}

                {activeTab === 'suporte' && user && <SuporteTab user={user} />}
                {activeTab === 'duvidas' && <DuvidasTab />}
                {activeTab === 'cronograma' && <CronogramaTab />}
                {activeTab === 'comunidade' && <ComunidadeTab />}
                {activeTab === 'conta' && user && <ContaTab user={user} onUpdate={(u) => {
                  setUser(u);
                  localStorage.setItem('user_data', JSON.stringify(u));
                }} />}
                {activeTab === 'admin' && <AdminTab />}
              </motion.div>
            )}

            {currentPage === 'subject_detail' && selectedSubject && (
              <SubjectDetail 
                key="subject_detail"
                subject={selectedSubject} 
                onBack={() => setCurrentPage('main')} 
              />
            )}

            {currentPage === 'complementary_detail' && selectedComplementary && (
              <ComplementaryDetail 
                key="complementary_detail"
                material={selectedComplementary} 
                onBack={() => setCurrentPage('main')} 
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer onTabChange={(t) => {
        setActiveTab(t);
        setCurrentPage('main');
      }} />
    </div>
  );
}
