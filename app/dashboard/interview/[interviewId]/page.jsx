"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function Interview() {
    const { interviewId } = useParams();
    const [interviewData, setInterviewData] = useState();
    const [WebcamEnabled, setWebcamEnabled] = useState(false);
    const [webcamError, setWebcamError] = useState(null);

    useEffect(() => {
        if (interviewId) {
            GerInterviewDetails();
        }
    }, [interviewId]);

    const GerInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                console.log("Interview not found.");
            }
        } catch (error) {
            console.error("Failed to fetch interview details:", error);
        }
    };

    const handleWebcamPermissionError = () => {
        setWebcamEnabled(false);
        setWebcamError("Error accessing webcam. Please ensure it's connected and try again.");
    };

    return (
        <div className='my-10 px-4 md:px-12 animate-fade-in'>
            <h2 className='font-extrabold text-3xl md:text-4xl mb-8 text-center text-purple-700'>🚀 Let’s Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up'>
                <div className='flex flex-col gap-6'>
                    {interviewData ? (
                        <>
                            <div className='p-6 rounded-xl border bg-white shadow-md hover:shadow-xl transition duration-300 space-y-4'>
                                <h2 className='text-lg'><strong className='text-purple-600'>Job Role:</strong> {interviewData.jobPosition}</h2>
                                <h2 className='text-lg'><strong className='text-purple-600'>Description:</strong> {interviewData.jobDesc}</h2>
                                <h2 className='text-lg'><strong className='text-purple-600'>Experience:</strong> {interviewData.jobExp}</h2>
                            </div>
                            <div className='p-6 border rounded-xl border-yellow-300 bg-yellow-50'>
                                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb className="text-yellow-500" /><strong>Info</strong></h2>
                                <h2 className='mt-3 text-yellow-600'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                            </div>
                        </>
                    ) : (
                        <p className="text-purple-600">Loading interview data...</p>
                    )}
                </div>

                <div className='flex flex-col items-center gap-4'>
                    {WebcamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebcamEnabled(true)}
                            onUserMediaError={handleWebcamPermissionError}
                            mirrored={true}
                            style={{
                                height: 300,
                                width: 300,
                                borderRadius: '1rem',
                                border: '4px solid #a855f7'
                            }}
                        />
                    ) : (
                        <>
                            {webcamError && <p className="text-red-500">{webcamError}</p>}
                            <WebcamIcon className='h-72 w-full p-16 bg-purple-100 rounded-xl border border-purple-200 text-purple-400' />
                            <Button
                                variant="ghost"
                                className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-all"
                                onClick={() => setWebcamEnabled(true)}
                            >
                                Enable Webcam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className='flex justify-end mt-10'>
                {interviewId && (
                    <Link href={`/dashboard/interview/${interviewId}/start`}>
                        <Button className='bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:brightness-110 transition-all rounded-full px-6 py-2'>
                            Start Interview
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Interview;
