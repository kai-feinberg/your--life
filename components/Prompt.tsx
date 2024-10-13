//Prompt.tsx

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Wand2 } from 'lucide-react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

export const Prompt = () => {
  const [scriptPrompt, setScriptPrompt] = useState<string>('')
  const [script, setScript] = useState<string>('')
  const [loadingScript, setLoadingScript] = useState<boolean>(false)
  const [audioUrls, setAudioUrls] = useState<string[]>([])

//   const text = `
  
// #Steph Currys Early Life
// Steph Curry was born on March 14, 1988, in Akron, Ohio, but grew up in Charlotte, North Carolina, where his father, Dell Curry, was playing for the Charlotte Hornets. Raised in a basketball family, Steph and his brother Seth often played under the guidance of their father. Despite his basketball upbringing, Steph was never viewed as a sure-fire star. He was smaller and lighter than his peers, and many doubted his potential to play at a high level.

// #High School Struggles
// In high school, Curry attended Charlotte Christian, where he led his team to multiple state playoff appearances, but his size and build made him a less attractive recruit for major college programs. He wasn’t tall or physically dominant, so despite his sharp shooting, major universities passed on him. This led Steph to choose Davidson College, a small school that offered him a scholarship and a chance to prove himself on a bigger stage.

// #Breakout at Davidson College
// At Davidson, Steph Curry’s name began to echo across the college basketball world. In his sophomore year, during the 2008 NCAA tournament, Curry led Davidson to the Elite Eight, captivating fans with his incredible shooting range and fearless style of play. He became a national sensation almost overnight. His performances against powerhouse schools like Georgetown and Wisconsin marked him as one of the most exciting players in the country, despite coming from a small school.
// `

//GENERATE AUDIO 
const generateAudio = async (text: string) => {
  const response = await fetch('/api/generateAudio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      languageCode: 'en-US',
      voiceName: 'en-US-Wavenet-D',
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const { audioContents } = data;

    const newAudioUrls = audioContents.map((base64AudioContent) => {
      const binaryData = Uint8Array.from(atob(base64AudioContent), c => c.charCodeAt(0));
      const audioBlob = new Blob([binaryData], { type: 'audio/mpeg' });
      return URL.createObjectURL(audioBlob);
    });

    setAudioUrls(newAudioUrls);
  } else {
    console.error('Error with Text-to-Speech API:', await response.text());
  }
};


//GENERATE Script

  const generateScript = async () => {
    setLoadingScript(true)
    const response = await fetch(`/api/createScript?prompt=${encodeURIComponent(scriptPrompt)}`)
    const data = await response.json()
    if (data.error) {
      console.error('Error creating script:', data.error);
      setLoadingScript(false);
      return;
    }
    const generatedScript = data.data;
    setScript(generatedScript);
    setLoadingScript(false);

    // Pass the generated script to generate the audio
    await generateAudio(generatedScript);
  }

  const restart = () => {
    setScriptPrompt('');
    setScript('');
    setLoadingScript(false);
  }

  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play();
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-center">AI Script Generator</CardTitle>
          <Button onClick={restart} className="text-sm"><RotateCcw className='w-6' /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateAudio} className="w-full"> generate audio </Button>
        {audioUrls.map((audioUrl, index) => (
          <Button key={index} onClick={() => playAudio(audioUrl)} className="w-full">Play Audio {index + 1}</Button>
        ))}


        <div className="space-y-2">
          <h1 className="font-medium text-xl">
            Enter your script idea
          </h1>
          <Input
            id="prompt"
            placeholder="e.g., LeBron's rise to fame"
            onChange={(e) => setScriptPrompt(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={generateScript}
          disabled={loadingScript || !scriptPrompt || (script.length && script.length) > 0}
          className="w-full"
        >
          {loadingScript ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Script
            </>
          )}
        </Button>
      </CardContent>
      <AnimatePresence>
        {script && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Edit Your Script</h2>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[400px]"
              />
            </CardContent>
            <CardFooter className="flex justify-end"> {/* Aligning the button to the right */}
              <Button className="w-1/4">
                Create Video
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}