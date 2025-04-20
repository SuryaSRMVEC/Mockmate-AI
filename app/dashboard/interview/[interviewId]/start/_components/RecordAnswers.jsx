"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "../../../../../../components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "../../../../../../utils/GeminAImodel";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswers({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false); // For webcam compulsion
  const [introductionFeedback, setIntroductionFeedback] = useState(""); // Store introduction feedback
  const [isIntroductionDone, setIsIntroductionDone] = useState(false); // Track if intro is completed

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

  // Update user answer as speech-to-text results are updated
  useEffect(() => {
    const fullTranscript = results.map((r) => r.transcript).join(" ");
    setUserAnswer(fullTranscript);
  }, [results]);

  // Handle start/stop recording and AI feedback
  const StartStopRecording = async () => {
    if (!webcamActive) {
      toast.error("Please enable your webcam to proceed.");
      return;
    }

    if (isRecording) {
      stopSpeechToText();

      if (userAnswer.trim().split(" ").length < 10) {
        toast.error("Please provide a longer response with at least 10 words.");
        return;
      }

      await UpdateUserAnswer();
    } else {
      setUserAnswer("");
      startSpeechToText();
    }
  };

  // Save the user's answer and get AI feedback
  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);

      const question = !isIntroductionDone
        ? "Introduce yourself"
        : mockInterviewQuestion[activeQuestionIndex]?.question;

      const email = user?.primaryEmailAddress?.emailAddress;

      // AI Assistant's feedback prompt
      const feedbackPrompt = `Question: ${question}, User Answer: ${userAnswer}, Provide a response as an AI interviewer with constructive feedback in 2–3 sentences.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const aiFeedback = await result.response.text();

      if (!isIntroductionDone) {
        // Update state to show introduction feedback
        setIntroductionFeedback(aiFeedback);
        setIsIntroductionDone(true); // Mark introduction as completed
        toast.success("Introduction completed! You can now proceed to the interview questions.");
      } else {
        // Save the user's answer to the database for actual questions
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question,
          userAns: userAnswer,
          feedback: aiFeedback,
          userEmail: email,
          createdAt: moment().format("DD-MM-YYYY"),
        });

        toast.success("Your answer was saved successfully!");
      }

      // Reset state for the next question
      setUserAnswer("");
      setResults([]);
    } catch (err) {
      toast.error("Failed to save your answer or get feedback.");
      console.error("❌ Error in UpdateUserAnswer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      {/* AI Assistant Avatar */}
      <div className="flex flex-col items-center">
  <Image 
    src="/aiassistant.png" 
    width={96} // This corresponds to `w-24` (96px) 
    height={96} // This corresponds to `h-24` (96px)
    alt="AI Interviewer Avatar" 
    className="rounded-full" // Optional: Add a rounded style if needed
  />
  <p className="text-md text-purple-700 font-semibold">AI Interviewer</p>
</div>
      {/* Webcam Section */}
      <div className="relative flex flex-col justify-center items-center rounded-2xl p-5 border bg-gradient-to-br from-purple-900 to-black shadow-lg">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute opacity-30"
          alt="webcam placeholder"
        />
        <Webcam
          mirrored={true}
          className="rounded-xl border-4 border-purple-500"
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
          onUserMedia={() => setWebcamActive(true)} // Set webcam as active when enabled
          onUserMediaError={() => setWebcamActive(false)} // Handle webcam errors
        />
      </div>

      {/* Recording Button */}
      <Button
        disabled={loading}
        variant="ghost"
        className={`px-6 py-3 rounded-full shadow-md transition-all text-white ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 animate-pulse"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="flex gap-2 items-center">
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </h2>
        ) : (
          <h2 className="flex gap-2 items-center">
            <Mic className="w-5 h-5" />
            {!isIntroductionDone ? "Introduce Yourself" : "Record Answer"}
          </h2>
        )}
      </Button>

      {/* Show Feedback for Introduction */}
      {introductionFeedback && (
        <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 shadow-md max-w-4xl w-full">
          <h2 className="text-blue-700 font-semibold mb-2">Introduction Feedback</h2>
          <p className="text-gray-800">{introductionFeedback}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswers;