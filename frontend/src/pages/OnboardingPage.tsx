import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Target, 
  Clock, 
  Calendar, 
  Brain, 
  Users, 
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  questions: Question[]
}

interface Question {
  id: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'time' | 'rating'
  label: string
  placeholder?: string
  options?: string[]
  required?: boolean
  validation?: (value: any) => string | null
}

interface UserPrimer {
  goals: {
    shortTerm: string[]
    longTerm: string[]
  }
  roles: string[]
  values: string[]
  availability: {
    workHours: { start: string; end: string }
    productivityPeaks: string[]
    typicalDay: string
  }
  taskTypes: string[]
  preferences: {
    planningStyle: string
    notificationStyle: string
    focusDuration: number
  }
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [primer, setPrimer] = useState<UserPrimer | null>(null)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'goals',
      title: 'Your Goals & Aspirations',
      description: 'Let\'s understand what you want to achieve',
      icon: <Target className="h-6 w-6" />,
      questions: [
        {
          id: 'shortTermGoals',
          type: 'textarea',
          label: 'What are your short-term goals (next 3-6 months)?',
          placeholder: 'e.g., Launch a new product, Learn React, Get in shape...',
          required: true
        },
        {
          id: 'longTermGoals',
          type: 'textarea',
          label: 'What are your long-term goals (1-5 years)?',
          placeholder: 'e.g., Start a business, Buy a house, Master a skill...',
          required: true
        },
        {
          id: 'biggestChallenge',
          type: 'textarea',
          label: 'What\'s your biggest challenge in achieving these goals?',
          placeholder: 'e.g., Time management, Procrastination, Lack of focus...',
          required: true
        }
      ]
    },
    {
      id: 'roles',
      title: 'Your Roles & Responsibilities',
      description: 'Understanding your current commitments',
      icon: <Users className="h-6 w-6" />,
      questions: [
        {
          id: 'primaryRole',
          type: 'text',
          label: 'What\'s your primary professional role?',
          placeholder: 'e.g., Software Engineer, Student, Entrepreneur...',
          required: true
        },
        {
          id: 'otherRoles',
          type: 'multiselect',
          label: 'What other roles do you have?',
          options: [
            'Parent/Caregiver',
            'Student',
            'Volunteer',
            'Community Leader',
            'Mentor',
            'Creative Professional',
            'Athlete/Fitness Enthusiast',
            'Other'
          ],
          required: true
        },
        {
          id: 'responsibilities',
          type: 'textarea',
          label: 'What are your key responsibilities?',
          placeholder: 'Describe your main duties and commitments...',
          required: true
        }
      ]
    },
    {
      id: 'values',
      title: 'Your Values & Priorities',
      description: 'What matters most to you',
      icon: <Heart className="h-6 w-6" />,
      questions: [
        {
          id: 'coreValues',
          type: 'multiselect',
          label: 'What are your core values?',
          options: [
            'Family',
            'Career Growth',
            'Health & Wellness',
            'Learning & Education',
            'Creativity',
            'Community Service',
            'Financial Security',
            'Personal Development',
            'Work-Life Balance',
            'Innovation',
            'Leadership',
            'Adventure'
          ],
          required: true
        },
        {
          id: 'priorityAreas',
          type: 'multiselect',
          label: 'Which areas are most important to you right now?',
          options: [
            'Career Advancement',
            'Health & Fitness',
            'Relationships',
            'Learning New Skills',
            'Financial Planning',
            'Creative Projects',
            'Personal Growth',
            'Community Involvement'
          ],
          required: true
        }
      ]
    },
    {
      id: 'availability',
      title: 'Your Schedule & Availability',
      description: 'Understanding your time and energy patterns',
      icon: <Clock className="h-6 w-6" />,
      questions: [
        {
          id: 'workHours',
          type: 'time',
          label: 'What are your typical work hours?',
          required: true
        },
        {
          id: 'productivityPeaks',
          type: 'multiselect',
          label: 'When are you most productive?',
          options: [
            'Early Morning (5-9 AM)',
            'Late Morning (9-12 PM)',
            'Afternoon (12-5 PM)',
            'Evening (5-9 PM)',
            'Late Night (9 PM-12 AM)'
          ],
          required: true
        },
        {
          id: 'typicalDay',
          type: 'textarea',
          label: 'Describe your typical day',
          placeholder: 'Walk me through your usual daily routine...',
          required: true
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Your Planning Preferences',
      description: 'How you like to work and stay organized',
      icon: <Brain className="h-6 w-6" />,
      questions: [
        {
          id: 'planningStyle',
          type: 'select',
          label: 'What\'s your preferred planning style?',
          options: [
            'Detailed daily planning',
            'Weekly overview with flexibility',
            'Big picture monthly planning',
            'Adaptive/agile approach'
          ],
          required: true
        },
        {
          id: 'focusDuration',
          type: 'select',
          label: 'How long can you typically focus on one task?',
          options: [
            '15-30 minutes',
            '30-60 minutes',
            '1-2 hours',
            '2+ hours'
          ],
          required: true
        },
        {
          id: 'notificationStyle',
          type: 'select',
          label: 'How do you prefer to receive reminders?',
          options: [
            'Push notifications',
            'Email reminders',
            'Calendar alerts',
            'Minimal notifications'
          ],
          required: true
        }
      ]
    }
  ]

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const validateStep = (step: OnboardingStep): boolean => {
    return step.questions.every(question => {
      if (!question.required) return true
      const answer = answers[question.id]
      if (question.validation) {
        return !question.validation(answer)
      }
      // Patch: For multiselect, treat undefined/null as []
      if (question.type === 'multiselect') {
        return Array.isArray(answer) && answer.length > 0
      }
      return answer && (Array.isArray(answer) ? answer.length > 0 : answer.toString().trim() !== '')
    })
  }

  const canProceed = () => {
    return validateStep(onboardingSteps[currentStep])
  }

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      generatePrimer()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generatePrimer = async () => {
    setIsGeneratingPlan(true)
    
    // Structure the answers into a primer
    const userPrimer: UserPrimer = {
      goals: {
        shortTerm: answers.shortTermGoals?.split('\n').filter((g: string) => g.trim()) || [],
        longTerm: answers.longTermGoals?.split('\n').filter((g: string) => g.trim()) || []
      },
      roles: [answers.primaryRole, ...(answers.otherRoles || [])].filter(Boolean),
      values: answers.coreValues || [],
      availability: {
        workHours: answers.workHours || { start: '09:00', end: '17:00' },
        productivityPeaks: answers.productivityPeaks || [],
        typicalDay: answers.typicalDay || ''
      },
      taskTypes: answers.priorityAreas || [],
      preferences: {
        planningStyle: answers.planningStyle || '',
        notificationStyle: answers.notificationStyle || '',
        focusDuration: parseInt(answers.focusDuration?.split('-')[0]) || 30
      }
    }

    setPrimer(userPrimer)
    setIsGeneratingPlan(false)
  }

  const renderQuestion = (question: Question) => {
    const value = answers[question.id]

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option)
                    handleAnswerChange(question.id, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'time':
        return (
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={value?.start || '09:00'}
                onChange={(e) => handleAnswerChange(question.id, { ...value, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={value?.end || '17:00'}
                onChange={(e) => handleAnswerChange(question.id, { ...value, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = onboardingSteps[currentStep]

  if (isGeneratingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Building Your AI Profile</h2>
            <p className="text-gray-600">Analyzing your responses and creating your personalized action plan...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (primer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Primer Captured!</h2>
              <p className="text-gray-600">Your AI profile has been created successfully.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Your Profile Summary:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Goals:</strong> {primer.goals.shortTerm.length + primer.goals.longTerm.length} identified</p>
                <p><strong>Roles:</strong> {primer.roles.length} active roles</p>
                <p><strong>Values:</strong> {primer.values.length} core values</p>
                <p><strong>Focus Duration:</strong> {primer.preferences.focusDuration} minutes</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-4">
                Ready to generate detailed action plan?
              </p>
              <button 
                onClick={() => {
                  // Store primer in localStorage for the action plan page
                  localStorage.setItem('userPrimer', JSON.stringify(primer))
                  // Navigate to action plan page
                  window.location.href = '/app/action-plan'
                }}
                className="btn btn-primary"
              >
                Generate Action Plan
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Onboarding - Kairos</title>
        <meta name="description" content="Set up your AI-powered planning assistant" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                {currentStepData.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {currentStepData.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {currentStepData.description}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {currentStepData.questions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {question.label}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : 'Next'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnboardingPage 