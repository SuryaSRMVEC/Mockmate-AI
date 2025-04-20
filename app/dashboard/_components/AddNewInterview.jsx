"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog";
import { Button } from '../../../components/ui/button';
import {Input } from '../../../components/ui/input';
import {Textarea} from '../../../components/ui/textarea';
import {chatSession} from '../../../utils/GeminAImodel'
import { LoaderCircle, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MockInterview} from '../../../utils/schema'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import {db} from '../../../utils/db'
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

  

function AddNewInterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExp,setJobExp]=useState();
    const [loading,setLoading]=useState(false)
    const [JSONres,setJSONres]=useState([])
    const {user}=useUser()
    const router=useRouter()

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
      
        console.log(jobDesc, jobExp, jobPosition);
      
        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExp}. 
        Based on this job position and experience, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} interview questions along with answers in JSON format. 
        Provide "question" and "answer" fields in the JSON response.`;
      
        try {
          const result = await chatSession.sendMessage(InputPrompt);
          const response = await result.response;
          const text = await response.text();
          const MockJsonresp = text.replace('```json','').replace('```','')
          console.log(JSON.parse(MockJsonresp))
          setJSONres(MockJsonresp)

        if(MockJsonresp)
            {

                const resp = await db.insert(MockInterview).values({
                    mockId:uuidv4(),
                    jsonMockResp:MockJsonresp,
                    jobPosition:jobPosition,
                    jobDesc:jobDesc,
                    jobExp:jobExp,
                    CreatedBy:user?.primaryEmailAddress?.emailAddress,
                    createdAt:moment().format('YYYY-MM-DD HH:mm:ss')
               
                }).returning({mockId:MockInterview.mockId})
                console.log("Inserted ID:",resp)
                if(resp){
                    setOpenDailog(false)
                    router.push('/dashboard/interview/'+resp[0]?.mockId)
                }
            }
        else{
            console.log("No response")
        }
          // Optional: Do something with the response, e.g., save it, show it in UI, etc.
        } catch (error) {
          console.error("Error generating interview questions:", error);
        }
        setLoading(false)
      };
      
    
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer 
        transition-all ' onClick={()=>setOpenDailog(true)}> 
            <h2 className=' text-lg text-center'>+ ADD New</h2>
        </div>
        <Dialog open={openDailog}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className={"max-w-2xl"}>
            <DialogHeader>
                <DialogTitle className={"text-2xl"}>Tell us more About Your Job Interviewing</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <div>
                            <h2>Add Details about your job position/role, Job description and years of experience</h2>
                        </div>
                        <div className='mt-7 my-2'>
                            <label>Job Role/Job Position</label>
                            <Input placeholder="Ex. Full Stack Developer" required onChange={(event)=>setJobPosition(event.target.value)}/>
                        </div>
                        <div>
                            <label>Job Description/Tech Stack</label>
                            <Textarea placeholder="Ex.React, Angular,Node js,MYSQL etc.." required onChange={(event)=>setJobDesc(event.target.value)}/>
                        </div>

                        <div>
                            <label>Years of experience</label>
                            <Input placeholder="Ex.5" type="number" max="50" required onChange={(event)=>setJobExp(event.target.value)} />
                        </div>
                        
                        <div className='flex gap-5 justify-end'>
                            <Button variant="ghost" onClick={()=>setOpenDailog(false)} >Cancel</Button>
                            <Button type="submit" disabled={loading} >
                                {loading ? <><LoaderCircle className='animate-spin'/>'Generating from AI' </>: 'Start Interview'}
                                 </Button>
                        </div>
                    </form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview