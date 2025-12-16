"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../components/LandingPage';

export default function Page() {
  const router = useRouter();

  return (
    <LandingPage onLogin={() => router.push('/login')} />
  );
}