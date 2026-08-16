import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from 'mongodb';
import { sendWelcomeEmail } from "./email";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db("property-rental");

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "tenant", 
        input: true, 
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const appName = "BrickWise";
          await sendWelcomeEmail({
            to: user.email,
            userName: user.name,
            appName
          });
        }
      }
    }
  },
  database: mongodbAdapter(db, {
    client
  })
});