import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export const register = async (fastify: FastifyInstance) => {
  await fastify.register(cors);

  
};
