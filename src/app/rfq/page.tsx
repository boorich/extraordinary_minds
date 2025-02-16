import type { Metadata } from 'next';
import RFQContainer from './RFQContainer';

export const metadata: Metadata = {
  title: 'RFQ Template Generator | Vision Landing',
  description: 'Generate professional RFQ templates through an intelligent chat interface'
};

export default function RFQPage() {
  return <RFQContainer />;
}