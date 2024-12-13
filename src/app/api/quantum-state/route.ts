import { NextResponse } from 'next/server';

export async function GET() {
  const headers = new Headers();
  headers.set('X-Quantum-State', 'superposition-achieved');
  
  // Add Fibonacci sequence in binary as another puzzle piece
  headers.set('X-Binary-Sequence', '1,1,10,11,101,1000,1101');
  
  return new NextResponse(JSON.stringify({
    message: 'Quantum state observed. Effect uncertain.',
    timestamp: Date.now(),
    // Include an encrypted message that can be decrypted with the solution
    encryptedHint: 'Um9hZCB0byBBdXRvbm9teSBsaWVzIGluIHRoZSBwYXR0ZXJucw=='
  }), {
    status: 200,
    headers
  });
}