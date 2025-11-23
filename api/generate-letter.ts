import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

interface FormData {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
}

export function GET(request: Request) {
  return new Response(
    JSON.stringify({ message: 'API endpoint is working', path: '/api/generate-letter' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    let formData: FormData;

    try {
      const parsed = JSON.parse(body);

      // useCompletion sends data as { prompt: "JSON string" }
      if (parsed.prompt && typeof parsed.prompt === 'string') {
        formData = JSON.parse(parsed.prompt);
      } else {
        formData = parsed as FormData;
      }
    } catch (parseError) {
      console.error('[API] JSON parse failed:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { jobTitle, company, skills, additionalDetails } = formData;

    if (!jobTitle || !company || !skills || !additionalDetails) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = `Write a professional cover letter for a job application. 

Job Title: ${jobTitle}
Company: ${company}
Skills: ${skills}
Additional Details: ${additionalDetails}

The letter should be:
- Professional and engaging
- Personalized to the specific job and company
- Highlight the candidate's skills and experience
- Include the additional details provided
- Be approximately 200-300 words
- Start with "Dear [Company] Team," and end with a professional closing

Generate the cover letter:`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // AI SDK 5.0: streamText returns a result that can be converted to stream
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 500, // AI SDK 5.0: maxTokens renamed to maxOutputTokens
    });

    // AI SDK 5.0: useCompletion expects text stream response
    // toTextStreamResponse() returns the correct format for useCompletion
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API] Error generating letter:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate letter',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
