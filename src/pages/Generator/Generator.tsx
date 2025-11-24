import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { Header } from '../../components/Layout/Header';
import { FormField } from '../../components/Form/FormField/FormField';
import { TextareaField } from '../../components/Form/TextareaField/TextareaField';
import { GeneratedLetter } from '../../components/GeneratedLetter/GeneratedLetter';
import { GenerateButton } from '../../components/GenerateButton/GenerateButton';
import { GoalBanner } from '../../components/GoalBanner/GoalBanner';
import { useApplicationsStore } from '../../stores/useApplicationsStore';
import { GOALS, VALIDATION } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { FormData, Application } from '../../types';
import styles from './Generator.module.css';

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
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [showLetterOnMobile, setShowLetterOnMobile] = useState<boolean>(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(false);
  const [generatedLetterText, setGeneratedLetterText] = useState<string>('');
  const [wasManuallyClosed, setWasManuallyClosed] = useState<boolean>(false);
  const {isMobile} = useIsMobile();

  useEffect(() => {
    if (generatedLetterText && isMobile && !showLetterOnMobile && !wasManuallyClosed) {
      const timer = setTimeout(() => {
        setShowLetterOnMobile(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [generatedLetterText, isMobile, showLetterOnMobile, wasManuallyClosed]);

  useEffect(() => {
    if (!isMobile && showLetterOnMobile) {
      // Reset mobile letter view when switching to desktop
      setShowLetterOnMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const { complete, isLoading } = useCompletion({
    api: '/api/generate-letter',
    streamProtocol: 'text',
    onFinish: (_prompt, completion) => {
      const fullText = completion;

      setGeneratedLetterText(fullText);
      setHasGeneratedOnce(true);
      setWasManuallyClosed(false);

      if (currentApplicationId) {
        updateApplication(currentApplicationId, {
          ...formData,
          letterText: fullText,
        });
      } else {
        const newApplication: Application = {
          id: Date.now().toString(),
          ...formData,
          letterText: fullText,
          createdAt: Date.now(),
        };
        addApplication(newApplication);
        setCurrentApplicationId(newApplication.id);
      }
    },
    onError: (error) => {
      console.error('Error generating letter:', error);
    },
  });

  const shouldShowBanner = applications.length < GOALS.MIN_APPLICATIONS;

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
      formData.additionalDetails.length <= VALIDATION.MAX_DETAILS_LENGTH,
    [formData]
  );

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'jobTitle' || field === 'company') {
      setCurrentApplicationId(null);
      setShowLetterOnMobile(false);
      setGeneratedLetterText('');
      setWasManuallyClosed(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!isFormValid || isLoading) {
      return;
    }

    setWasManuallyClosed(false);

    await complete(JSON.stringify(formData));
  }, [isFormValid, isLoading, formData, complete]);

  const resetForm = useCallback(() => {
    setFormData({
      jobTitle: '',
      company: '',
      skills: '',
      additionalDetails: '',
    });
    setCurrentApplicationId(null);
    setShowLetterOnMobile(false);
    setHasGeneratedOnce(false);
    setGeneratedLetterText('');
    setWasManuallyClosed(false);
  }, []);

  const handleBackToForm = useCallback(() => {
    setShowLetterOnMobile(false);
    setWasManuallyClosed(true);
  }, []);

  useEffect(() => {
    if (showLetterOnMobile && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showLetterOnMobile, isMobile]);

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
                maxLength={VALIDATION.MAX_DETAILS_LENGTH}
              />

              <GenerateButton
                disabled={!isFormValid}
                loading={isLoading}
                repeat={hasGeneratedOnce}
                onClick={handleGenerate}
              />
              {generatedLetterText && !showLetterOnMobile && isMobile && (
                <button
                  className={styles.showLetterButton}
                  onClick={() => {
                    if (isMobile) {
                      setShowLetterOnMobile(true);
                    }
                  }}
                >
                  View Letter
                </button>
              )}
            </div>
          </div>
          <div className={`${styles.rightColumn} ${showLetterOnMobile ? styles.showOnMobile : ''}`}>
            <GeneratedLetter
              letterText={generatedLetterText}
              isGenerating={isLoading}
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

