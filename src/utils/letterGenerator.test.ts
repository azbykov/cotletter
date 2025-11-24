import { describe, it, expect } from 'vitest';
import { generateLetter } from './letterGenerator';
import type { FormData } from '../types';

describe('letterGenerator', () => {
  it('should replace all placeholders with form data', () => {
    const formData: FormData = {
      company: 'Apple',
      jobTitle: 'Product Manager',
      skills: 'React, TypeScript, Node.js',
      additionalDetails: 'I have 5 years of experience in product development.',
    };

    const result = generateLetter(formData);

    expect(result).toContain('Apple');
    expect(result).toContain('Product Manager');
    expect(result).toContain('React, TypeScript, Node.js');
    expect(result).toContain('I have 5 years of experience in product development.');
    expect(result).not.toContain('[Company]');
    expect(result).not.toContain('[JobTitle]');
    expect(result).not.toContain('[SkillsList]');
    expect(result).not.toContain('[AdditionalDetails]');
  });

  it('should keep placeholders if form data is empty', () => {
    const formData: FormData = {
      company: '',
      jobTitle: '',
      skills: '',
      additionalDetails: '',
    };

    const result = generateLetter(formData);

    expect(result).toContain('[Company]');
    expect(result).toContain('[JobTitle]');
    expect(result).toContain('[SkillsList]');
    expect(result).toContain('[AdditionalDetails]');
  });

  it('should replace only specified placeholders', () => {
    const formData: FormData = {
      company: 'Google',
      jobTitle: 'Software Engineer',
      skills: '',
      additionalDetails: 'I am passionate about coding.',
    };

    const result = generateLetter(formData);

    expect(result).toContain('Google');
    expect(result).toContain('Software Engineer');
    expect(result).toContain('[SkillsList]');
    expect(result).toContain('I am passionate about coding.');
  });

  it('should handle special characters in form data', () => {
    const formData: FormData = {
      company: "O'Reilly & Associates",
      jobTitle: 'Senior Developer (Remote)',
      skills: 'C++, Python, SQL',
      additionalDetails: 'I have experience with "agile" methodologies.',
    };

    const result = generateLetter(formData);

    expect(result).toContain("O'Reilly & Associates");
    expect(result).toContain('Senior Developer (Remote)');
    expect(result).toContain('C++, Python, SQL');
    expect(result).toContain('I have experience with "agile" methodologies.');
  });

  it('should maintain letter structure', () => {
    const formData: FormData = {
      company: 'Test Company',
      jobTitle: 'Test Position',
      skills: 'Test Skills',
      additionalDetails: 'Test Details',
    };

    const result = generateLetter(formData);

    expect(result).toContain('Dear');
    expect(result).toContain('Team');
    expect(result).toContain('I am writing to express my interest');
    expect(result).toContain('Thank you for considering my application');
  });
});

