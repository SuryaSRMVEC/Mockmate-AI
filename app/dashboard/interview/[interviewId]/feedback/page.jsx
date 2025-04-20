"use client";
import { db } from '../../../../../utils/db';
import { UserAnswer } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../../components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useRouter, useParams } from 'next/navigation';

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0); // State to store overall rating
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.interviewId) {
      GetFeedback(params.interviewId);
    }
  }, [params?.interviewId]);

  const GetFeedback = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      // Calculate overall rating
      if (result.length > 0) {
        const totalRating = result.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = (totalRating / result.length).toFixed(1); // Round to 1 decimal place
        setOverallRating(averageRating);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  };

  return (
    <div className='p-6 md:p-10 animate-fade-in'>
      {feedbackList?.length === 0 ? (
        <h2 className='font-semibold text-xl text-gray-400'>No interview feedback record found</h2>
      ) : (
        <>
          <div className='mb-6'>
            <h2 className='text-3xl font-bold text-purple-700'>🎉 Congratulations!</h2>
            <h2 className='text-xl font-semibold mt-1 text-gray-800'>
              Here is your interview feedback
            </h2>
            <h2 className='text-purple-500 text-md my-2'>
              Your overall interview rating:
              <strong className='ml-1 text-purple-800'>{overallRating}/10</strong>
            </h2>
            <p className='text-sm text-gray-500'>
              Find below each interview question with your answer, the correct answer, and improvement feedback.
            </p>
          </div>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-4 border border-purple-200 rounded-xl shadow-sm transition-all duration-300'>
              <CollapsibleTrigger className='p-4 bg-purple-50 hover:bg-purple-100 rounded-t-xl flex justify-between items-center text-left w-full font-medium text-purple-700'>
                <span>{item.question}</span>
                <ChevronsUpDown className='h-5 w-5 text-purple-500' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='p-4 bg-white border-t border-purple-100 rounded-b-xl flex flex-col gap-3 text-sm'>
                  <div className='text-purple-700'>
                    <strong>Rating:</strong> {item.rating}
                  </div>
                  <div className='bg-red-50 p-3 rounded-lg text-red-800 border border-red-200'>
                    <strong>Your Answer:</strong> {item.userAns}
                  </div>
                  <div className='bg-green-50 p-3 rounded-lg text-green-800 border border-green-200'>
                    <strong>Correct Answer:</strong> {item.correctAnswer}
                  </div>
                  <div className='bg-blue-50 p-3 rounded-lg text-blue-800 border border-blue-200'>
                    <strong>Feedback:</strong> {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <div className='mt-10'>
        <Button
          className='bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 shadow-md transition-all'
          onClick={() => router.replace('/dashboard')}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default Feedback;