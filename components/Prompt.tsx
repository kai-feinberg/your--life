import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Wand2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Define the type for the onScriptGenerated callback
type OnScriptGeneratedFunction = (script: string, audioUrls: string[], imageSections: string[][]) => void;

export const Prompt: React.FC<{ onScriptGenerated: OnScriptGeneratedFunction }> = ({ onScriptGenerated }) => {
  const [scriptPrompt, setScriptPrompt] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [loadingScript, setLoadingScript] = useState<boolean>(false);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [imageSections, setImageSections] = useState<string[][]>([]); // array of image URLs for each section
  const [loadingImages, setLoadingImages] = useState<boolean>(false); // Loading state for images
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false); // Loading state for images and audio
  const [expandedAudio, setExpandedAudio] = useState<boolean>(false);
  const [expandedImages, setExpandedImages] = useState<boolean>(false);

  // GENERATE AUDIO FUNCTION
  const generateAudio = async (text: string) => {
    try {
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
        // const { audioContents } = data;

        // const newAudioUrls = audioContents.map((base64AudioContent: string) => {
        //   const binaryData = Uint8Array.from(atob(base64AudioContent), c => c.charCodeAt(0));
        //   const audioBlob = new Blob([binaryData], { type: 'audio/mpeg' });
        //   const url = URL.createObjectURL(audioBlob);
        //   console.log(url)
        //   return url;
        // });

        const newAudioUrls = data.audioUrls;

        setAudioUrls(newAudioUrls);
      } else {
        console.error('Error with Text-to-Speech API:', await response.text());
      }
    } catch (error) {
      console.error('Error during audio generation:', error);
    }
  };

  // FETCH IMAGES FUNCTION
  const fetchImages = async (name: string) => {
    setLoadingImages(true); // Start loading state for images
    try {
      const imagesResponse = await fetch(`/api/fetchImages?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (imagesResponse.ok) {
        const { data } = await imagesResponse.json();
        const { imageSections } = data;
  
        if (!imageSections || imageSections.length === 0) {
          console.error('No images retrieved from Getty');
        } else {
          setImageSections(imageSections);
        }
      } else {
        console.error('Error fetching images:', await imagesResponse.text());
      }
    } catch (error) {
      console.error('Error during image fetch:', error);
    } finally {
      setLoadingImages(false);
    }
  };
  
  const fetchAssets = async () => {
    setLoadingAssets(true);
    await fetchImages(scriptPrompt);  // Pass the user inputted name
    await generateAudio(script);
    setLoadingAssets(false);
  };

  
  // GENERATE SCRIPT FUNCTION
  const generateScript = async () => {
    setLoadingScript(true);
    try {
      const response = await fetch(`/api/createScript?prompt=${encodeURIComponent(scriptPrompt)}`);
      const data = await response.json();

      if (data.error) {
        console.error('Error creating script:', data.error);
      } else {
        const generatedScript = data.data;
        setScript(generatedScript);

      }
    } catch (error) {
      console.error('Error during script generation:', error);
    } finally {
      setLoadingScript(false);
    }
  };

  // RESET FUNCTION
  const restart = () => {
    setScriptPrompt('');
    setScript('');
    setLoadingScript(false);
    setAudioUrls([]);
    setImageSections([]);
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // UseEffect to trigger the callback when script, audio, and image sections are ready
  useEffect(() => {
    if (script && audioUrls.length > 0 && imageSections.length > 0) {
      onScriptGenerated(script, audioUrls, imageSections);
      console.log(imageSections)
    }
  }, [script, audioUrls, imageSections, onScriptGenerated]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-center">AI Script Generator</CardTitle>
          <Button onClick={restart} className="text-sm">
            <RotateCcw className="w-6" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h1 className="font-medium text-xl">Enter your script idea</h1>
          <Input
            id="prompt"
            placeholder="e.g., LeBron's rise to fame"
            value={scriptPrompt}
            onChange={(e) => setScriptPrompt(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          onClick={generateScript}
          disabled={loadingScript || !scriptPrompt}
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

              {/* Collapsible Audio Section */}
            </CardContent>

            <CardFooter className="flex justify-end">
              {/* Fetch Images Button */}
              {/* <Button onClick={fetchImages} className="w-1/4">
                Fetch Images
                </Button> */}

              {/* Create Video Button */}
              <Button onClick={fetchAssets} className="w-1/4">
                {loadingAssets ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Audio...
                  </>
                ) : (
                  <p>Create Video</p>
                )}
              </Button>
            </CardFooter>

            <CardContent>
              {audioUrls.length > 0 && (
                <div className="border rounded-md">
                  <Button
                    onClick={() => setExpandedAudio(!expandedAudio)}
                    className="w-full flex justify-between items-center"
                    variant="ghost"
                  >
                    <span>Audio Sections</span>
                    {expandedAudio ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                  {expandedAudio && (
                    <div className="p-4">
                      {audioUrls.map((audioUrl, index) => (
                        <Button key={index} onClick={() => playAudio(audioUrl)} className="w-full mb-2">
                          Play Audio {index + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Collapsible Images Section */}
            <CardContent className="space-y-4">
              {imageSections.length > 0 && (
                <div className="border rounded-md">
                  <Button
                    onClick={() => setExpandedImages(!expandedImages)}
                    className="w-full flex justify-between items-center p-4"
                    variant="ghost"
                  >
                    <span>Image Sections</span>
                    {expandedImages ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                  {expandedImages && (
                    <div className="p-4">
                      {loadingImages ? (
                        <p>Loading images...</p>
                      ) : (
                        <>
                          {imageSections.map((imageSection, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2 mb-4">
                              <h3 className="text-lg font-medium">Section {sectionIndex + 1}</h3>
                              <div className="grid grid-cols-3 gap-4">
                                {imageSection.map((imageUrl, imageIndex) => (
                                  <img
                                    key={`${sectionIndex}-${imageIndex}`}
                                    src={imageUrl}
                                    alt={`Fetched Image ${sectionIndex + 1}-${imageIndex + 1}`}
                                    className="w-full h-auto object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
