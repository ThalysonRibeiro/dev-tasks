"use client"

import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'Desconhecido',
      platform: 'Desconhecido',
      language: 'pt-BR',
      screenResolution: 'Desconhecido',
      timezone: 'America/Sao_Paulo'
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Detectar dispositivo
  let deviceType = 'Desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/iPad|Android/i.test(userAgent)) {
    deviceType = 'Tablet';
  }

  // Detectar navegador
  let browser = 'Desconhecido';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  return {
    userAgent: `${browser} em ${deviceType}`,
    platform,
    language,
    screenResolution,
    timezone,
    fullUserAgent: userAgent
  };
}
