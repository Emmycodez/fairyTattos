"use client";

import { BadgeCheck, ChevronDown, ChevronUp, Heart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoteButton from "./VoteButton";

const FeaturedSection = () => {
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const response = await fetch("/api/getImages");
        const data = await response.json();
        console.log("This is the data from the get Images route: ", data);
        if (!data.error) {
          setContestants(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };

    fetchContestants();
  }, []);

  const totalVotes = contestants.reduce(
    (sum, contestant) => sum + contestant.votes,
    0
  );

  return (
    <section id="artists" className="py-16 px-4 bg-gray-900">
      <h2 className="text-4xl font-bold text-center mb-12 text-white">
        Featured Tattoo Artists
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {contestants.map((contestant) => {
          const votePercentage =
            totalVotes > 0
              ? Math.round((contestant.votes / totalVotes) * 100)
              : 0;
          return (
            <Card
              key={contestant.id}
              className="overflow-hidden bg-gray-800 border-gray-700"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={`/uploads/${contestant.image}`}
                  alt={`${contestant.name}'s image`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <Badge className="absolute top-4 right-4 bg-teal-500 text-white p-3 text-md">
                  {votePercentage}%
                </Badge>
              </div>
              <CardContent className="relative -mt-16 bg-gray-800 rounded-t-3xl pt-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {contestant.name}
                </h3>
                <Progress
                  value={votePercentage}
                  className="h-2 mb-4"
                  indicatorclassname="bg-teal-500"
                />
                <div className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center">
                    <Heart className="text-red-500 mr-2" />
                    <span className="text-xl font-bold">
                      {contestant.votes} votes
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center justify-center w-full">
                  <VoteButton contestantId={contestant.id} />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedSection;
