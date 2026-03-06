import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Naujienos | PIKSEL - LED Reklamos Tinklas',
  description: 'PIKSEL naujienos, įvykiai ir atnaujinimai apie LED reklamos ekranus Lietuvoje.',
};

export default function NaujienosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
