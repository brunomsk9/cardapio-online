
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

  // Check if it's a main domain or preview environment
  if (MAIN_DOMAINS.some(domain => hostname.includes(domain))) {
    console.log('🏠 Main domain detected, showing general menu');
    return {
      hostname,
      subdomain: '',
      isMainDomain: true
    };
  }

  // Extract subdomain from supported domains
  let subdomain = '';
  if (hostname.includes('.koombo.online')) {
    subdomain = hostname.replace('.koombo.online', '');
  } else if (hostname.includes('.ko-ombo.online')) {
    subdomain = hostname.replace('.ko-ombo.online', '');
  }

  console.log('🎯 EXTRACTED SUBDOMAIN:', {
    original: hostname,
    extracted: subdomain,
    length: subdomain.length,
    type: typeof subdomain
  });

  return {
    hostname,
    subdomain,
    isMainDomain: !subdomain
  };
};
