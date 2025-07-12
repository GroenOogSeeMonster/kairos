import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Loader2,
  List,
  Grid3X3
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate: string
  estimatedDuration: number
  actualDuration?: number
  goalId?: string
  goalTitle?: string
  createdAt: string
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    // Simulate loading tasks
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Review project proposal',
            description: 'Go through the client proposal and provide feedback',
            category: 'Work',
            priority: 'HIGH',
            status: 'COMPLETED',
            dueDate: '2024-02-15',
            estimatedDuration: 120,
            actualDuration: 90,
            goalId: '2',
            goalTitle: 'Complete Project Proposal',
            createdAt: '2024-02-10'
          },
          {
            id: '2',
            title: 'Setup React Native environment',
            description: 'Install and configure React Native development environment',
            category: 'Learning',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            dueDate: '2024-02-20',
            estimatedDuration: 60,
            goalId: '1',
            goalTitle: 'Learn React Native',
            createdAt: '2024-02-12'
          },
          {
            id: '3',
            title: 'Morning workout',
            description: 'Complete 30-minute cardio session',
            category: 'Health',
            priority: 'LOW',
            status: 'PENDING',
            dueDate: '2024-02-16',
            estimatedDuration: 30,
            goalId: '3',
            goalTitle: 'Improve Fitness',
            createdAt: '2024-02-14'
          },
          {
            id: '4',
            title: 'Read Chapter 5',
            description: 'Read and take notes on chapter 5 of the current book',
            category: 'Personal',
            priority: 'LOW',
            status: 'PENDING',
            dueDate: '2024-02-18',
            estimatedDuration: 45,
            goalId: '4',
            goalTitle: 'Read 12 Books',
            createdAt: '2024-02-13'
          },
          {
            id: '5',
            title: 'Client meeting preparation',
            description: 'Prepare agenda and materials for tomorrow\'s client meeting',
            category: 'Work',
            priority: 'URGENT',
            status: 'PENDING',
            dueDate: '2024-02-16',
            estimatedDuration: 90,
            createdAt: '2024-02-15'
          }
        ]
        
        setTasks(mockTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'HIGH':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'LOW':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Tasks - Kairos</title>
        <meta name="description" content="Manage and track your tasks" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track your tasks
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="select"
                >
                  <option value="all">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List/Grid */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first task'
                }
              </p>
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </button>
            </CardContent>
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-1 p-1 rounded-lg transition-colors ${
                        task.status === 'COMPLETED'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getStatusIcon(task.status)}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold truncate ${
                            task.status === 'COMPLETED' 
                              ? 'text-gray-500 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <p className={`text-sm mt-1 line-clamp-2 ${
                            task.status === 'COMPLETED' 
                              ? 'text-gray-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {task.description}
                          </p>
                        </div>
                        <button className="ml-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Badges and Info */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`badge ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.goalTitle && (
                          <span className="badge badge-secondary flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {task.goalTitle}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {task.estimatedDuration}min
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        task.status === 'COMPLETED'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      task.status === 'COMPLETED' 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm line-clamp-3 ${
                      task.status === 'COMPLETED' 
                        ? 'text-gray-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {task.description}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`badge ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.goalTitle && (
                      <span className="badge badge-secondary">
                        {task.goalTitle}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {task.estimatedDuration}min
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="btn btn-sm btn-outline flex-1">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-primary">
                      Start
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default TasksPage 