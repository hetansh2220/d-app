'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider, useTheme } from 'next-themes';

function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
          accentColor: '#059669',
          logo: undefined,
          walletChainType: 'solana-only',
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'all-users',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
    </ThemeProvider>
  );
}
