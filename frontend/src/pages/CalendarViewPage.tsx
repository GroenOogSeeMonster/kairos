import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Calendar,
  Clock,
  Target,
  Tag,
  Edit3,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Filter
} from 'lucide-react'

interface CalendarTask {
  id: string
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

interface CalendarViewPageProps {
  tasks?: CalendarTask[]
}

const CalendarViewPage: React.FC<CalendarViewPageProps> = ({ tasks: propTasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [filters, setFilters] = useState({
    priority: 'all',
    tags: [] as string[],
    goals: [] as string[]
  })

  useEffect(() => {
    // Get tasks from localStorage or props
    const storedTasks = localStorage.getItem('actionPlanTasks')
    const userTasks = propTasks || (storedTasks ? JSON.parse(storedTasks) : [])
    setTasks(userTasks)
  }, [propTasks])

  const getDaysInWeek = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.suggested_time)
      return taskDate.toDateString() === date.toDateString()
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

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task)
    setIsEditing(false)
  }

  const handleTaskEdit = (task: CalendarTask) => {
    setSelectedTask(task)
    setIsEditing(true)
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
  }

  const handleTaskUpdate = (updatedTask: CalendarTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
    setSelectedTask(updatedTask)
    setIsEditing(false)
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const hourTasks = dayTasks.filter(task => {
            const taskHour = new Date(task.suggested_time).getHours()
            return taskHour === hour
          })

          return (
            <div key={hour} className="flex border-b border-gray-200 min-h-[60px]">
              <div className="w-20 p-2 text-sm text-gray-500 border-r border-gray-200">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              <div className="flex-1 p-2">
                {hourTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="mb-2 p-2 rounded border cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{task.task}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatTime(task.suggested_time)} • {formatDuration(task.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate)

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayTasks = getTasksForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div key={index} className="min-h-[600px]">
              <div className={`p-2 text-center border-b ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                <div className="text-sm font-medium">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>
              <div className="p-2 space-y-2">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="p-2 rounded border cursor-pointer hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{task.task}</span>
                      <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(task.suggested_time)}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {task.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTaskDetail = () => {
    if (!selectedTask) return null

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{selectedTask.task}</CardTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTaskEdit(selectedTask)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleTaskDelete(selectedTask.id)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">{selectedTask.goal}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Why this matters:</h4>
            <p className="text-sm text-gray-600">{selectedTask.why}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Where to do it:</h4>
            <p className="text-sm text-gray-600">{selectedTask.where}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">What to do:</h4>
            <p className="text-sm text-gray-600">{selectedTask.what}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">How to do it:</h4>
            <p className="text-sm text-gray-600">{selectedTask.how}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(selectedTask.duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatTime(selectedTask.suggested_time)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              {selectedTask.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Helmet>
        <title>Calendar View - Kairos</title>
        <meta name="description" content="Your scheduled tasks and goals" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
              <div className="flex items-center space-x-4">
                <button className="btn btn-outline flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
                <button className="btn btn-outline flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric',
                    ...(viewMode === 'day' && { day: 'numeric' })
                  })}
                </h2>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'day' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'week' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {viewMode === 'day' && renderDayView()}
                  {viewMode === 'week' && renderWeekView()}
                  {viewMode === 'month' && (
                    <div className="text-center text-gray-500 py-8">
                      Month view coming soon...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Task Detail Sidebar */}
            <div className="lg:col-span-1">
              {selectedTask ? (
                renderTaskDetail()
              ) : (
                <Card className="h-full">
                  <CardContent className="p-6 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a task to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CalendarViewPage 