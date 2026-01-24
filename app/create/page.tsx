'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Target,
  Calendar,
  FileText,
  Sparkles,
  Check,
  Wallet,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/landing-page/Navbar'
import { usePrivy } from '@privy-io/react-auth'

const categories = [
  { id: 'environment', label: 'Environment', icon: '🌱' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'community', label: 'Community', icon: '🤝' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
]

const steps = [
  { id: 1, title: 'Basics', icon: FileText },
  { id: 2, title: 'Story', icon: Sparkles },
  { id: 3, title: 'Funding', icon: Target },
  { id: 4, title: 'Review', icon: Check },
]

export default function CreateCampaignPage() {
  const { login, authenticated, user } = usePrivy()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    category: '',
    coverImage: null as File | null,
    story: '',
    fundingGoal: '',
    duration: '30',
    milestones: [{ title: '', amount: '' }],
  })

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', amount: '' }]
    }))
  }

  const updateMilestone = (index: number, field: 'title' | 'amount', value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.shortDescription && formData.category
      case 2:
        return formData.story.length >= 100
      case 3:
        return formData.fundingGoal && Number(formData.fundingGoal) > 0
      default:
        return true
    }
  }

  const handleSubmit = () => {
    if (!authenticated) {
      login()
      return
    }
    // Handle campaign creation
    console.log('Creating campaign:', formData)
  }

  // Require authentication
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 px-6">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-card border border-border rounded-2xl"
            >
              <div className="w-20 h-20 bg-hope/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-hope" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-3">
                Connect Your Wallet
              </h1>
              <p className="text-muted-foreground mb-6">
                You need to connect your wallet to create a campaign on Hope Rise.
              </p>
              <Button
                onClick={() => login()}
                className="w-full py-6 rounded-xl text-lg font-semibold bg-hope text-black hover:bg-hope/90"
              >
                Connect Wallet
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/explore">
              <Button variant="ghost" className="-ml-2 text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Create Your Campaign
              </h1>
              <p className="text-muted-foreground">
                Tell your story and start raising funds for your project.
              </p>
            </motion.div>
          </div>

          {/* Progress steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= step.id
                          ? 'bg-hope text-black'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-hope' : 'bg-secondary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="Give your campaign a catchy title"
                    className="w-full px-4 py-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20"
                    maxLength={80}
                  />
                  <p className="text-xs text-muted-foreground mt-2">{formData.title.length}/80 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Short Description *</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData('shortDescription', e.target.value)}
                    placeholder="Briefly describe your campaign in 1-2 sentences"
                    rows={3}
                    className="w-full px-4 py-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20 resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-2">{formData.shortDescription.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Category *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => updateFormData('category', category.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.category === category.id
                            ? 'border-hope bg-hope/10'
                            : 'border-border hover:border-hope/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{category.icon}</span>
                        <span className="font-medium text-sm">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-hope/50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-1">Drop your image here, or browse</p>
                    <p className="text-sm text-muted-foreground">Recommended: 1200 x 675 pixels (16:9)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Story */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Story *</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell backers why this project matters. What will the funds be used for? Why should people support you?
                  </p>
                  <textarea
                    value={formData.story}
                    onChange={(e) => updateFormData('story', e.target.value)}
                    placeholder="Tell your story... (minimum 100 characters)"
                    rows={12}
                    className="w-full px-4 py-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20 resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${formData.story.length < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {formData.story.length} characters (minimum 100)
                    </p>
                    <p className="text-xs text-muted-foreground">Markdown supported</p>
                  </div>
                </div>

                <div className="p-4 bg-hope/10 border border-hope/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-hope mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Tips for a great story</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Explain the problem you are solving</li>
                        <li>• Share your background and why you care</li>
                        <li>• Be specific about how funds will be used</li>
                        <li>• Add images and videos for more engagement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Funding */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Funding Goal (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={formData.fundingGoal}
                        onChange={(e) => updateFormData('fundingGoal', e.target.value)}
                        placeholder="10,000"
                        className="w-full pl-8 pr-4 py-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Funds will be received in SOL equivalent</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Campaign Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => updateFormData('duration', e.target.value)}
                      className="w-full px-4 py-4 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:border-hope/50"
                    >
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium">Milestones (Optional)</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMilestone}
                      className="rounded-full"
                    >
                      Add Milestone
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Break down your funding goal into milestones to show backers your progress.
                  </p>
                  <div className="space-y-3">
                    {formData.milestones.map((milestone, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="Milestone title"
                          className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50"
                        />
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <input
                            type="number"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                            placeholder="Amount"
                            className="w-full pl-7 pr-3 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50"
                          />
                        </div>
                        {formData.milestones.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-secondary border border-border rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Platform Fees</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Hope Rise charges 0% platform fees. You keep 100% of what you raise. Only Solana network fees apply.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-hope/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-hope" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Ready to Launch!</h2>
                  <p className="text-muted-foreground">Review your campaign details before publishing.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="font-semibold">{formData.title || 'Not set'}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p>{formData.shortDescription || 'Not set'}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold capitalize">{formData.category || 'Not set'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Funding Goal</p>
                      <p className="font-semibold">${formData.fundingGoal ? Number(formData.fundingGoal).toLocaleString() : '0'}</p>
                    </div>

                    <div className="p-4 bg-secondary rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold">{formData.duration} days</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-hope/10 border border-hope/20 rounded-xl">
                  <p className="text-sm">
                    By launching this campaign, you agree to our Terms of Service and confirm that all information provided is accurate.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="rounded-xl bg-hope text-black hover:bg-hope/90"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="rounded-xl bg-hope text-black hover:bg-hope/90 glow-hope"
              >
                Launch Campaign
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
