"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '../../../../../../components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminAImodel';
import { db } from '../../../../../../utils/db';
import { UserAnswer } from '../../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswers({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const fullTranscript = results.map(r => r.transcript).join(' ');
    setUserAnswer(fullTranscript);
  }, [results]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer.length < 10) {
        setLoading(false);
        toast.error('Please speak a longer answer.');
        return;
      }

      await UpdateUserAnswer();
    } else {
      setUserAnswer('');
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);

      const question = mockInterviewQuestion[activeQuestionIndex]?.question;
      const correctAnswer = mockInterviewQuestion[activeQuestionIndex]?.answer;
      const email = user?.primaryEmailAddress?.emailAddress;

      const feedbackPrompt = `Question: ${question}, User Answer: ${userAnswer}, Based on the question and answer, give a rating (1-10) and feedback (3–5 lines) in JSON format with "rating" and "feedback" fields.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawText = await result.response.text();
      const cleanedText = rawText.replace(/```json|```/g, '').trim();
      const JsonFeedbackResp = JSON.parse(cleanedText);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question,
        correctAnswer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: email,
        createdAt: moment().format('DD-MM-YYYY'),
      });

      toast.success('Your answer was saved successfully!');
      setUserAnswer('');
      setResults([]);
    } catch (err) {
      toast.error('Failed to save your answer or get feedback.');
      console.error("❌ Error in UpdateUserAnswer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center flex-col animate-fade-in'>
      <div className='relative flex flex-col justify-center items-center my-20 rounded-2xl p-5 border bg-gradient-to-br from-purple-900 to-black shadow-lg'>
        <Image
          src={'/webcam.png'}
          width={200}
          height={200}
          className='absolute opacity-30'
          alt='anypic'
        />
        <Webcam
          mirrored={true}
          className='rounded-xl border-4 border-purple-500'
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant='ghost'
        className={`my-10 px-6 py-3 rounded-full shadow-md transition-all text-white ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className='flex gap-2 items-center'>
            <StopCircle className='w-5 h-5' />
            Stop Recording
          </h2>
        ) : (
          <h2 className='flex gap-2 items-center'>
            <Mic className='w-5 h-5' />
            Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswers;
