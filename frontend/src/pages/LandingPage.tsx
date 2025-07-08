import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Target, 
  Calendar, 
  Brain, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description: 'Get intelligent suggestions for goals and tasks based on your preferences and patterns.'
    },
    {
      icon: Target,
      title: 'Smart Goal Setting',
      description: 'Break down complex goals into actionable tasks with AI assistance.'
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Sync with Google Calendar, Outlook, and Apple Calendar for seamless scheduling.'
    },
    {
      icon: Zap,
      title: 'Automatic Prioritization',
      description: 'AI analyzes urgency and importance to help you focus on what matters most.'
    },
    {
      icon: CheckCircle,
      title: 'Progress Tracking',
      description: 'Visual progress tracking and AI-generated insights to keep you motivated.'
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'AI creates optimal daily schedules that fit your tasks around existing commitments.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content: 'Kairos has transformed how I plan my days. The AI suggestions are spot-on and help me stay focused on what really matters.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'The calendar integration is seamless, and the smart scheduling feature has saved me hours of planning time.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Entrepreneur',
      content: 'Finally, a planning app that understands my workflow and adapts to my needs. The AI insights are incredibly valuable.',
      rating: 5
    }
  ]

  return (
    <>
      <Helmet>
        <title>Kairos - AI-Powered Personal Planning Assistant</title>
        <meta name="description" content="Plan, prioritize, and achieve your goals with intelligent assistance. The modern personal planning assistant that adapts to your needs." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation */}
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-primary-600">Kairos</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="btn btn-ghost"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                Plan Smarter,{' '}
                <span className="text-primary-600">Achieve More</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Kairos is your AI-powered personal planning assistant that helps you set meaningful goals, 
                prioritize tasks intelligently, and stay on track with smart scheduling and insights.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Start Planning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline text-lg px-8 py-3"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Everything you need to plan effectively
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Powerful features designed to help you achieve your goals with less effort and more clarity.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card hover:shadow-medium transition-all duration-300"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/20">
                    <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Loved by productivity enthusiasts
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                See what our users are saying about their experience with Kairos.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Ready to transform your productivity?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join thousands of users who are already planning smarter and achieving more with Kairos.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kairos</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  AI-powered personal planning assistant
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Product</h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li><Link to="/features" className="hover:text-primary-600">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-primary-600">Pricing</Link></li>
                  <li><Link to="/integrations" className="hover:text-primary-600">Integrations</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li><Link to="/help" className="hover:text-primary-600">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
                  <li><Link to="/status" className="hover:text-primary-600">Status</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li><Link to="/about" className="hover:text-primary-600">About</Link></li>
                  <li><Link to="/blog" className="hover:text-primary-600">Blog</Link></li>
                  <li><Link to="/privacy" className="hover:text-primary-600">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                © 2024 Kairos. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage 