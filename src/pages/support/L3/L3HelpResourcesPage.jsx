import { useState } from 'react'
import { BookOpen, Video, Lightbulb, MessageCircle, Clock, Trophy, HelpCircle, Mail, Bug, ChevronDown, ChevronUp, ExternalLink, FileText, Users, Settings } from 'lucide-react'

/**
 * L3HelpResourcesPage - Leadership help documentation and knowledge base
 * Provides FAQs, resource links, documentation, and support information
 * Features: collapsible FAQ sections, resource grid, documentation categories
 */
export function L3HelpResourcesPage() {
  const [expandedFaqs, setExpandedFaqs] = useState({})

  const resources = [
    {
      icon: BookOpen,
      title: 'L3 Administration Guide',
      description: 'Complete guide to L3 support operations and administration',
      link: 'https://docs.example.com/l3-admin',
      external: true
    },
    {
      icon: Video,
      title: 'Video Training',
      description: 'Video tutorials on leadership and team management',
      link: 'https://www.example.com/l3-tutorials',
      external: true
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Best practices for managing support teams',
      link: 'https://docs.example.com/team-management',
      external: true
    },
    {
      icon: Settings,
      title: 'Configuration Guide',
      description: 'How to configure SLAs, auto-assignment, and rules',
      link: 'https://docs.example.com/l3-config',
      external: true
    },
    {
      icon: Lightbulb,
      title: 'Best Practices',
      description: 'L3 leadership and optimization strategies',
      link: 'https://docs.example.com/l3-best-practices',
      external: true
    },
    {
      icon: MessageCircle,
      title: 'Team Chat',
      description: 'Connect with other L3 leaders and support teams',
      link: 'https://chat.example.com',
      external: true
    },
    {
      icon: Clock,
      title: 'SLA Configuration',
      description: 'Setup and manage SLA targets for each tier',
      link: 'https://docs.example.com/sla-config',
      external: true
    },
    {
      icon: Trophy,
      title: 'Performance Analytics',
      description: 'Guide to performance metrics and analytics',
      link: 'https://docs.example.com/analytics',
      external: true
    },
    {
      icon: FileText,
      title: 'Canned Responses',
      description: 'Create and manage response templates',
      link: 'https://docs.example.com/templates',
      external: true
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Frequently asked questions for L3 operations',
      link: 'https://docs.example.com/l3-faq',
      external: true
    },
    {
      icon: Mail,
      title: 'Contact Support',
      description: 'Reach out to the support infrastructure team',
      link: 'mailto:support@example.com',
      external: true
    },
    {
      icon: Bug,
      title: 'Report Issues',
      description: 'Submit bug reports or feature requests',
      link: 'https://support.example.com/report-bug',
      external: true
    }
  ]

  const faqCategories = [
    {
      title: 'Team Management',
      faqs: [
        {
          question: 'How do I add new team members?',
          answer: 'Navigate to Team Management page, click "Add Member", and fill in the required information including name, email, tier assignment, and role.'
        },
        {
          question: 'How can I monitor team performance?',
          answer: 'Use the Performance Metrics page to view detailed analytics for each team member. Sort by metrics like resolution time, satisfaction, and SLA compliance.'
        },
        {
          question: 'How do I assign roles to team members?',
          answer: 'Go to Team Management, select a member, and update their role in the edit modal. Roles determine access levels and responsibilities.'
        },
        {
          question: 'Can I bulk edit team settings?',
          answer: 'Currently bulk editing is done individually. Select each member and update their tier, role, or status as needed.'
        }
      ]
    },
    {
      title: 'SLA Configuration',
      faqs: [
        {
          question: 'How do I set SLA targets?',
          answer: 'Navigate to SLA Configuration page. Select the tier (L1, L2, L3) and set response times (minutes) and resolution times (hours) for each priority level.'
        },
        {
          question: 'What are the default SLA targets?',
          answer: 'Defaults vary by tier. L1 typically has faster targets. Urgent issues usually have 15-min response and 2-hour resolution targets.'
        },
        {
          question: 'How often should I review SLAs?',
          answer: 'Review SLAs quarterly or when team capacity changes significantly. Monitor compliance rates to ensure targets are achievable.'
        },
        {
          question: 'Can different departments have different SLAs?',
          answer: 'Currently SLAs are tier-based. Custom SLAs by category can be configured in advanced settings.'
        }
      ]
    },
    {
      title: 'Auto-Assignment',
      faqs: [
        {
          question: 'What are auto-assignment strategies?',
          answer: 'Round Robin: Distribute equally. Load Balancing: Assign to least busy agent. Skill-Based: Match ticket category to agent skills.'
        },
        {
          question: 'How do I enable auto-assignment?',
          answer: 'Go to Auto-Assign Configuration page, select your preferred strategy (Round Robin, Load Balancing, or Skill-Based), and save.'
        },
        {
          question: 'Can I set maximum tickets per agent?',
          answer: 'Yes, use the "Max Tickets Per Agent" setting to limit workload. When reached, tickets go to escalation queue.'
        },
        {
          question: 'What is skill matching weight?',
          answer: 'This determines how heavily skill matching is weighted (0-100%) in Skill-Based assignment. Higher values prioritize skill matches.'
        }
      ]
    },
    {
      title: 'Escalations',
      faqs: [
        {
          question: 'How do escalations work?',
          answer: 'When a ticket reaches criteria (time, priority, manual), it moves to Escalation Queue. L3 can review, resolve, or reject.'
        },
        {
          question: 'How do I manage the escalation queue?',
          answer: 'Visit Escalation Queue page. Review each ticket, take action (resolve/reassign), or reject if escalation was unnecessary.'
        },
        {
          question: 'Can I set auto-escalation rules?',
          answer: 'Yes, in Auto-Assign Configuration set "Auto-Escalate After Hours" to automatically escalate old unresolved tickets.'
        },
        {
          question: 'How are priorities handled in escalations?',
          answer: 'Escalation Queue displays by priority. Critical/Urgent issues appear first for faster resolution.'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      faqs: [
        {
          question: 'What metrics are tracked?',
          answer: 'Tickets resolved, satisfaction scores, SLA compliance, response times, resolution times, category breakdown, and team comparisons.'
        },
        {
          question: 'How often are reports updated?',
          answer: 'Reports update in real-time. Historical data is available for customizable date ranges from last 7 days to 12 months.'
        },
        {
          question: 'Can I export reports?',
          answer: 'Yes, export reports in CSV or PDF format from each report tab. Useful for presentations and stakeholder communication.'
        },
        {
          question: 'How do I interpret performance trends?',
          answer: 'Green indicates good performance, yellow is moderate, red needs attention. Compare trends over time to identify improvements or issues.'
        }
      ]
    },
    {
      title: 'Tickets & Queue Management',
      faqs: [
        {
          question: 'How do I view all tickets?',
          answer: 'The Tickets page shows all support tickets with filtering by status, priority, tier, and customer. Use search to find specific tickets.'
        },
        {
          question: 'Can I bulk update tickets?',
          answer: 'Select multiple tickets and use bulk actions to change status, priority, or assign to specific agents quickly.'
        },
        {
          question: 'How do I reassign tickets?',
          answer: 'Click the ticket, select "Reassign", choose a new agent, and confirm. The ticket transfers immediately.'
        },
        {
          question: 'What statuses can tickets have?',
          answer: 'Open, In Progress, Resolved, Closed, and Escalated. Each status indicates the ticket lifecycle stage.'
        }
      ]
    },
    {
      title: 'Canned Responses',
      faqs: [
        {
          question: 'How do I create response templates?',
          answer: 'Go to Canned Responses page, click "Create New", enter title, category, and template content. Save for team use.'
        },
        {
          question: 'Can I organize responses by category?',
          answer: 'Yes, templates are organized by category (billing, technical, account, etc.). Filter by category for quick access.'
        },
        {
          question: 'How do agents use canned responses?',
          answer: 'Agents can search and insert templates when replying. Templates update dynamically with customer-specific details.'
        },
        {
          question: 'Can I track response usage?',
          answer: 'Yes, each template shows usage count and last updated date. Popular templates help identify effective solutions.'
        }
      ]
    },
    {
      title: 'Account & Settings',
      faqs: [
        {
          question: 'How do I update my profile?',
          answer: 'Go to Settings > Profile to update your name, email, phone, photo, and other personal information.'
        },
        {
          question: 'What notification settings are available?',
          answer: 'Customize email notifications for escalations, reports, team alerts. Control frequency (instant, daily, weekly).'
        },
        {
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to Settings > Security and enable 2FA. Scan the QR code with an authenticator app for added security.'
        },
        {
          question: 'Can I change my password?',
          answer: 'Yes, in Settings > Security, enter your current password and new password twice. Changes take effect immediately.'
        }
      ]
    }
  ]

  const documentationCategories = [
    {
      title: 'Getting Started',
      docs: [
        'L3 Access Overview',
        'First Day Checklist',
        'User Interface Guide',
        'Keyboard Shortcuts'
      ]
    },
    {
      title: 'Operations',
      docs: [
        'Daily Operations Workflow',
        'Queue Management',
        'Ticket Processing',
        'Escalation Procedures'
      ]
    },
    {
      title: 'Leadership',
      docs: [
        'Team Leadership Guide',
        'Performance Evaluation',
        'Staff Development',
        'Incident Management'
      ]
    },
    {
      title: 'System Administration',
      docs: [
        'System Configuration',
        'Integration Setup',
        'API Documentation',
        'Database Management'
      ]
    }
  ]

  const toggleFaqExpand = (category, index) => {
    const key = `${category}-${index}`
    setExpandedFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Help & Resources</h1>
        <p className="text-white/70">Everything you need to lead and manage the support team</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
          <p className="text-2xl font-bold text-purple-400">85%</p>
          <p className="text-white/60 text-sm">Team Satisfaction</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
          <p className="text-2xl font-bold text-purple-400">92%</p>
          <p className="text-white/60 text-sm">SLA Compliance</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
          <p className="text-2xl font-bold text-purple-400">45m</p>
          <p className="text-white/60 text-sm">Avg Response Time</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all">
          <p className="text-2xl font-bold text-purple-400">1200+</p>
          <p className="text-white/60 text-sm">Docs & Resources</p>
        </div>
      </div>

      {/* Resource Cards */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Resources & Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, idx) => {
            const Icon = resource.icon
            return (
              <a
                key={idx}
                href={resource.link}
                target={resource.external ? '_blank' : undefined}
                rel={resource.external ? 'noopener noreferrer' : undefined}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/40 group-hover:to-purple-600/40 transition-all">
                    <Icon className="text-purple-400 group-hover:text-purple-300" size={24} />
                  </div>
                  {resource.external && (
                    <ExternalLink className="text-white/40 group-hover:text-purple-400 transition-colors ml-auto" size={16} />
                  )}
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-white/60 text-sm">{resource.description}</p>
              </a>
            )
          })}
        </div>
      </div>

      {/* Documentation Categories */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentationCategories.map((cat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="text-purple-400" size={20} />
                {cat.title}
              </h3>
              <ul className="space-y-2">
                {cat.docs.map((doc, docIdx) => (
                  <li key={docIdx}>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-purple-400 rounded-full" />
                      {doc}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-white/10">
                {category.faqs.map((faq, faqIdx) => {
                  const key = `${catIdx}-${faqIdx}`
                  const isExpanded = expandedFaqs[key]
                  return (
                    <button
                      key={faqIdx}
                      onClick={() => toggleFaqExpand(catIdx, faqIdx)}
                      className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{faq.question}</p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {isExpanded ? (
                            <ChevronUp className="text-purple-400" size={20} />
                          ) : (
                            <ChevronDown className="text-white/40" size={20} />
                          )}
                        </div>
                      </div>

                      {/* FAQ Answer */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-gradient-to-r from-purple-500/10 via-purple-600/10 to-purple-700/10 border border-purple-500/30 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Need Additional Help?</h3>
        <p className="text-white/70 mb-6">
          If you can't find what you're looking for, reach out to our support team
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:support@example.com"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Email Support
          </a>
          <a
            href="https://chat.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Chat with Team
          </a>
        </div>
      </div>
    </div>
  )
}
