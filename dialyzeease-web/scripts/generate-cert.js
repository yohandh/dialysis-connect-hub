import { createCA, createCert } from 'mkcert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateCertificates() {
  console.log('Generating certificates for local HTTPS development...');
  
  const certsDir = path.join(__dirname, '..', 'certs');
  
  // Ensure the certs directory exists
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  
  // Create a CA (Certificate Authority)
  const ca = await createCA({
    organization: 'DialyzeEase Dev CA',
    countryCode: 'IN',
    state: 'Development',
    locality: 'Local',
    validityDays: 365
  });
  
  // Create a certificate signed by the CA
  const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ['localhost', '127.0.0.1', 'www.dialyzeease.org', 'dialyzeease.org'],
    validityDays: 365,
    organization: 'DialyzeEase Development',
    countryCode: 'IN',
    state: 'Development',
    locality: 'Local'
  });
  
  // Write the certificates to files
  fs.writeFileSync(path.join(certsDir, 'ca.key'), ca.key);
  fs.writeFileSync(path.join(certsDir, 'ca.cert'), ca.cert);
  fs.writeFileSync(path.join(certsDir, 'cert.key'), cert.key);
  fs.writeFileSync(path.join(certsDir, 'cert.cert'), cert.cert);
  
  console.log('Certificates generated successfully!');
  console.log(`Certificates saved to: ${certsDir}`);
  console.log('\nImportant: You need to trust the CA certificate in your browser/system to avoid security warnings.');
}

generateCertificates().catch(console.error);
