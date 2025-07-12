import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { aiApi } from '../services/api'
import { 
  Target, 
  Clock, 
  Calendar, 
  CheckCircle,
  Loader2,
  ArrowRight,
  Edit3,
  Trash2,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react'

interface ActionPlanTask {
  goal: string
  task: string
  why: string
  where: string
  what: string
  how: string
  duration: number
  suggested_time: string
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface ActionPlanPageProps {
  primer?: any
}

const ActionPlanPage: React.FC<ActionPlanPageProps> = ({ primer: propPrimer }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionPlan, setActionPlan] = useState<ActionPlanTask[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [primer, setPrimer] = useState<any>(null)

  useEffect(() => {
    // Get primer from localStorage or props
    const storedPrimer = localStorage.getItem('userPrimer')
    const userPrimer = propPrimer || (storedPrimer ? JSON.parse(storedPrimer) : null)
    
    if (userPrimer) {
      setPrimer(userPrimer)
      generateActionPlan(userPrimer)
    }
  }, [propPrimer])

  const generateActionPlan = async (userPrimer: any) => {
    setIsGenerating(true)
    
    try {
      const response = await aiApi.generateActionPlan(userPrimer)
      setActionPlan(response.data.actionPlan)
    } catch (error) {
      console.error('Failed to generate action plan:', error)
      // Fallback to mock data if API fails
      const mockActionPlan: ActionPlanTask[] = [
        {
          goal: "Launch a new product",
          task: "Research market competitors",
          why: "Understanding the competitive landscape will help position our product effectively",
          where: "Online research, industry reports, competitor websites",
          what: "Analyze 5-10 key competitors, their features, pricing, and market positioning",
          how: "Create a spreadsheet to track findings, schedule 2 hours for deep research",
          duration: 120,
          suggested_time: "2025-01-15T09:00:00Z",
          tags: ["research", "product", "business"],
          priority: "high"
        },
        {
          goal: "Learn React",
          task: "Complete React fundamentals course",
          why: "Building a strong foundation will accelerate your learning journey",
          where: "Online learning platform (Udemy, Coursera, or React docs)",
          what: "Complete modules on components, state, props, and hooks",
          how: "Dedicate 1 hour daily, practice with small projects, take notes",
          duration: 60,
          suggested_time: "2025-01-15T14:00:00Z",
          tags: ["learning", "coding", "react"],
          priority: "medium"
        }
      ]
      setActionPlan(mockActionPlan)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTaskSelection = (taskIndex: number) => {
    setSelectedTasks(prev => {
      const taskId = actionPlan[taskIndex].task
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Action Plan</h2>
            <p className="text-gray-600">AI is analyzing your profile and creating personalized tasks...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Action Plan - Kairos</title>
        <meta name="description" content="Your AI-generated action plan" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Action Plan</h1>
            <p className="text-gray-600">
              Based on your profile, here are personalized tasks to help you achieve your goals.
            </p>
          </div>

          {/* Action Plan Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {actionPlan.map((task, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{task.goal}</span>
                      </div>
                      <CardTitle className="text-lg">{task.task}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => handleTaskSelection(index)}
                        className={`p-1 rounded ${selectedTasks.includes(task.task) ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Task Details */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Why this matters:</h4>
                      <p className="text-sm text-gray-600">{task.why}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Where to do it:</h4>
                      <p className="text-sm text-gray-600">{task.where}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">What to do:</h4>
                      <p className="text-sm text-gray-600">{task.what}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">How to do it:</h4>
                      <p className="text-sm text-gray-600">{task.how}</p>
                    </div>
                  </div>

                  {/* Task Metadata */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(task.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDateTime(task.suggested_time)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {task.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Edit Plan</span>
              </button>
              <button className="btn btn-outline flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Tasks</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedTasks.length} of {actionPlan.length} tasks selected
              </span>
              <button 
                onClick={() => {
                  // Store selected tasks in localStorage for calendar view
                  const selectedTaskData = actionPlan.filter(task => selectedTasks.includes(task.task))
                  localStorage.setItem('actionPlanTasks', JSON.stringify(selectedTaskData))
                  // Navigate to calendar view
                  window.location.href = '/app/calendar-view'
                }}
                className="btn btn-primary flex items-center space-x-2"
                disabled={selectedTasks.length === 0}
              >
                <Calendar className="h-4 w-4" />
                <span>Add to Calendar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {selectedTasks.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} ready for calendar
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Click "Add to Calendar" to schedule these tasks in your calendar view.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ActionPlanPage 