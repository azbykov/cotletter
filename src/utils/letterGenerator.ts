import type { FormData } from '../types';

const LETTER_TEMPLATE = `Dear [Company] Team,

I am writing to express my interest in the [JobTitle] position.

My experience in the realm combined with my skills in [SkillsList] make me a strong candidate for this role.

[AdditionalDetails]

I am confident that my skills and enthusiasm would translate into valuable contributions to your esteemed organization.

Thank you for considering my application. I eagerly await the opportunity to discuss my qualifications further.`;

const PLACEHOLDERS = {
  '[Company]': 'company',
  '[JobTitle]': 'jobTitle',
  '[SkillsList]': 'skills',
  '[AdditionalDetails]': 'additionalDetails',
} as const;

export const generateLetter = (formData: FormData): string => {
  return LETTER_TEMPLATE.replace(
    /\[(?:Company|JobTitle|SkillsList|AdditionalDetails)\]/g,
    (match) => {
      const key = PLACEHOLDERS[match as keyof typeof PLACEHOLDERS];
      return formData[key] || match;
    }
  );
};

