const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function uploadToIPFS(file: File): Promise<string> {
  if (!PINATA_JWT) {
    console.warn('PINATA_JWT not set, using placeholder');
    return 'ipfs://placeholder';
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Pinata upload error:', errorData);
    throw new Error('Failed to upload to IPFS');
  }

  const data = await response.json();
  return `ipfs://${data.IpfsHash}`;
}

export async function uploadTextToIPFS(text: string, filename = 'story.txt'): Promise<string> {
  const blob = new Blob([text], { type: 'text/plain' });
  const file = new File([blob], filename, { type: 'text/plain' });
  return uploadToIPFS(file);
}

export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl || ipfsUrl === 'ipfs://placeholder') return '';
  const cid = ipfsUrl.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
