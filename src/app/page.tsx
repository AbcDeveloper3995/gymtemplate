"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Dumbbell, MapPin, Zap, Target, Flame, Brain, TrendingUp, Trophy, Quote, Scale, Ruler, Infinity, Swords, X, Star, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showFab, setShowFab] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowFab(true);
      } else {
        setShowFab(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccessMessage("¡Solicitud enviada con éxito!");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMessage("");
        }, 2000);
      } else {
        alert("Error al enviar solicitud.");
      }
    } catch (error) {
      alert("Error al procesar solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoginModalOpen(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-primary/30">
      {/* Background orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Custom Logo */}
          <Link href="/" className="flex items-center pointer-events-none">
            <img src="/img/logo.png" alt="Gym California Logo" className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border border-white/20 shadow-md" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
           {/* Login link */}
           <button onClick={() => setIsLoginModalOpen(true)} className="text-sm font-bold tracking-wide text-zinc-300 hover:text-primary transition-colors duration-300 uppercase cursor-pointer">
            Iniciar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-44 md:pt-44 md:pb-56 flex flex-col items-center justify-center text-center overflow-hidden min-h-[85vh]">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             {/* Depth overlays & vignette mask for perfect contrast without cloud effect */}
             <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-950 z-10"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(9,9,11,0.85)_100%)] z-10"></div>
             
             {/* Hero background image with opacity */}
             <img src="/img/hero.jpg" alt="Fondo de Gimnasio" className="w-full h-full object-cover object-center opacity-75" />
          </div>

          <div className="relative z-20 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both max-w-5xl mx-auto">
            {/* Slogan with smaller, cleaner font size */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mb-6 uppercase leading-tight drop-shadow-2xl">
              <span className="block text-white">Entrena Fuerte.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-primary to-yellow-100 drop-shadow-[0_0_25px_rgba(250,204,21,0.35)] mt-1">Entrena Inteligente.</span>
            </h1>

            {/* Sub-slogan with smaller, cleaner font size */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 font-normal tracking-wide leading-relaxed drop-shadow-md">
              Programa de fitness de élite diseñado para un rendimiento absoluto. <span className="text-white font-bold">Tu transformación comienza hoy.</span>
            </p>

            {/* CTA Button with intermittent glowing border */}
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
              <a href="#membership" className="w-full sm:w-72 relative group">
                <div className="absolute -inset-[3px] rounded-md bg-gradient-to-r from-primary via-yellow-200 to-primary animate-border-intermittent blur-[2px]"></div>
                
                <Button size="lg" className="relative z-10 w-full h-14 px-8 text-base font-black bg-primary text-black hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded-sm uppercase tracking-[0.15em] shadow-2xl flex items-center justify-center gap-2">
                  <span>Únete Ahora</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Button>
              </a>
            </div>
          </div>

          {/* Parabola / Curved divider at bottom connecting to light background */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-28 text-zinc-100 fill-current">
              <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="px-6 py-24 md:py-32 relative bg-zinc-100 text-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 transform transition-all duration-700 hover:translate-x-2">
              <h3 className="font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2 text-zinc-800">
                 <span className="w-8 h-[3px] bg-primary"></span> <span className="font-extrabold uppercase">Programas</span>
              </h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-zinc-950">Resultados<br/>Comprobados</h2>
              <p className="text-zinc-600 mt-4 max-w-lg text-lg font-medium">
                Descubre módulos de entrenamiento especializados diseñados para superar tus límites. Domina tu cuerpo, tu mente y tu entorno con nuestra metodología.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Program 1: Fuerza */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10 transition-opacity duration-500"></div>
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" alt="Fuerza" className="w-full h-[28rem] object-cover object-center opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                     <Dumbbell className="h-7 w-7 text-black font-bold" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300">Fuerza Bruta</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                    Desarrolla masa muscular magra y potencia pura con nuestros protocolos avanzados de levantamiento de pesas. Este programa se centra en la hipertrofia, la técnica perfecta y la progresión constante.
                  </p>
                </div>
              </div>

              {/* Program 2: HIIT */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10 transition-opacity duration-500"></div>
                <img src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=2062&auto=format&fit=crop" alt="HIIT" className="w-full h-[28rem] object-cover object-center opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                     <Zap className="h-7 w-7 text-black font-bold" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300">HIIT Intenso</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                    Quema grasa y desarrolla una resistencia cardiovascular sobrehumana con nuestros circuitos de intervalos de alta intensidad. Superarás la fatiga mental mientras aceleras tu metabolismo.
                  </p>
                </div>
              </div>

              {/* Program 3: Sparring */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-900 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10 transition-opacity duration-500"></div>
                <img src="/img/sparring.jpg" alt="Sparring Mujer" className="w-full h-[28rem] object-cover object-center opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                     <Swords className="h-7 w-7 text-black font-bold" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-3 uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300">Sparring / Combate</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                    Forja disciplina de acero y agilidad mental a través de nuestras sesiones de combate controlado y artes marciales. Aprenderás técnicas de boxeo y kickboxing mientras mejoras tu velocidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs Banner */}
        <section className="px-6 py-12 relative z-20 border-y border-white/10 bg-zinc-950/80 backdrop-blur-2xl">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex-1 w-full py-4 transform transition-all duration-500 hover:scale-110">
                 <div className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-md">
                    2,500<span className="text-primary animate-pulse inline-block">+</span>
                 </div>
                 <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mt-2">Miembros Activos</div>
              </div>
              <div className="flex-1 w-full py-4 transform transition-all duration-500 hover:scale-110 delay-75">
                 <div className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-md">
                    50<span className="text-primary animate-pulse inline-block">+</span>
                 </div>
                 <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mt-2">Entrenadores Expertos</div>
              </div>
              <div className="flex-1 w-full py-4 transform transition-all duration-500 hover:scale-110 delay-150">
                 <div className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-md">
                    4.9<span className="text-primary text-4xl align-top ml-1">★</span>
                 </div>
                 <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mt-2">Calificación Global</div>
              </div>
           </div>
        </section>

        {/* Membership Section */}
        <section id="membership" className="px-6 py-24 md:py-32 border-b border-white/5 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16 flex flex-col items-center">
               <h3 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">Comienza El Proceso</h3>
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-10 text-white">Elige Tu Plan</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              {/* Visita (Dark) */}
              <div className="bg-zinc-900 border border-white/5 p-10 rounded-xl relative overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2">
                 <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <svg viewBox="0 0 24 24" width="200" height="200" stroke="currentColor" strokeWidth="1" fill="none" className="text-white"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                 </div>
                 <div className="relative z-10 text-center">
                   <h4 className="text-2xl font-black mb-1 text-primary uppercase tracking-widest">Pase de Visita</h4>
                   <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-8">Entrenamiento Diario</p>
                   
                   <div className="mb-8">
                      <span className="text-6xl font-black text-primary">$15</span>
                      <div className="text-zinc-500 text-xs uppercase font-bold tracking-widest mt-2">por día</div>
                   </div>

                   <p className="text-zinc-400 text-xs uppercase font-bold tracking-widest mb-6">Tu acceso incluye</p>
                   
                   <ul className="space-y-2 mb-10 text-sm text-zinc-300 font-medium">
                      <li>Acceso Total (1 Día)</li>
                      <li>Uso de Equipos Libres</li>
                      <li>Duchas y Lockers</li>
                   </ul>
                   
                   <Button onClick={() => { setSelectedPlan("visita"); setIsModalOpen(true); }} className="w-full rounded-full h-12 bg-primary text-black hover:bg-yellow-500 hover:text-black font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20">
                      Seleccionar
                   </Button>
                 </div>
              </div>
              
              {/* Quincenal (Gold) */}
              <div className="bg-primary p-12 rounded-xl relative transform lg:scale-110 shadow-[0_20px_50px_rgba(250,204,21,0.3)] z-20 group transition-all duration-500 hover:scale-[1.15]">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl pointer-events-none"></div>
                 <div className="relative z-10 text-center">
                   <p className="text-black/60 text-xs font-bold uppercase tracking-widest mb-2">Más Popular</p>
                   <h4 className="text-3xl font-black mb-1 text-black uppercase tracking-widest">Plan Quincenal</h4>
                   <p className="text-black/60 text-xs uppercase tracking-widest font-bold mb-8">Dedicación Continua</p>
                   
                   <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110">
                      <span className="text-8xl font-black text-black tracking-tighter drop-shadow-md">$45</span>
                      <div className="text-black/60 text-xs uppercase font-bold tracking-widest mt-2">cada 15 días</div>
                   </div>

                   <p className="text-black/80 text-xs uppercase font-bold tracking-widest mb-6">Tu acceso incluye</p>
                   
                   <ul className="space-y-2 mb-10 text-sm text-black font-bold">
                      <li>Acceso Ilimitado (15 Días)</li>
                      <li>Asesoría de Entrenador</li>
                      <li>Acceso a Clases Grupales</li>
                   </ul>
                   
                   <Button onClick={() => { setSelectedPlan("quincenal"); setIsModalOpen(true); }} className="w-full rounded-full h-14 bg-black text-primary hover:text-white hover:bg-zinc-900 font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105 shadow-2xl">
                      Seleccionar
                   </Button>
                 </div>
              </div>

              {/* Mensual (Dark) */}
              <div className="bg-zinc-900 border border-white/5 p-10 rounded-xl relative overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2">
                 <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <Dumbbell className="w-64 h-64 text-white transform -rotate-45" />
                 </div>
                 <div className="relative z-10 text-center">
                   <h4 className="text-2xl font-black mb-1 text-primary uppercase tracking-widest">Plan Mensual</h4>
                   <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-8">Transformación Total</p>
                   
                   <div className="mb-8">
                      <span className="text-6xl font-black text-primary">$80</span>
                      <div className="text-zinc-500 text-xs uppercase font-bold tracking-widest mt-2">por mes</div>
                   </div>

                   <p className="text-zinc-400 text-xs uppercase font-bold tracking-widest mb-6">Tu acceso incluye</p>
                   
                   <ul className="space-y-2 mb-10 text-sm text-zinc-300 font-medium">
                      <li>Acceso 24/7 (30 Días)</li>
                      <li>Evaluación Física Mensual</li>
                      <li>Plan Nutricional Básico</li>
                   </ul>
                   
                   <Button onClick={() => { setSelectedPlan("mensual"); setIsModalOpen(true); }} className="w-full rounded-full h-12 bg-primary text-black hover:bg-yellow-500 hover:text-black font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105 shadow-lg shadow-primary/20">
                      Seleccionar
                   </Button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trainers Section */}
        <section id="trainers" className="px-6 py-24 md:py-32 border-b border-white/5 relative overflow-hidden">
           <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
              <div className="lg:w-1/3 transform transition-all duration-700 hover:translate-x-2">
                 <h3 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary"></span> Entrenadores
                 </h3>
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 leading-[1.1]">Tu Versión<br/>Más Fuerte<br/>Empieza Hoy</h2>
                 <Button className="h-14 px-8 font-bold bg-white text-black hover:bg-primary hover:text-black hover:scale-105 transition-all duration-300 rounded-sm uppercase tracking-widest shadow-xl">
                    Conocer al Equipo
                 </Button>
              </div>

              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8 w-full">
                 {[
                   { name: "JESSICA LEE", role: "Fuerza & Condición", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop" },
                   { name: "MARCUS CHEN", role: "Especialista HIIT", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop" }
                 ].map((trainer, i) => (
                   <div key={i} className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 aspect-[3/4] shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(250,204,21,0.15)]">
                      <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover object-top grayscale opacity-70 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                         <div className="w-12 h-1 bg-primary mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                         <h4 className="text-2xl font-black uppercase tracking-widest mb-1 text-white">{trainer.name}</h4>
                         <p className="text-primary text-sm font-bold uppercase tracking-widest">{trainer.role}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Motivation Section (Men / Workout) */}
        <section id="motivation" className="px-6 py-24 md:py-32 bg-zinc-950 relative overflow-hidden border-b border-white/5">
           <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
           
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column: Text & Icons */}
              <div className="relative z-10 flex flex-col justify-center">
                 <div className="mb-10">
                    <h2 className="text-6xl md:text-8xl font-black text-primary uppercase tracking-tighter leading-[0.8] mb-8 drop-shadow-2xl">
                       <span className="text-white text-4xl md:text-6xl block mb-2 opacity-90">Entrenamiento</span>
                       Del Día
                    </h2>
                    
                    <ul className="space-y-6">
                       <li className="flex items-center gap-6 group cursor-default">
                          <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                             <Dumbbell className="h-6 w-6" />
                          </div>
                          <span className="text-2xl font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors duration-300">Entrena Fuerte</span>
                       </li>
                       <li className="flex items-center gap-6 group cursor-default">
                          <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                             <Target className="h-6 w-6" />
                          </div>
                          <span className="text-2xl font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors duration-300">Mantén el Enfoque</span>
                       </li>
                       <li className="flex items-center gap-6 group cursor-default">
                          <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                             <Flame className="h-6 w-6" />
                          </div>
                          <span className="text-2xl font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors duration-300">Supera tus Límites</span>
                       </li>
                    </ul>
                 </div>

                 {/* Quote Box */}
                 <div className="relative pl-8 border-l-4 border-primary mb-12 py-4 group">
                    <Quote className="absolute -left-3 -top-3 h-10 w-10 text-zinc-800 opacity-50 z-0 group-hover:text-primary transition-colors duration-500" />
                    <p className="relative z-10 text-3xl font-black uppercase text-zinc-100 italic leading-snug tracking-tight">
                       "Tu única competencia <br/>es quien eras <br/> <span className="text-primary">ayer.</span>"
                    </p>
                 </div>

                 {/* 4 Bottom Icons */}
                 <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2 group">
                       <div className="w-12 h-12 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/><path d="M9 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0"/><path d="M7 21v-3a4 4 0 0 1 8 0v3"/></svg>
                       </div>
                       <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 group-hover:text-white">Disciplina</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                       <div className="w-12 h-12 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">
                          <Brain className="w-8 h-8" />
                       </div>
                       <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 group-hover:text-white">Enfoque</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                       <div className="w-12 h-12 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">
                          <TrendingUp className="w-8 h-8" />
                       </div>
                       <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 group-hover:text-white">Progreso</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                       <div className="w-12 h-12 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">
                          <Trophy className="w-8 h-8" />
                       </div>
                       <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 group-hover:text-white">Éxito</span>
                    </div>
                 </div>
              </div>

              {/* Right Column: Image */}
              <div className="relative z-10 w-full h-[600px] lg:h-[800px] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                 <img src="/img/mot.jpg" alt="Workout" className="w-full h-full object-cover object-top grayscale-[50%] hover:grayscale-0 transition-all duration-1000 transform hover:scale-105" />
                 

              </div>
           </div>

           {/* Full Width Banner Bottom */}
           <div className="mt-20 max-w-7xl mx-auto border-t-2 border-b-2 border-white/10 py-6 text-center bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]">
               <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                  Sin excusas, <span className="text-primary">solo resultados</span>
               </h3>
            </div>
         </section>



        {/* Transformation Section (Women / Journey) */}
        <section id="transformation" className="px-6 py-24 md:py-32 bg-zinc-950 relative overflow-hidden border-b border-white/5">
           <div className="max-w-7xl mx-auto">
              
              {/* Header */}
              <div className="text-center mb-16">
                 <p className="text-zinc-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">No me detengo cuando estoy cansado</p>
                 <p className="text-primary text-xl md:text-2xl font-serif italic mb-2">Me detengo cuando estoy orgulloso</p>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8]">
                    Viaje De<br/>Transformación
                 </h2>
              </div>

              {/* 3 Habit Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                 {/* Card 1 */}
                 <div className="relative h-80 rounded-sm overflow-hidden group bg-zinc-900 border border-white/5 flex flex-col justify-between p-6">
                    <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500" alt="Train Hard" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
                    <div className="relative z-10 text-center">
                       <div className="inline-block bg-black text-white font-black px-4 py-1 uppercase tracking-widest text-sm border-b-2 border-primary">Entrena Fuerte</div>
                    </div>
                    <div className="relative z-10 text-center">
                       <p className="text-white font-black uppercase tracking-widest mb-1 text-lg">Disciplina Hoy</p>
                       <p className="text-primary font-bold uppercase tracking-widest text-sm">Fuerza Mañana</p>
                    </div>
                 </div>
                 {/* Card 2 */}
                 <div className="relative h-80 rounded-sm overflow-hidden group bg-zinc-900 border border-white/5 flex flex-col justify-between p-6">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500" alt="Eat Clean" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
                    <div className="relative z-10 text-center">
                       <div className="inline-block bg-black text-white font-black px-4 py-1 uppercase tracking-widest text-sm border-b-2 border-primary">Come Sano</div>
                    </div>
                    <div className="relative z-10 text-center">
                       <p className="text-white font-black uppercase tracking-widest mb-1 text-lg">Buena Comida</p>
                       <p className="text-primary font-bold uppercase tracking-widest text-sm">Buen Humor</p>
                    </div>
                 </div>
                 {/* Card 3 */}
                 <div className="relative h-80 rounded-sm overflow-hidden group bg-zinc-900 border border-white/5 flex flex-col justify-between p-6">
                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500" alt="Stay Consistent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
                    <div className="relative z-10 text-center">
                       <div className="inline-block bg-black text-white font-black px-4 py-1 uppercase tracking-widest text-sm border-b-2 border-primary">Sé Constante</div>
                    </div>
                    <div className="relative z-10 text-center">
                       <p className="text-white font-black uppercase tracking-widest mb-1 text-lg">Pequeños Pasos</p>
                       <p className="text-primary font-bold uppercase tracking-widest text-sm">Grandes Cambios</p>
                    </div>
                 </div>
              </div>

              {/* Section Footer */}
              <div className="text-center">
                 <p className="text-zinc-400 text-lg md:text-xl font-bold uppercase tracking-widest mb-2">No es solo una transformación física</p>
                 <h3 className="text-3xl md:text-5xl font-serif text-primary italic mb-6">Es una transformación de vida</h3>
                 <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    <span>Siéntete orgulloso de tu progreso</span>
                    <span className="text-primary">/</span>
                    <span>Tú puedes</span>
                 </div>
              </div>

            </div>
         </section>

         {/* Location Section */}
         <section className="px-6 py-24 border-t border-white/5 bg-zinc-950 relative">
           <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-8">Nuestra<br/><span className="text-primary">Ubicación</span></h2>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0"><MapPin /></div>
                   <div>
                     <h4 className="text-white font-bold uppercase tracking-widest mb-1">Dirección</h4>
                     <p className="text-zinc-400 font-medium">123 Elite Ave, Distrito Financiero<br/>Nueva York, NY 10001</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0"><Clock /></div>
                   <div>
                     <h4 className="text-white font-bold uppercase tracking-widest mb-1">Horarios</h4>
                     <p className="text-zinc-400 font-medium">Lunes - Viernes: 5:00 AM - 11:00 PM<br/>Sábados - Domingos: 6:00 AM - 8:00 PM</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0"><Phone /></div>
                   <div>
                     <h4 className="text-white font-bold uppercase tracking-widest mb-1">Contacto</h4>
                     <p className="text-zinc-400 font-medium">+1 (555) 123-4567<br/>elite@pulsefitness.local</p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="w-full h-80 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                <iframe 
                  src="https://maps.google.com/maps?q=20.8626826,-86.9020937&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
             </div>
           </div>
         </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-6 pointer-events-none">
               <img src="/img/logo.png" alt="Gym California Logo" className="h-14 w-14 rounded-full object-cover border border-white/20 shadow-md" />
             </div>
             <p className="text-zinc-500 text-sm font-medium">Eleva tu potencial con entrenamiento de élite e instalaciones premium.</p>
          </div>
          
          <div>
            <h5 className="font-bold uppercase tracking-widest mb-6 text-sm text-white">Explorar</h5>
            <ul className="space-y-3 text-zinc-400 text-sm font-medium">
               <li><a href="#programs" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Programas</a></li>
               <li><a href="#membership" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Membresía</a></li>
               <li><a href="#trainers" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Entrenadores</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-widest mb-6 text-sm text-white">Soporte</h5>
            <ul className="space-y-3 text-zinc-400 text-sm font-medium">
               <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Preguntas Frecuentes</a></li>
               <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Contacto</a></li>
               <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Privacidad</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-widest mb-6 text-sm text-white">Síguenos</h5>
            <div className="flex gap-4">
               <a href="https://www.instagram.com/p/DWonHCwDoOD/" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               </a>
               <a href="https://www.facebook.com/Gym.CaliforniaPuertoMorelos/" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase font-bold">
           <p>© 2026 Pulse Fitness.</p>
           <div className="flex items-center gap-2 text-primary">
             <MapPin className="h-4 w-4" />
             <span className="text-zinc-500">123 Elite Ave, NY 10001</span>
           </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-primary hover:text-black text-white rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Image */}
            <div className="w-full md:w-5/12 h-48 md:h-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950 md:bg-gradient-to-t md:from-zinc-950 md:to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60" alt="Gym" />
            </div>

            {/* Modal Form */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative z-20 flex flex-col justify-center">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Únete a la <span className="text-primary">Élite</span></h3>
              <p className="text-zinc-400 text-sm mb-8 font-medium">Esfuerzo, disciplina y constancias los limites solo estan en tu mente</p>
              
              {successMessage ? (
                <div className="bg-primary/20 text-primary border border-primary/50 p-4 rounded-md text-center font-bold uppercase tracking-widest">
                  {successMessage}
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nombre Completo</label>
                    <input type="text" name="name" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Teléfono</label>
                      <input type="tel" name="phone" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="+1 234 567 890" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Correo Electrónico</label>
                      <input type="email" name="email" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="correo@ejemplo.com" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Membresía</label>
                    <select name="membership" required value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                      <option value="" className="text-zinc-500">Selecciona...</option>
                      <option value="visita">Pase de Visita ($15)</option>
                      <option value="quincenal">Plan Quincenal ($45)</option>
                      <option value="mensual">Plan Mensual ($80)</option>
                    </select>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-primary text-black hover:bg-yellow-500 hover:text-black font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.2)] border-none disabled:opacity-50 disabled:hover:scale-100">
                    {isLoading ? "Enviando..." : "Enviar Solicitud"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-primary hover:text-black text-white rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 md:p-10 relative z-20 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary">
                  <path d="M4 12H9L12 5L15 19L18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Bienvenido de <span className="text-primary">Vuelta</span></h3>
              <p className="text-zinc-400 text-sm mb-8 font-medium">Ingresa tus credenciales para acceder al panel.</p>
              
              <form className="space-y-4 text-left" onSubmit={handleLogin}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Correo Electrónico</label>
                  <input type="email" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="correo@ejemplo.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Contraseña</label>
                  <input type="password" required className="w-full bg-zinc-900 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-primary text-black hover:bg-yellow-500 hover:text-black font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.2)] border-none disabled:opacity-50 disabled:hover:scale-100">
                  {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {showFab && (
        <a href="#membership" className="fixed bottom-8 right-8 z-50 h-16 px-8 rounded-full bg-primary text-black font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(250,204,21,0.4)] hover:scale-110 hover:bg-yellow-500 transition-all duration-300 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-8 duration-500">
           Únete Ahora
           <Zap className="h-5 w-5 group-hover:animate-bounce" />
        </a>
      )}

    </div>
  );
}
