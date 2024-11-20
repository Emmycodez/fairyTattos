import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { BadgeCheck } from "lucide-react";

const SuccessModal = () => {
  return (
    <div className="flex items-center justify-center h-screen backdrop-blur-lg bg-gray-700">
      <div className="bg-slate-100 w-full py-6 px-8">
        <div className="flex items-center justify-center flex-col">
          <BadgeCheck size={54} />
          <p className="text-2xl font-semibold">Done!</p>
        </div>
        <div className="mx-auto">
          <p className="text-center">
            Your vote is being processed. A voting code will be sent to you to
            complete your vote
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
