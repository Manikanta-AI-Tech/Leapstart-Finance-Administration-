import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LeapStart Finance & Admissions database...");

  // ─────────────────────────────────────
  // 1. Create default admin user profile
  // ─────────────────────────────────────
  const adminProfile = await prisma.profile.upsert({
    where: { email: "admin@leapstart.edu" },
    update: {},
    create: {
      userId: "00000000-0000-0000-0000-000000000000", // Placeholder — replace with actual Supabase auth user ID
      email: "admin@leapstart.edu",
      role: Role.ADMIN,
      fullName: "Admin User",
    },
  });

  console.log(`   ✅ Admin profile created/verified: ${adminProfile.email}`);

  // ─────────────────────────────────────
  // 2. Insert default settings rows
  // ─────────────────────────────────────

  const settings = [
    { key: "receipt_prefix", value: "LS" },
    { key: "academic_year", value: "2026-2027" },
    { key: "institute_name", value: "LeapStart School of Technology" },
    { key: "institute_address", value: "LeapStart Campus, Innovation Hub" },
    { key: "institute_phone", value: "+91-0000000000" },
    { key: "institute_email", value: "info@leapstart.edu" },
    { key: "currency", value: "INR" },
    { key: "gst_number", value: "" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
    console.log(`   ✅ Setting "${setting.key}" = "${setting.value}"`);
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
