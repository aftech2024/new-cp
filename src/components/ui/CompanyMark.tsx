import aftechLogo from "@/assets/images/logo-aftech.png";
import haloraLogo from "@/assets/images/logo-halora.png";

export function AftechMark({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src={aftechLogo} alt="Aftech — PT Aftech Daya Solusindo" className={`${className} object-contain`} loading="lazy" />;
}

export function HaloraMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`${className} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-halora-bronze/40`}
    >
      <img src={haloraLogo} alt="Halora — PT Halora Galona Adikara" className="h-full w-full object-cover" loading="lazy" />
    </span>
  );
}
