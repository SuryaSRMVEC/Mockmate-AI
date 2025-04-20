import React from 'react';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { FaPlay, FaCommentDots } from 'react-icons/fa';


function Interviewcard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId);
  };

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview.mockId + '/feedback');
  };

  return (
    <div className="border shadow-lg rounded-lg p-4 bg-gradient-to-r from-white via-purple-50 to-purple-100 hover:shadow-2xl transition-shadow">
      <h2 className="font-bold text-purple-600 text-lg">{interview?.jobPosition}</h2>
      <h3 className="text-sm text-gray-600">
        {interview?.jobExp} Years of experience
      </h3>
      <h4 className="text-xs text-gray-500 mt-1">
        Created At: {new Date(interview.createdAt).toLocaleString()}
      </h4>
      <div className="flex justify-between mt-4 gap-3">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-purple-50"
          onClick={onFeedbackPress}
        >
          <FaCommentDots /> Feedback
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-2 text-black bg-purple-600 hover:bg-purple-700"
          onClick={onStart}
        >
          <FaPlay /> Start
        </Button>
      </div>
    </div>
  );
}

export default Interviewcard;