
/**
 * Domain and subdomain detection utilities
 */

export interface DomainInfo {
  hostname: string;
  subdomain: string;
  isMainDomain: boolean;
}

const MAIN_DOMAINS = ['koombo.online', 'ko-ombo.online', 'localhost', 'lovable.app'];

export const extractDomainInfo = (): DomainInfo => {
  const hostname = window.location.hostname;
  console.log('🔍 HOSTNAME DETECTION:', hostname);

  // Check if hostname is exactly a main domain or lovable preview
  const isExactMainDomain = 
    hostname === 'koombo.online' || 
    hostname === 'www.koombo.online' ||
    hostname === 'ko-ombo.online' ||
    hostname === 'www.ko-ombo.online' ||
    hostname === 'localhost' ||
    hostname.endsWith('.lovable.app');

  if (isExactMainDomain) {
    console.log('🏠 Main domain detected, showing general menu');
    return {
      hostname,
      subdomain: '',
      isMainDomain: true
    };
  }

  // Extract subdomain from supported domains
  let subdomain = '';
  if (hostname.endsWith('.koombo.online')) {
    subdomain = hostname.replace('.koombo.online', '');
  } else if (hostname.endsWith('.ko-ombo.online')) {
    subdomain = hostname.replace('.ko-ombo.online', '');
  }

  console.log('🎯 EXTRACTED SUBDOMAIN:', {
    original: hostname,
    extracted: subdomain,
    length: subdomain.length,
    type: typeof subdomain,
    isMainDomain: !subdomain
  });

  return {
    hostname,
    subdomain,
    isMainDomain: !subdomain
  };
};
