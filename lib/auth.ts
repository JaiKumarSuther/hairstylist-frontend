import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from './types';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // TODO: Replace with actual API call
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Convert NextAuth user to our custom User type
        const customUser: User = {
          id: user.id || '',
          name: user.name || '',
          email: user.email || '',
          avatar: user.image || undefined,
          isPremium: false,
          trialDaysLeft: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        token.user = customUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Handle social login user creation/update
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // TODO: Create or update user in database
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: account.provider,
              providerId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (!response.ok) {
            return false;
          }

          const userData = await response.json();
          user.id = userData.id;
          user.isPremium = userData.isPremium;
          user.trialDaysLeft = userData.trialDaysLeft;
        } catch (error) {
          console.error('Social auth error:', error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Auth helper functions
export const getServerSession = async () => {
  // This would be implemented with getServerSession from next-auth
  // For now, return null as placeholder
  return null;
};

export const requireAuth = async () => {
  const session = await getServerSession();
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { session } };
};

// User permission helpers
export const hasPermission = (user: User): boolean => {
  // TODO: Implement permission system
  return user.isPremium || user.trialDaysLeft > 0;
};

export const canAccessFeature = (user: User, feature: string): boolean => {
  const premiumFeatures = ['ai-chat', 'offline-download', 'priority-support'];
  
  if (premiumFeatures.includes(feature)) {
    return user.isPremium;
  }
  
  return true;
};

// Trial management
export const getTrialStatus = (user: User) => {
  if (user.isPremium) {
    return { isActive: false, daysLeft: 0, isExpired: false };
  }
  
  const isExpired = user.trialDaysLeft <= 0;
  return {
    isActive: !isExpired,
    daysLeft: Math.max(0, user.trialDaysLeft),
    isExpired
  };
};

// Subscription helpers
export const getSubscriptionStatus = (user: User) => {
  if (user.isPremium) {
    return {
      status: 'active',
      type: 'premium',
      expiresAt: null // Lifetime subscription
    };
  }
  
  const trialStatus = getTrialStatus(user);
  return {
    status: trialStatus.isExpired ? 'expired' : 'trial',
    type: 'trial',
    expiresAt: new Date(Date.now() + trialStatus.daysLeft * 24 * 60 * 60 * 1000)
  };
};

