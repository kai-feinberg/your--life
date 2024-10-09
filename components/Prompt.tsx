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



  const generateScript = async () => {
    setLoadingScript(true)
    const response = await fetch(`/api/createScript?prompt=${encodeURIComponent(scriptPrompt)}`)
    const data = await response.json()
    setScript(data.data)
    setLoadingScript(false)
  }

  const restart = () => {
    setScriptPrompt('');
    setScript('');
    setLoadingScript(false);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold text-center">AI Script Generator</CardTitle>
            <Button onClick={restart} className="text-sm"><RotateCcw className='w-6'/></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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