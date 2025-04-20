/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",          // Adjust path if needed
  dialect: "postgresql",                // ✅ Required for older versions                    // Change to a valid driver
  dbCredentials: {
    url:'postgresql://mockmate_owner:npg_7gfXjUpDx9hi@ep-floral-heart-a437xw9o.us-east-1.aws.neon.tech/mockmate?sslmode=require',
  }         
};

