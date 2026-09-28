import React from 'react';

export const CategoryIcon = ({ name, className = "w-14 h-14" }) => {
  const iconProps = {
    className,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (name) {
    case 'Maintenance Service Parts':
      return (
        <svg {...iconProps}>
          {/* Car outline */}
          <rect x="8" y="24" width="48" height="20" rx="6" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M16 24L22 14H42L48 24" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="44" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="46" cy="44" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          {/* Wrench */}
          <path d="M26 10L36 10M31 6V14" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Filters':
      return (
        <svg {...iconProps}>
          <rect x="14" y="16" width="36" height="32" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M14 24H50M14 32H50M14 40H50" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M22 10V16M42 10V16" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 48V54M42 48V54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Windscreen Cleaning System':
      return (
        <svg {...iconProps}>
          <path d="M10 44C10 44 20 20 54 20C54 20 44 44 10 44Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M32 44L44 26" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 24L48 28" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="14" r="1.5" fill="#0EA5E9" />
          <circle cx="54" cy="18" r="1.5" fill="#0EA5E9" />
        </svg>
      );

    case 'Accessories':
      return (
        <svg {...iconProps}>
          <rect x="22" y="24" width="20" height="28" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M28 24V14C28 11.8 29.8 10 32 10C34.2 10 36 11.8 36 14V24" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="36" r="4" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'Lighting':
      return (
        <svg {...iconProps}>
          <path d="M24 16H40V32C40 38 34 44 32 44C30 44 24 38 24 32V16Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <rect x="26" y="44" width="12" height="6" rx="1" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <path d="M12 24H18M46 24H52M16 14L20 18M48 14L44 18" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Control Cables':
      return (
        <svg {...iconProps}>
          <path d="M18 12V36C18 44 26 50 32 50C38 50 46 44 46 36V12" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="14" y="10" width="8" height="12" rx="2" stroke="#0EA5E9" strokeWidth="2" fill="#F8FAFC" />
          <rect x="42" y="10" width="8" height="12" rx="2" stroke="#0EA5E9" strokeWidth="2" fill="#F8FAFC" />
        </svg>
      );

    case 'Brake System':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="18" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="32" cy="32" r="8" stroke="#1E293B" strokeWidth="2" fill="#E2E8F0" />
          <path d="M16 20C20 14 28 12 34 12V24C30 24 26 25 24 28L16 20Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="32" cy="20" r="1.5" fill="#1E293B" />
          <circle cx="44" cy="32" r="1.5" fill="#1E293B" />
          <circle cx="32" cy="44" r="1.5" fill="#1E293B" />
          <circle cx="20" cy="32" r="1.5" fill="#1E293B" />
        </svg>
      );

    case 'Bearings':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="32" cy="32" r="10" stroke="#1E293B" strokeWidth="2" fill="#E2E8F0" />
          <circle cx="32" cy="17" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="42" cy="24" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="42" cy="40" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="32" cy="47" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="22" cy="40" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="22" cy="24" r="3" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
        </svg>
      );

    case 'Clutch System':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="32" cy="32" r="12" stroke="#0EA5E9" strokeWidth="2.5" fill="#E0F2FE" />
          <circle cx="32" cy="32" r="5" stroke="#1E293B" strokeWidth="2" fill="#1E293B" />
          <path d="M32 12V20M32 44V52M12 32H20M44 32H52" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Electric Components':
      return (
        <svg {...iconProps}>
          <rect x="16" y="20" width="32" height="28" rx="3" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M24 14V20M40 14V20" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="30" r="4" fill="#0EA5E9" />
          <circle cx="38" cy="30" r="4" fill="#0EA5E9" />
          <path d="M22 40H42" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Engine':
      return (
        <svg {...iconProps}>
          <rect x="14" y="22" width="36" height="24" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M22 22V14H42V22" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 30H10M50 30H54" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 34L28 30L34 38L40 34" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'Engine Cooling System':
      return (
        <svg {...iconProps}>
          <rect x="12" y="24" width="40" height="24" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M20 24V16H44V24" stroke="#1E293B" strokeWidth="2" />
          <circle cx="32" cy="36" r="7" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <path d="M32 29V43M25 36H39" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="14" r="3" fill="#38BDF8" />
        </svg>
      );

    case 'Suspension and Arms':
      return (
        <svg {...iconProps}>
          <path d="M20 12V52M44 12V52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 20C28 20 36 20 44 20" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 32C28 32 36 32 44 32" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 44C28 44 36 44 44 44" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'Towbar Parts':
      return (
        <svg {...iconProps}>
          <path d="M12 40H36C44 40 48 36 48 28V24" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="18" r="6" stroke="#1E293B" strokeWidth="2.5" fill="#0EA5E9" />
          <rect x="12" y="34" width="8" height="12" rx="2" fill="#1E293B" />
        </svg>
      );

    case 'Transmission':
      return (
        <svg {...iconProps}>
          <path d="M32 12V36" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="12" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <path d="M20 22H44M20 36H44" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 22V16M32 22V16M44 22V16M20 36V44M44 36V44" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Trims':
      return (
        <svg {...iconProps}>
          <rect x="14" y="14" width="36" height="36" rx="6" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M14 26H50M26 14V50" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="38" cy="38" r="4" fill="#0EA5E9" />
        </svg>
      );

    case 'Tyres and Alloys':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="3" fill="#F8FAFC" />
          <circle cx="32" cy="32" r="10" stroke="#0EA5E9" strokeWidth="2.5" fill="#E0F2FE" />
          <circle cx="32" cy="32" r="4" fill="#1E293B" />
          <path d="M32 12V22M32 42V52M12 32H22M42 32H52" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Universal':
      return (
        <svg {...iconProps}>
          <path d="M24 16H40V24L36 28V48H28V28L24 24V16Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M24 20H40M28 34H36M28 40H36" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Wheels':
      return (
        <svg {...iconProps}>
          <rect x="14" y="24" width="36" height="16" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="22" cy="32" r="6" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="42" cy="32" r="6" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <path d="M28 32H36" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Belts, Chains and Rollers':
      return (
        <svg {...iconProps}>
          <circle cx="22" cy="32" r="10" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="42" cy="32" r="6" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M22 22H42M22 42H42" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="32" r="3" fill="#0EA5E9" />
          <circle cx="42" cy="32" r="2" fill="#0EA5E9" />
        </svg>
      );

    case 'Workshop Consumables':
      return (
        <svg {...iconProps}>
          <rect x="18" y="24" width="16" height="26" rx="3" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M24 24V14H28V24" stroke="#1E293B" strokeWidth="2" fill="#0EA5E9" />
          <path d="M38 20L46 28M46 20L38 28" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Car Care and Detailing':
      return (
        <svg {...iconProps}>
          <rect x="22" y="20" width="20" height="30" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M32 10V20M26 14H38" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="18" r="2" fill="#38BDF8" />
          <circle cx="48" cy="14" r="3" fill="#38BDF8" />
          <circle cx="50" cy="26" r="2" fill="#38BDF8" />
        </svg>
      );

    case 'Exhaust System':
      return (
        <svg {...iconProps}>
          <rect x="14" y="26" width="24" height="14" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M38 33H50" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <path d="M52 26C54 24 56 24 56 22M52 33C55 31 57 31 58 29M52 40C54 38 56 38 56 36" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 33H10" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'Air Conditioning':
      return (
        <svg {...iconProps}>
          <rect x="14" y="20" width="36" height="24" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M22 28H42M22 36H42" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="12" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M48 9V15M45 12H51" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'Fuel Supply System':
      return (
        <svg {...iconProps}>
          <rect x="18" y="20" width="24" height="28" rx="4" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M42 26H48V42H44" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="32" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'Gaskets and Sealing Rings':
      return (
        <svg {...iconProps}>
          <rect x="12" y="20" width="40" height="24" rx="6" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <circle cx="22" cy="32" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="32" cy="32" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="42" cy="32" r="5" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'Ignition and Glowplug System':
      return (
        <svg {...iconProps}>
          <path d="M28 16H36V24L32 28V48H32V28L28 24V16Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M32 8L35 13H29L32 8Z" fill="#0EA5E9" stroke="#0EA5E9" strokeWidth="2" strokeLinejoin="round" />
          <path d="M26 20H38" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Interior and Comfort':
      return (
        <svg {...iconProps}>
          <path d="M20 18C20 14.7 22.7 12 26 12H38C41.3 12 44 14.7 44 18V36H20V18Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <rect x="16" y="36" width="32" height="12" rx="3" stroke="#1E293B" strokeWidth="2.5" fill="#0EA5E9" />
        </svg>
      );

    case 'Body':
      return (
        <svg {...iconProps}>
          <path d="M18 20L24 10H40L46 20M12 20H52V44H12V20Z" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#F8FAFC" />
          <circle cx="20" cy="44" r="4" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="44" cy="44" r="4" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'Oils and Fluids':
      return (
        <svg {...iconProps}>
          <path d="M20 22H40V48C40 50.2 38.2 52 36 52H24C21.8 52 20 50.2 20 48V22Z" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M28 14H32V22H28V14Z" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <path d="M40 28L48 24V40L40 36" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="36" r="4" fill="#0EA5E9" />
        </svg>
      );

    case 'Pipes and Hoses':
      return (
        <svg {...iconProps}>
          <path d="M16 16V28C16 36 24 44 32 44H48" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M16 16V28C16 36 24 44 32 44H48" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'Repair Kits':
      return (
        <svg {...iconProps}>
          <path d="M18 46L36 28M24 16L34 26" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <path d="M46 18L36 28" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="16" r="4" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="16" cy="44" r="4" fill="#0EA5E9" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'Sensors, Relays and Control Units':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="16" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M32 22V34" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="40" r="2.5" fill="#0EA5E9" />
        </svg>
      );

    case 'Steering':
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="3" fill="#F8FAFC" />
          <circle cx="32" cy="32" r="6" stroke="#1E293B" strokeWidth="2" fill="#0EA5E9" />
          <path d="M32 12V26M12 32H26M52 32H38" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="20" stroke="#1E293B" strokeWidth="2.5" fill="#F8FAFC" />
          <path d="M26 26L38 38M38 26L26 38" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
};
