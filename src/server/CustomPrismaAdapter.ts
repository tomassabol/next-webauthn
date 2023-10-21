import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type PrismaClient, type Prisma } from "@prisma/client";
import {
    type AdapterAccount,
    type Adapter,
    type AdapterUser,
  } from "next-auth/adapters";
import { uuidv7 } from "uuidv7";


  /* The point of this adapter is to add any extra metadata received from 
  the provider as a json field in the database. This is useful for example
    when using some providers that add extra fields.
  */
  export function CustomPrismaAdapter(p: PrismaClient): Adapter {
    const originalAdapter = PrismaAdapter(p);
    return {
      ...originalAdapter,
      createUser: async ({ email, emailVerified, image, name, ...rest }) => {
        const data = await p.user.create({
          data: {
            id: uuidv7(),
            email,
            emailVerified,
            image,
            name,
            metadata: rest,
          },
        });
        return data as AdapterUser;
      },
      linkAccount: async ({
        provider,
        providerAccountId,
        type,
        userId,
        access_token,
        expires_at,
        id_token,
        refresh_token,
        scope,
        session_state,
        token_type,
        ...rest
      }) => {
        const data = await p.account.create({
          data: {
            id: uuidv7(),
            provider,
            providerAccountId,
            type,
            access_token,
            expires_at,
            id_token,
            refresh_token,
            scope,
            session_state,
            token_type,
            user: { connect: { id: userId } },
            metadata: rest as Prisma.InputJsonValue,
          },
        });
        return data as AdapterAccount;
      },
    };
  }
  