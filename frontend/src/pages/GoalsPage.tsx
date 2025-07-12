import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Target, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
  targetDate: string
  progress: number
  tasksCount: number
  completedTasksCount: number
  createdAt: string
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  useEffect(() => {
    // Simulate loading goals
    const loadGoals = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockGoals: Goal[] = [
          {
            id: '1',
            title: 'Learn React Native',
            description: 'Master React Native development for mobile app creation',
            category: 'Learning',
            priority: 'HIGH',
            status: 'ACTIVE',
            targetDate: '2024-03-15',
            progress: 65,
            tasksCount: 8,
            completedTasksCount: 5,
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            title: 'Complete Project Proposal',
            description: 'Finish the comprehensive project proposal for the new client',
            category: 'Work',
            priority: 'URGENT',
            status: 'ACTIVE',
            targetDate: '2024-02-28',
            progress: 90,
            tasksCount: 12,
            completedTasksCount: 11,
            createdAt: '2024-01-10'
          },
          {
            id: '3',
            title: 'Improve Fitness',
            description: 'Build a consistent workout routine and improve overall fitness',
            category: 'Health',
            priority: 'MEDIUM',
            status: 'ACTIVE',
            targetDate: '2024-06-30',
            progress: 30,
            tasksCount: 15,
            completedTasksCount: 4,
            createdAt: '2024-01-01'
          },
          {
            id: '4',
            title: 'Read 12 Books',
            description: 'Read one book per month to expand knowledge and perspective',
            category: 'Personal',
            priority: 'LOW',
            status: 'COMPLETED',
            targetDate: '2024-12-31',
            progress: 100,
            tasksCount: 12,
            completedTasksCount: 12,
            createdAt: '2024-01-01'
          }
        ]
        
        setGoals(mockGoals)
      } catch (error) {
        console.error('Failed to load goals:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGoals()
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
      case 'ACTIVE':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'PAUSED':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card">
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Goals - Kairos</title>
        <meta name="description" content="Manage and track your personal goals" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track your personal goals
            </p>
          </div>
          <button className="btn btn-primary mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </button>
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
                  placeholder="Search goals..."
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
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
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

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No goals found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first goal'
                }
              </p>
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {goal.description}
                      </p>
                    </div>
                    <button className="ml-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                    <span className={`badge ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                    <span className="badge badge-secondary">
                      {goal.category}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {goal.completedTasksCount}/{goal.tasksCount} tasks
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="btn btn-sm btn-outline flex-1">
                      View Details
                    </button>
                    <button className="btn btn-sm btn-primary">
                      Update
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

export default GoalsPage 