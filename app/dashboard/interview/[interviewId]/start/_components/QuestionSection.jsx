import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {

        const textToSpeach=(text)=>{
            if('speechSynthesis' in window){
                const speech=new SpeechSynthesisUtterance(text)
                window.speechSynthesis.speak(speech)

            }
            else{
                alert('speechSynthesis not supported in this browser')
            }
        }

    return mockInterviewQuestion && (
        <div className='p-6 border border-purple-200 rounded-2xl my-10 shadow-sm bg-white animate-fade-in'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {mockInterviewQuestion.map((question, index) => (
                    <h2
                        key={index}
                        className={`py-2 px-4 rounded-full text-xs md:text-sm font-medium text-center transition-all duration-300 border border-purple-300 
                            hover:bg-purple-100 cursor-pointer 
                            ${activeQuestionIndex === index ? 'bg-purple-600 text-white shadow-md' : 'text-purple-700'}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>

            <h2 className='mt-6 mb-4 text-md md:text-lg text-purple-800 font-semibold leading-relaxed'>
                {mockInterviewQuestion[activeQuestionIndex]?.question}
                <Volume2  className='cursor-pointer'  onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}  />
            </h2>

            <div className='border border-blue-200 rounded-xl p-5 bg-blue-50'>
                <h2 className='flex gap-2 items-center text-blue-700 font-medium mb-2'>
                    <Lightbulb className="text-blue-600" />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-blue-600 text-sm'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
