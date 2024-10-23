import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Wand2, RotateCcw } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Define the type for the onScriptGenerated callback
type OnScriptGeneratedFunction = (script: string, mp3Files: string[], imageSections: string[][]) => void;

export const Prompt: React.FC<{ onScriptGenerated: OnScriptGeneratedFunction }> = ({ onScriptGenerated }) => {
  const [scriptPrompt, setScriptPrompt] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [loadingScript, setLoadingScript] = useState<boolean>(false);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]); // Store fetched image URLs here
  const [loadingImages, setLoadingImages] = useState<boolean>(false); // Loading state for images
  const [imageSections, setImageSections] = useState<string[][]>([]);

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
        const { audioContents } = data;

        const newAudioUrls = audioContents.map((base64AudioContent: string) => {
          const binaryData = Uint8Array.from(atob(base64AudioContent), c => c.charCodeAt(0));
          const audioBlob = new Blob([binaryData], { type: 'audio/mpeg' });
          const url = URL.createObjectURL(audioBlob);
          return url;
        });

        setAudioUrls(newAudioUrls);
      } else {
        console.error('Error with Text-to-Speech API:', await response.text());
      }
    } catch (error) {
      console.error('Error during audio generation:', error);
    }
  };

  // FETCH IMAGES FUNCTION
  const fetchImages = async () => {
    setLoadingImages(true); // Start loading state for images
    try {
      const imagesResponse = await fetch('/api/fetchImages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (imagesResponse.ok) {
        const { data } = await imagesResponse.json();
        const { images } = data;

        if (!images || images.length === 0) {
          console.error('No images retrieved from Getty');
        } else {
          setFetchedImages(images);
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

        // Generate audio after the script is generated
        await generateAudio(generatedScript);
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
    setFetchedImages([]); // Clear images when restarting
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // UseEffect to trigger the callback when script, audio, and image sections are ready
  useEffect(() => {
    if (script && audioUrls.length > 0 && imageSections.length > 0) {
      onScriptGenerated(script, audioUrls, imageSections);
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

              {/* Display Audio Buttons */}
              {audioUrls.map((audioUrl, index) => (
                <Button key={index} onClick={() => playAudio(audioUrl)} className="w-full">
                  Play Audio {index + 1}
                </Button>
              ))}
            </CardContent>

            <CardFooter className="flex justify-between">
              {/* Fetch Images Button */}
              <Button onClick={fetchImages} className="w-1/4">
                Fetch Images
              </Button>

              {/* Create Video Button */}
              <Button onClick={() => console.log('Creating video...')} className="w-1/4">
                Create Video
              </Button>
            </CardFooter>

            {/* Display fetched images */}
            {loadingImages ? (
              <p>Loading images...</p>
            ) : fetchedImages.length > 0 && (
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold">Fetched Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {fetchedImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Fetched Image ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
