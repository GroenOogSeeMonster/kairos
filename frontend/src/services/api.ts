import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string) => {
    return api.post('/auth/login', { email })
  },

  register: async (email: string, name: string) => {
    return api.post('/auth/register', { email, name })
  },

  googleLogin: async (idToken: string) => {
    return api.post('/auth/google', { idToken })
  },

  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  updateUser: async (data: any) => {
    return api.put('/users/profile', data)
  },

  refreshToken: async (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken })
  },
}

// Goals API
export const goalsApi = {
  getGoals: async () => {
    return api.get('/goals')
  },

  getGoal: async (id: string) => {
    return api.get(`/goals/${id}`)
  },

  createGoal: async (data: any) => {
    return api.post('/goals', data)
  },

  updateGoal: async (id: string, data: any) => {
    return api.put(`/goals/${id}`, data)
  },

  deleteGoal: async (id: string) => {
    return api.delete(`/goals/${id}`)
  },

  completeGoal: async (id: string) => {
    return api.patch(`/goals/${id}/complete`)
  },
}

// Tasks API
export const tasksApi = {
  getTasks: async (params?: any) => {
    return api.get('/tasks', { params })
  },

  getTask: async (id: string) => {
    return api.get(`/tasks/${id}`)
  },

  createTask: async (data: any) => {
    return api.post('/tasks', data)
  },

  updateTask: async (id: string, data: any) => {
    return api.put(`/tasks/${id}`, data)
  },

  deleteTask: async (id: string) => {
    return api.delete(`/tasks/${id}`)
  },

  completeTask: async (id: string) => {
    return api.patch(`/tasks/${id}/complete`)
  },

  prioritizeTasks: async (taskIds: string[]) => {
    return api.post('/tasks/prioritize', { taskIds })
  },
}

// Calendar API
export const calendarApi = {
  getEvents: async (params?: any) => {
    return api.get('/calendar/events', { params })
  },

  getEvent: async (id: string) => {
    return api.get(`/calendar/events/${id}`)
  },

  createEvent: async (data: any) => {
    return api.post('/calendar/events', data)
  },

  updateEvent: async (id: string, data: any) => {
    return api.put(`/calendar/events/${id}`, data)
  },

  deleteEvent: async (id: string) => {
    return api.delete(`/calendar/events/${id}`)
  },

  syncCalendar: async (provider: string) => {
    return api.post(`/calendar/sync/${provider}`)
  },
}

// Reflections API
export const reflectionsApi = {
  getReflections: async (params?: any) => {
    return api.get('/reflections', { params })
  },

  getReflection: async (id: string) => {
    return api.get(`/reflections/${id}`)
  },

  createReflection: async (data: any) => {
    return api.post('/reflections', data)
  },

  updateReflection: async (id: string, data: any) => {
    return api.put(`/reflections/${id}`, data)
  },

  deleteReflection: async (id: string) => {
    return api.delete(`/reflections/${id}`)
  },
}

// Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    return api.get('/notifications')
  },

  markAsRead: async (id: string) => {
    return api.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: async () => {
    return api.patch('/notifications/read-all')
  },

  deleteNotification: async (id: string) => {
    return api.delete(`/notifications/${id}`)
  },
}

// AI API
export const aiApi = {
  generateGoalSuggestions: async (userInput: string) => {
    return api.post('/ai/goal-suggestions', { userInput })
  },

  generateTaskSuggestions: async (goalId: string) => {
    return api.post('/ai/task-suggestions', { goalId })
  },

  prioritizeTasks: async (taskIds: string[]) => {
    return api.post('/ai/prioritize-tasks', { taskIds })
  },

  generateDailySchedule: async (date: string) => {
    return api.post('/ai/daily-schedule', { date })
  },

  generateReflectionPrompt: async () => {
    return api.get('/ai/reflection-prompt')
  },
}

// Integrations API
export const integrationsApi = {
  getIntegrations: async () => {
    return api.get('/integrations')
  },

  connectIntegration: async (provider: string, data: any) => {
    return api.post(`/integrations/${provider}/connect`, data)
  },

  disconnectIntegration: async (provider: string) => {
    return api.delete(`/integrations/${provider}`)
  },

  syncIntegration: async (provider: string) => {
    return api.post(`/integrations/${provider}/sync`)
  },
}

export default api