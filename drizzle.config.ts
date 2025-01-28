import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./config/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_6nG5RFKtoLki@ep-restless-fire-a7dmr5yb-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require",
  },
});
