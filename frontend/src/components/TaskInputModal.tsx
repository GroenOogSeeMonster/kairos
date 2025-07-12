import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { aiApi } from '../services/api'
import { 
  X,
  Plus,
  Brain,
  Clock,
  Calendar,
  Target,
  Tag,
  Loader2
} from 'lucide-react'

interface TaskInputModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated: (task: any) => void
  goals?: any[]
}

interface TaskForm {
  title: string
  description: string
  goalId: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  duration: number
  dueDate: string
  tags: string[]
}

const TaskInputModal: React.FC<TaskInputModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  goals = []
}) => {
  const [inputMode, setInputMode] = useState<'manual' | 'ai'>('manual')
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectBrief, setProjectBrief] = useState('')
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([])
  const [selectedGeneratedTasks, setSelectedGeneratedTasks] = useState<string[]>([])
  
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    goalId: '',
    priority: 'medium',
    duration: 30,
    dueDate: new Date().toISOString().split('T')[0],
    tags: []
  })

  const handleFormChange = (field: keyof TaskForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const task = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    
    onTaskCreated(task)
    onClose()
    resetForm()
  }

  const handleAIInput = async () => {
    if (!projectBrief.trim()) return
    
    setIsGenerating(true)
    try {
      const response = await aiApi.generateTasksFromBrief(projectBrief)
      setGeneratedTasks(response.data.tasks)
    } catch (error) {
      console.error('Failed to generate tasks:', error)
      // Fallback to mock data if API fails
      const mockGeneratedTasks = [
        {
          id: '1',
          title: 'Research project requirements',
          description: 'Gather detailed requirements and specifications for the project',
          priority: 'high' as const,
          duration: 60,
          tags: ['research', 'planning']
        },
        {
          id: '2',
          title: 'Create project timeline',
          description: 'Develop a comprehensive timeline with milestones and deadlines',
          priority: 'high' as const,
          duration: 45,
          tags: ['planning', 'timeline']
        }
      ]
      setGeneratedTasks(mockGeneratedTasks)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratedTaskSelection = (taskId: string) => {
    setSelectedGeneratedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const handleAddGeneratedTasks = () => {
    const tasksToAdd = generatedTasks.filter(task => selectedGeneratedTasks.includes(task.id))
    
    tasksToAdd.forEach(task => {
      const fullTask = {
        ...task,
        goalId: form.goalId,
        dueDate: form.dueDate,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      onTaskCreated(fullTask)
    })
    
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      goalId: '',
      priority: 'medium',
      duration: 30,
      dueDate: new Date().toISOString().split('T')[0],
      tags: []
    })
    setProjectBrief('')
    setGeneratedTasks([])
    setSelectedGeneratedTasks([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl">Add New Task</CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Mode Toggle */}
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setInputMode('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                inputMode === 'manual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Manual Input</span>
              </div>
            </button>
            <button
              onClick={() => setInputMode('ai')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                inputMode === 'ai' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Assistant</span>
              </div>
            </button>
          </div>

          {inputMode === 'manual' ? (
            /* Manual Input Form */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Provide more details about this task..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Goal
                  </label>
                  <select
                    value={form.goalId}
                    onChange={(e) => handleFormChange('goalId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a goal</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>{goal.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                    min="5"
                    step="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => handleFormChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              </div>
            </form>
          ) : (
            /* AI Assistant Input */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Brief
                </label>
                <textarea
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  placeholder="Describe your project or what you want to accomplish. AI will help break it down into actionable tasks..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAIInput}
                disabled={!projectBrief.trim() || isGenerating}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Tasks...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span>Generate Tasks</span>
                  </>
                )}
              </button>

              {generatedTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Generated Tasks</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {generatedTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedGeneratedTasks.includes(task.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleGeneratedTaskSelection(task.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {task.duration} min
                              </span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedGeneratedTasks.includes(task.id)}
                            onChange={() => handleGeneratedTaskSelection(task.id)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddGeneratedTasks}
                      disabled={selectedGeneratedTasks.length === 0}
                      className="btn btn-primary"
                    >
                      Add {selectedGeneratedTasks.length} Task{selectedGeneratedTasks.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskInputModal 