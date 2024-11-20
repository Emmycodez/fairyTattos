import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { fb, gp, ig, insta, out } from "@/images";
import Link from "next/link";

const VoteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button className="text-lg p-4 bg-teal-500 hover:bg-teal-600 text-white transition duration-300 flex items-center">
            Vote For Contestant <BadgeCheck />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Choose your preferred app to vote</DialogTitle>
          <DialogDescription className="flex flex-row justify-evenly items-center gap-2">
            <Link href="/facebook">
              <Image src={fb} alt="Facebook" width={90} height={50} />
            </Link>
            or{" "}
            <Link href="/instagram">
              <Image src={insta} alt="Instagram" width={60} />
            </Link>{" "}
            or{" "}
            <Link href="/gmail">
              <Image src={out} alt="outlook" width={50} />
            </Link>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default VoteButton;
