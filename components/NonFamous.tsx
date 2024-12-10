'use client'

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useScriptParser } from '../hooks/useScriptParser'

export default function NonFamous() {
    const [script, setScript] = useState('')
    const [images, setImages] = useState<{ [key: string]: string[] }>({})
    const headers = useScriptParser(script)

    const handleImageUpload = (header: string, files: FileList) => {
        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImages(prev => ({
                    ...prev,
                    [header]: [...(prev[header] || []), e.target?.result as string]
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (header: string, index: number) => {
        setImages(prev => ({
            ...prev,
            [header]: prev[header].filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="container mx-auto p-4 space-y-6 bg-white rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Custom Biography Video</h1>

            <div className="space-y-2">
                <Label htmlFor="script">Enter your script (use # for headers):</Label>
                <Textarea
                    id="script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder={`
                        # Introduction
                        Your content here

                        # Section 1
                        More content here`}
                    className="h-40"
                />
                <Button onClick={() => console.log("Generate Voiceover clicked")}>
                    Generate Voiceover
                </Button>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Image Upload Sections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {headers.map((header, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{header}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor={`image-${index}`}>Upload images for this section:</Label>
                                    <Input
                                        id={`image-${index}`}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = e.target.files
                                            if (files) handleImageUpload(header, files)
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {images[header]?.map((img, imgIndex) => (
                                            <div key={imgIndex} className="relative">
                                                <img
                                                    src={img}
                                                    alt={`Image ${imgIndex + 1} for ${header}`}
                                                    className="w-full h-auto"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-0 right-0 m-1"
                                                    onClick={() => removeImage(header, imgIndex)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <Button onClick={() => console.log("Render Video clicked")} className="w-full max-w-md">
                    Render Video
                </Button>
            </div>
        </div>
    )
}

