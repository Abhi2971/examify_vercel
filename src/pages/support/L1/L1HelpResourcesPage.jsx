import { BookOpen, Video, Lightbulb, MessageCircle, Clock, Trophy, HelpCircle, Mail, Bug } from 'lucide-react'

export function L1HelpResourcesPage() {
  const resources = [
    {
      icon: BookOpen,
      title: 'Getting Started Guide',
      description: 'Learn the basics of handling support tickets',
      link: 'https://docs.example.com/getting-started',
      external: true
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for common tasks',
      link: 'https://www.example.com/tutorials',
      external: true
    },
    {
      icon: Lightbulb,
      title: 'Best Practices',
      description: 'Discover tips and tricks to improve your efficiency',
      link: 'https://docs.example.com/best-practices',
      external: true
    },
    {
      icon: MessageCircle,
      title: 'Team Chat',
      description: 'Connect with other support agents',
      link: 'https://chat.example.com',
      external: true
    },
    {
      icon: Clock,
      title: 'SLA Information',
      description: 'Understand response and resolution time targets',
      link: 'https://docs.example.com/sla',
      external: true
    },
    {
      icon: Trophy,
      title: 'Performance Tips',
      description: 'Tips to boost your ticket resolution rate',
      link: 'https://docs.example.com/performance',
      external: true
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Frequently asked questions about your role',
      link: 'https://docs.example.com/faq',
      external: true
    },
    {
      icon: Mail,
      title: 'Contact Support',
      description: 'Reach out to the support team for help',
      link: 'mailto:support@example.com',
      external: true
    },
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Submit a bug report or feature request',
      link: 'https://support.example.com/report-bug',
      external: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Help & Resources</h1>
        <p className="text-white/70">Everything you need to succeed as an L1 support agent</p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, idx) => {
          const Icon = resource.icon
          return (
            <a
              key={idx}
              href={resource.link}
              target={resource.external ? '_blank' : undefined}
              rel={resource.external ? 'noopener noreferrer' : undefined}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#00C4B4]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#00C4B4]/20 to-[#00E5FF]/20 group-hover:from-[#00C4B4] group-hover:to-[#00E5FF] transition-all">
                  <Icon className="text-[#00C4B4] group-hover:text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-[#00C4B4] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-white/60 text-sm">{resource.description}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#00C4B4]">98%</p>
          <p className="text-white/60 text-sm">Avg Success Rate</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#00C4B4]">2h</p>
          <p className="text-white/60 text-sm">Avg Resolution</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#00C4B4]">4.8★</p>
          <p className="text-white/60 text-sm">Customer Rating</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#00C4B4]">70+</p>
          <p className="text-white/60 text-sm">Resources</p>
        </div>
      </div>
    </div>
  )
}
