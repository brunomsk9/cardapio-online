
import { useState, useEffect } from 'react';
import { extractDomainInfo } from '@/utils/domainUtils';

export const useDomainDetection = () => {
  const [domainInfo, setDomainInfo] = useState<{
    hostname: string;
    subdomain: string;
    isMainDomain: boolean;
  } | null>(null);

  useEffect(() => {
    const info = extractDomainInfo();
    setDomainInfo(info);
  }, []);

  return domainInfo;
};
