import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

const LETTER_TEMPLATE = `Dear [Company] Team,

I am writing to express my interest in the [JobTitle] position.

My experience in the realm combined with my skills in [SkillsList] make me a strong candidate for this role.

[AdditionalDetails]

I am confident that my skills and enthusiasm would translate into valuable contributions to your esteemed organization.

Thank you for considering my application. I eagerly await the opportunity to discuss my qualifications further.`;

const generateFallbackLetter = (formData: {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
}): string => {
  return LETTER_TEMPLATE.replace(
    /\[(?:Company|JobTitle|SkillsList|AdditionalDetails)\]/g,
    (match) => {
      switch (match) {
        case '[Company]':
          return formData.company || match;
        case '[JobTitle]':
          return formData.jobTitle || match;
        case '[SkillsList]':
          return formData.skills || match;
        case '[AdditionalDetails]':
          return formData.additionalDetails || match;
        default:
          return match;
      }
    }
  );
};

const formDataSchema = z.object({
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(200, 'Job title must be at most 200 characters')
    .trim(),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be at most 200 characters')
    .trim(),
  skills: z
    .string()
    .min(1, 'Skills are required')
    .max(500, 'Skills must be at most 500 characters')
    .trim(),
  additionalDetails: z
    .string()
    .min(1, 'Additional details are required')
    .max(1200, 'Additional details must be at most 1200 characters')
    .trim(),
});

export async function POST(request: Request) {
  let formData: {
    jobTitle: string;
    company: string;
    skills: string;
    additionalDetails: string;
  } | null = null;

  try {
    const body = await request.text();
    let parsedData: unknown;

    try {
      const parsed = JSON.parse(body);

      if (parsed.prompt && typeof parsed.prompt === 'string') {
        parsedData = JSON.parse(parsed.prompt);
      } else {
        parsedData = parsed;
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

    const validationResult = formDataSchema.safeParse(parsedData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return new Response(
        JSON.stringify({
          error: firstError?.message || 'Validation failed',
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    formData = validationResult.data;
    const { jobTitle, company, skills, additionalDetails } = formData;

    const sanitizeForPrompt = (text: string): string => {
      return text.replace(/\n{3,}/g, '\n\n').trim();
    };

    const prompt = `Write a professional cover letter for a job application. 

Job Title: ${sanitizeForPrompt(jobTitle)}
Company: ${sanitizeForPrompt(company)}
Skills: ${sanitizeForPrompt(skills)}
Additional Details: ${sanitizeForPrompt(additionalDetails)}

The letter should be:
- Professional and engaging
- Personalized to the specific job and company
- Highlight the candidate's skills and experience
- Include the additional details provided
- Be approximately 100-200 words
- Start with "Dear [Company] Team," and end with a professional closing

Generate the cover letter:`;

    // @ts-expect-error env
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const fallbackLetter = generateFallbackLetter(formData);
      return new Response(fallbackLetter, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    // @ts-expect-error env
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.error('[API] Error generating letter, using fallback:', error);
    if (formData) {
      try {
        const fallbackLetter = generateFallbackLetter(formData);
        return new Response(fallbackLetter, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      } catch (fallbackError) {
        console.error('[API] Fallback generation also failed:', fallbackError);
      }
    }
    return new Response(
      JSON.stringify({
        error: 'Failed to generate letter',
        ...(isDevelopment && {
          details: error instanceof Error ? error.message : String(error),
        }),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
