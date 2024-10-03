import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
export const Prompt = () => {
    const [scriptPrompt, setScriptPrompt] = useState<string>('')
    const [script, setScript] = useState<string>('')

    const generateScript = async () => {
        // const response = await fetch(`/api/createScript?prompt=${scriptPrompt}`)
        // const data = await response.json()
        // setScript(data.data)
        setScript('just a test script')
    }

    return (
        <div className='flex flex-col'>
            <Input placeholder="ie LeBron's rise to fame" onChange={(e) => setScriptPrompt(e.target.value)} />
            <Button onClick={generateScript}> Generate Script </Button>

            {script &&
                <div>
                    <h2 className='text-2xl font-bold'>edit your script here</h2>
                    <Textarea value={script} onChange={(e) => setScript(e.target.value)} />
                    <Button>Create video</Button>
                </div>

            }
        </div>
    )
}