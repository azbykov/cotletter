import { useState, useMemo, useCallback } from 'react';
import { Header } from '../../components/Layout/Header';
import { FormField } from '../../components/Form/FormField/FormField';
import { TextareaField } from '../../components/Form/TextareaField/TextareaField';
import { GeneratedLetter } from '../../components/GeneratedLetter/GeneratedLetter';
import { GenerateButton } from '../../components/GenerateButton/GenerateButton';
import { GoalBanner } from '../../components/GoalBanner/GoalBanner';
import { useApplicationsStore } from '../../stores/useApplicationsStore';
import { generateLetter } from '../../utils/letterGenerator';
import type { FormData, Application } from '../../types';
import styles from './Generator.module.css';

const MAX_DETAILS_LENGTH = 1200;

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const Generator = () => {
  const applications = useApplicationsStore((state) => state.applications);
  const addApplication = useApplicationsStore((state) => state.addApplication);
  const updateApplication = useApplicationsStore((state) => state.updateApplication);
  
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    company: '',
    skills: '',
    additionalDetails: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [showLetterOnMobile, setShowLetterOnMobile] = useState<boolean>(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(false);

  const shouldShowBanner = useMemo(() => applications.length < 5, [applications.length]);

  const title = useMemo(() => {
    if (formData.jobTitle && formData.company) {
      const titleText = `${formData.jobTitle}, ${formData.company}`;
      return capitalizeFirstLetter(titleText);
    }
    return 'New Application';
  }, [formData.jobTitle, formData.company]);

  const isTitleFilled = useMemo(
    () => formData.jobTitle.trim() !== '' && formData.company.trim() !== '',
    [formData.jobTitle, formData.company]
  );

  const isFormValid = useMemo(
    () =>
      formData.jobTitle.trim() !== '' &&
      formData.company.trim() !== '' &&
      formData.skills.trim() !== '' &&
      formData.additionalDetails.trim() !== '' &&
      formData.additionalDetails.length <= MAX_DETAILS_LENGTH,
    [formData]
  );

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === 'jobTitle' || field === 'company') {
      setCurrentApplicationId(null);
      setGeneratedLetter('');
      setShowLetterOnMobile(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!isFormValid || isGenerating) {
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const letter = generateLetter(formData);
    setGeneratedLetter(letter);
    setIsGenerating(false);
    setHasGeneratedOnce(true);
    
    setTimeout(() => {
      setShowLetterOnMobile(true);
    }, 50);

    if (currentApplicationId) {
      updateApplication(currentApplicationId, {
        ...formData,
        letterText: letter,
      });
    } else {
      const newApplication: Application = {
        id: Date.now().toString(),
        ...formData,
        letterText: letter,
        createdAt: Date.now(),
      };
      addApplication(newApplication);
      setCurrentApplicationId(newApplication.id);
    }
  }, [isFormValid, isGenerating, formData, currentApplicationId, addApplication, updateApplication]);

  const resetForm = useCallback(() => {
    setFormData({
      jobTitle: '',
      company: '',
      skills: '',
      additionalDetails: '',
    });
    setGeneratedLetter('');
    setCurrentApplicationId(null);
    setShowLetterOnMobile(false);
    setHasGeneratedOnce(false);
  }, []);

  const handleBackToForm = useCallback(() => {
    setShowLetterOnMobile(false);
  }, []);

  return (
    <div className={styles.generator}>
      <Header applicationsCount={applications.length} />
      <div className={styles.content}>
        <div className={styles.columns}>
          <div className={`${styles.overlay} ${showLetterOnMobile ? styles.show : ''}`} onClick={handleBackToForm} />
          <div className={styles.leftColumn}>
            <div className={styles.titleContainer}>
              <h1 className={`${styles.title} ${isTitleFilled ? styles.filled : ''}`}>
                {title}
              </h1>
            </div>
            <div className={styles.form}>
              <div className={styles.row}>
                <FormField
                  id="jobTitle"
                  label="Job title:"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  placeholder="Product manager"
                />

                <FormField
                  id="company"
                  label="Company:"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Apple"
                />
              </div>

              <FormField
                id="skills"
                label="I am good at...:"
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                placeholder="HTML, CSS and doing things in time"
              />

              <TextareaField
                id="additionalDetails"
                label="Additional details:"
                value={formData.additionalDetails}
                onChange={(e) => handleChange('additionalDetails', e.target.value)}
                placeholder="I want to help you build awesome solutions to accomplish your goals and vision"
                rows={6}
                maxLength={MAX_DETAILS_LENGTH}
              />

              <GenerateButton
                disabled={!isFormValid}
                loading={isGenerating}
                repeat={hasGeneratedOnce}
                onClick={handleGenerate}
              />
            </div>
          </div>
          <div className={`${styles.rightColumn} ${showLetterOnMobile ? styles.showOnMobile : ''}`}>
            <GeneratedLetter 
              letterText={generatedLetter} 
              isGenerating={isGenerating}
              onBackToForm={handleBackToForm}
              showOnMobile={showLetterOnMobile}
            />
          </div>
        </div>
        {shouldShowBanner && <GoalBanner applicationsCount={applications.length} onResetForm={resetForm} />}
      </div>
    </div>
  );
};

