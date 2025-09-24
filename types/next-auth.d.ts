import { User as CustomUser } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: CustomUser;
  }

  interface User extends CustomUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: CustomUser;
  }
}
