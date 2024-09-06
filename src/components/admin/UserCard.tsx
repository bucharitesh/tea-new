"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const UserCard = ({ user }: { user: any }) => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");

  const onActionTaken = async (
    user_id: string,
    tenant: "buyer" | "seller",
    action: "VERIFIED" | "REJECTED" | "PENDING"
  ) => {
    const res = await fetch("/api/update-user", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        tenant,
        action,
        password: action === "VERIFIED" ? password : undefined
      }),
    });

    const data = await res.json();

    if (!data?.error) {
      toast.success("success!");
      router.refresh();
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div className="rounded-lg p-8 flex flex-col gap-4 w-full bg-gray-200">
      <span className="text-2xl font-bold">{user?.name ?? user?.user_id}</span>
      <p className="text-lg">Type: BUYER</p>
      <Label>Client Password:</Label>
      <Input
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        required
        placeholder="Password"
      />
      <div className="grid grid-cols-3 gap-2">
        <Button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onActionTaken(user?.user_id, "buyer", "VERIFIED")}
          disabled={password === ""}
        >
          Approve
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onActionTaken(user?.user_id, "buyer", "REJECTED")}
        >
          Reject
        </Button>
        <Button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onActionTaken(user?.user_id, "buyer", "PENDING")}
        >
          Later
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
