import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const departments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Gynecology',
  'Ophthalmology',
  'Oncology',
  'Gastroenterology'
] as const;

const doctorSeed = [
  { name: 'Dr. Emma Ross', specialization: 'Interventional Cardiology', experience: 12, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', availability: 'Mon-Fri 09:00-15:00' },
  { name: 'Dr. Liam Patel', specialization: 'Electrophysiology', experience: 9, image: 'https://images.unsplash.com/photo-1612531385446-f7b6b8f9b3d1?w=500', availability: 'Mon-Thu 10:00-17:00' },
  { name: 'Dr. Sophia Kim', specialization: 'Clinical Neurology', experience: 11, image: 'https://images.unsplash.com/photo-1594824475317-6f8097fce1f5?w=500', availability: 'Tue-Sat 09:00-16:00' },
  { name: 'Dr. Noah Garcia', specialization: 'Stroke Neurology', experience: 8, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500', availability: 'Mon-Fri 11:00-17:00' },
  { name: 'Dr. Olivia Chen', specialization: 'Sports Orthopedics', experience: 7, image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500', availability: 'Mon-Fri 08:30-14:30' },
  { name: 'Dr. Ethan Brooks', specialization: 'Joint Replacement', experience: 13, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500', availability: 'Wed-Sun 09:30-16:30' },
  { name: 'Dr. Ava Wilson', specialization: 'General Pediatrics', experience: 10, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', availability: 'Mon-Fri 09:00-17:00' },
  { name: 'Dr. Mason Lee', specialization: 'Pediatric Pulmonology', experience: 6, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500', availability: 'Tue-Sat 10:00-16:00' },
  { name: 'Dr. Isabella Nguyen', specialization: 'Cosmetic Dermatology', experience: 9, image: 'https://images.unsplash.com/photo-1597764699510-74f5f7698687?w=500', availability: 'Mon-Fri 09:00-15:00' },
  { name: 'Dr. Lucas Martin', specialization: 'Dermatopathology', experience: 14, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500', availability: 'Mon-Thu 12:00-18:00' },
  { name: 'Dr. Mia Thompson', specialization: 'High-Risk Pregnancy', experience: 12, image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500', availability: 'Mon-Fri 08:00-14:00' },
  { name: 'Dr. James Anderson', specialization: 'Reproductive Medicine', experience: 8, image: 'https://images.unsplash.com/photo-1659353886862-5fd1ff9f0217?w=500', availability: 'Tue-Sat 10:00-18:00' },
  { name: 'Dr. Charlotte Hall', specialization: 'Retina Specialist', experience: 11, image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500', availability: 'Mon-Fri 09:00-16:00' },
  { name: 'Dr. Benjamin Young', specialization: 'Cornea Specialist', experience: 9, image: 'https://images.unsplash.com/photo-1578496781769-10245f0f8b8f?w=500', availability: 'Mon-Thu 08:30-15:30' },
  { name: 'Dr. Amelia Scott', specialization: 'Medical Oncology', experience: 15, image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500', availability: 'Mon-Fri 10:00-17:00' },
  { name: 'Dr. Henry Adams', specialization: 'Radiation Oncology', experience: 10, image: 'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=500', availability: 'Tue-Sat 09:00-15:00' },
  { name: 'Dr. Evelyn Perez', specialization: 'Hepatology', experience: 13, image: 'https://images.unsplash.com/photo-1651008386074-3f41f88367f3?w=500', availability: 'Mon-Fri 09:30-16:30' },
  { name: 'Dr. Daniel Rivera', specialization: 'Digestive Endoscopy', experience: 7, image: 'https://images.unsplash.com/photo-1580281657527-47d4d7ef8639?w=500', availability: 'Wed-Sun 10:00-17:00' }
];

async function main() {
  for (const [index, name] of departments.entries()) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} specialists`, createdBy: 1 }
    });

    const pair = doctorSeed.slice(index * 2, index * 2 + 2);
    for (const doc of pair) {
      const exists = await prisma.doctor.findFirst({ where: { name: doc.name, deletedAt: null } });
      if (!exists) {
        await prisma.doctor.create({
          data: {
            name: doc.name,
            specialization: doc.specialization,
            experience: doc.experience,
            profileImageUrl: doc.image,
            availability: doc.availability,
            departmentId: dept.id,
            createdBy: 1
          }
        });
      }
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
