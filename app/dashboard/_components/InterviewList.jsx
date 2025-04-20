"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { desc, eq } from "drizzle-orm";
import InterviewCard from "./InterviewCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    // Simulating DB fetch for mock interviews
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.CreatedBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
  };

  const handleDelete = (deletedMockId) => {
    // Remove the deleted interview from the list
    setInterviewList(interviewList.filter((interview) => interview.mockId !== deletedMockId));
  };

  return (
    <div>
      <h2 className="font-medium text-xl mb-4">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewList &&
          interviewList.map((interview, index) => (
            <InterviewCard
              interview={interview}
              key={index}
              onDelete={handleDelete} // Pass the delete handler
            />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;