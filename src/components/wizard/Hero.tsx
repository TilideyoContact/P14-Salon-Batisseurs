import { Shield, Award, MapPin } from "lucide-react";

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-navy via-navy to-teal text-white py-12 md:py-16 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-turq/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-xl">
          Salon des Bâtisseurs 2026 · Fort-de-France
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-4 leading-tight">
          Configurez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-turq to-teal">formation sur mesure</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 text-balance">
          3 parcours — Architecture, BIM, 3D & IA. Composez votre programme, profitez de <b className="text-white">jusqu'à -35%</b> aujourd'hui.
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          <Stat value="-35%" label="Offre salon" highlight />
          <Stat value="3" label="Parcours" />
          <Stat value="24" label="Modules" />
          <Stat value="114,5 h" label="de formation" />
        </div>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-white/60 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Certifié Qualiopi
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Certifications RS6776 · RS6372
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Martinique · Guadeloupe · Guyane
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={`px-5 py-3 rounded-2xl backdrop-blur-sm border flex flex-col items-center min-w-[110px] ${
      highlight 
        ? "bg-magenta/20 border-magenta/50 shadow-[0_0_15px_rgba(198,30,90,0.3)]" 
        : "bg-white/5 border-white/10"
    }`}>
      <span className={`text-2xl font-bold font-display ${highlight ? "text-magenta" : "text-white"}`}>
        {value}
      </span>
      <span className="text-xs text-white/70 uppercase tracking-wider font-semibold mt-1">
        {label}
      </span>
    </div>
  );
}
