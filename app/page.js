// app/page.js

import { redirect } from 'next/navigation';
import { Button } from '../components/ui/button'; // Assuming you have a Button component

export default function Home() {
  // Redirect the user to the /dashboard page
  redirect('/dashboard');

  const handleSubscribe = () => {
    // Handle the subscription logic here
    alert('Subscribed to Surya!');
  };

  return (
    <div>
      <h2>Subscribe to Surya</h2>
      <Button onClick={handleSubscribe}>Subscribe</Button>
    </div>
  );
}
