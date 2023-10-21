import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { getServerAuthSession } from "~/server/auth";

export const getQueryClient = cache(() => new QueryClient());

export const getAuth = cache(() => getServerAuthSession());