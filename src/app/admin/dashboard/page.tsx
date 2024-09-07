import UserCard from "@/components/admin/UserCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Page = async () => {
  const buyers = await prisma.buyer.findMany();

  return (
    <div className="h-screen w-full px-12 py-8">
      {buyers && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {buyers.map((user: any) => {
              return <UserCard user={user} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
