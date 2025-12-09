import { prisma } from './lib/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.session.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.project.deleteMany();
  await prisma.templateComponent.deleteMany();
  await prisma.template.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeS86E36P4/eAa', // hashed 'password123'
      subscriptionTier: 'pro',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create templates
  const templates = await Promise.all([
    prisma.template.create({
      data: {
        name: 'Viral Facts Dark',
        category: 'Educational',
        description: 'Dark themed template for educational facts',
        thumbnailUrl: 'https://picsum.photos/seed/template1/300/500',
        defaultDuration: 3,
        isPublished: true,
        createdBy: user.id,
      },
    }),
    prisma.template.create({
      data: {
        name: 'Motivational Sunrise',
        category: 'Inspiration',
        description: 'Inspiring template with sunrise visuals',
        thumbnailUrl: 'https://picsum.photos/seed/template2/300/500',
        defaultDuration: 4,
        isPublished: true,
        createdBy: user.id,
      },
    }),
    prisma.template.create({
      data: {
        name: 'Reddit Stories',
        category: 'Storytime',
        description: 'Perfect for telling stories from Reddit',
        thumbnailUrl: 'https://picsum.photos/seed/template3/300/500',
        defaultDuration: 3,
        isPublished: true,
        createdBy: user.id,
      },
    }),
    prisma.template.create({
      data: {
        name: 'Tech Product Showcase',
        category: 'Promotional',
        description: 'Showcase tech products in style',
        thumbnailUrl: 'https://picsum.photos/seed/template4/300/500',
        defaultDuration: 5,
        isPublished: true,
        createdBy: user.id,
      },
    }),
    prisma.template.create({
      data: {
        name: 'Podcast Clip',
        category: 'Social',
        description: 'Format for podcast clips',
        thumbnailUrl: 'https://picsum.photos/seed/template5/300/500',
        defaultDuration: 3,
        isPublished: true,
        createdBy: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${templates.length} templates`);

  // Create sample project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Motivational Quote #42',
      description: 'A motivational quote video',
      templateId: templates[1].id,
      status: 'draft',
    },
  });

  console.log(`✅ Created project: ${project.name}`);

  // Create scenes for the project
  const scenes = await Promise.all([
    prisma.scene.create({
      data: {
        projectId: project.id,
        sceneOrder: 1,
        text: 'The only way to do great work is to love what you do.',
        imageUrl: 'https://picsum.photos/seed/scene1/1080/1920',
        duration: 4,
        aiGenerated: false,
      },
    }),
    prisma.scene.create({
      data: {
        projectId: project.id,
        sceneOrder: 2,
        text: 'Success is not final, failure is not fatal.',
        imageUrl: 'https://picsum.photos/seed/scene2/1080/1920',
        duration: 3,
        aiGenerated: false,
      },
    }),
    prisma.scene.create({
      data: {
        projectId: project.id,
        sceneOrder: 3,
        text: 'Your time is limited, do not waste it living someone elses life.',
        imageUrl: 'https://picsum.photos/seed/scene3/1080/1920',
        duration: 4,
        aiGenerated: false,
      },
    }),
  ]);

  console.log(`✅ Created ${scenes.length} scenes`);

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
