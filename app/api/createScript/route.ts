//route.ts (for createScript)
//uses open ai's api to create a script based off of a prompt

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});


// [in the style of a documentary]
// [ provide a narration ]
// [Distinct headings]


export async function GET(req: Request) {
 //take script prompt from query
    const prompt = new URL(req.url).searchParams.get('prompt');

    if(!prompt){
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Prepend the pre-prompts to the user prompt
    const fullPrompt = `In the style of documentary, provide a narration with distinct headings. \n Keep the script concise and suitable for a 1-minute voiceover (Beginning, Middle, Conlcusion). \n Please include links to at least two reliable sources at the end of the script.Ensure that all sections are delimited with section titles with # in the front\n\n${prompt}`;

    try {
      // Call OpenAI API to generate a script
      const response = await await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 500, // Adjust this as needed
      });
    
     // Extract the generated text
      const generatedScript = response.choices[0]?.message?.content;

      if (!generatedScript) {
        throw new Error('No script generated');
     }
 
      return NextResponse.json({ data: generatedScript}, { status: 200 });
   }  catch (error) {
      console.error('Error creating script:', error);
      return NextResponse.json({ error: 'Error creating script' }, { status: 500 });
   }
 }  


 /*  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const exampleResponse = `Barack Hussein Obama II[a] (born August 4, 1961) is an American politician who served as the 44th president of the United States from 2009 to 2017. As a member of the Democratic Party, he was the first African-American president in U.S. history. Obama previously served as a U.S. senator representing Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004.
Obama was born in Honolulu, Hawaii. He graduated from Columbia University in 1983 with a Bachelor of Arts degree in political science and later worked as a community organizer in Chicago. In 1988, Obama enrolled in Harvard Law School, where he was the first black president of the Harvard Law Review. He became a civil rights attorney and an academic, teaching constitutional law at the University of Chicago Law School from 1992 to 2004. He also went into elective politics; Obama represented the 13th district in the Illinois Senate from 1997 until 2004, when he successfully ran for the U.S. Senate. In the 2008 presidential election, after a close primary campaign against Hillary Clinton, he was nominated by the Democratic Party for president. Obama selected Joe Biden as his running mate and defeated Republican nominee John McCain.

Obama was named the 2009 Nobel Peace Prize laureate, a decision that drew a mixture of criticism and praise. His first-term actions addressed the global financial crisis and included a major stimulus package to guide the economy in recovering from the Great Recession, a partial extension of George W. Bush's tax cuts, legislation to reform health care, a major financial regulation reform bill, and the end of a major U.S. military presence in Iraq. Obama also appointed Supreme Court justices Sonia Sotomayor and Elena Kagan, the former being the first Hispanic American on the Supreme Court. He ordered Operation Neptune Spear, the raid that killed Osama bin Laden, who was responsible for the September 11 attacks. Obama downplayed Bush's counterinsurgency model, expanding air strikes and making extensive use of special forces, while encouraging greater reliance on host-government militaries. He also ordered military involvement in Libya in order to implement UN Security Council Resolution 1973, contributing to the overthrow of Muammar Gaddafi.

Obama defeated Republican opponent Mitt Romney in the 2012 presidential election. In his second term, Obama took steps to combat climate change, signing a major international climate agreement and an executive order to limit carbon emissions. Obama also presided over the implementation of the Affordable Care Act and other legislation passed in his first term. He negotiated a nuclear agreement with Iran and normalized relations with Cuba. The number of American soldiers in Afghanistan decreased during Obama's second term, though U.S. soldiers remained in the country throughout Obama's presidency. Obama promoted inclusion for LGBT Americans, becoming the first sitting U.S. president to publicly support same-sex marriage.

Obama left office on January 20, 2017, and continues to reside in Washington, D.C. Historians and political scientists rank him among the upper tier in historical rankings of American presidents. His presidential library in the South Side of Chicago began construction in 2021. Since leaving office, Obama has remained politically active, campaigning for candidates in various American elections, including Biden's successful presidential bid in 2020. Outside of politics, Obama has published three books: Dreams from My Father (1995), The Audacity of Hope (2006), and A Promised Land (2020).`
   
    return NextResponse.json({ data: exampleResponse + prompt }, { status: 200 });
  } 
  
 /*  catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json({ error: 'Error ' }, { status: 500 });
} }*/

