import logo from '../../assets/brand/creatl-logo-original.png';

export default function BrandLogo({ className = '' }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src={logo} width="1960" height="800" alt="creatL" decoding="async" />;
}
