"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db';
import { MockInterview } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import RecordAnswers from './_components/RecordAnswers'
import QuestionsSection from './_components/QuestionSection'
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link'; // ✅ Correct import
import { useParams } from 'next/navigation'; // ✅ Correct import

function StartInterview() { 
    const { interviewId } = useParams(); // Use `useParams` hook to get interviewId from params

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        if (interviewId) {
            GerInterviewDetails();
        }
    }, [interviewId]); // Dependency on interviewId to reload data when it changes

    const GerInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId)); // Use interviewId from useParams

        if (result.length > 0) {
            const interview = result[0];
            const questions = JSON.parse(interview.jsonMockResp);

            setInterviewData(interview);
            setMockInterviewQuestion(questions); // set questions correctly
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} />
               
                {/* Video/Audio Recording */}
                <RecordAnswers 
                    mockInterviewQuestion={mockInterviewQuestion} 
                    activeQuestionIndex={activeQuestionIndex} 
                    interviewData={interviewData} 
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && 
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && 
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex === mockInterviewQuestion?.length - 1 && 
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'}>
                        <Button>End Interview</Button>
                    </Link>}
            </div>
        </div>
    );
}

export default StartInterview;
