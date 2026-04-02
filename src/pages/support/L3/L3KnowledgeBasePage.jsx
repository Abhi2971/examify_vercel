import { useState } from 'react'
import { ChevronDown, Search, BookOpen, Settings, AlertCircle, BarChart3, Users, Lock } from 'lucide-react'

/**
 * L3HelpResourcesPage - L3-specific help and configuration guides
 * Static help content for L3 functions, documentation links, and troubleshooting
 */
export function L3KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState({})

  const sections = [
    {
      id: 'team_management',
      title: 'Team Management',
      icon: Users,
      content: [
        {
          question: 'How do I add a new team member?',
          answer: 'Go to Team Management page and click "Add Member". Fill in their details (name, email, tier, role) and assign skills. They\'ll be sent a welcome email.'
        },
        {
          question: 'How do I update a team member\'s skills?',
          answer: 'Click the Edit button next to their name in the Team Management table. Check/uncheck the relevant skills and save.'
        },
        {
          question: 'What happens when I delete a team member?',
          answer: 'Deleting marks the member as inactive (soft delete). Their tickets are reassigned based on the auto-assign configuration. Historical data is preserved for reporting.'
        }
      ]
    },
    {
      id: 'sla_config',
      title: 'SLA Configuration',
      icon: AlertCircle,
      content: [
        {
          question: 'What is an SLA?',
          answer: 'Service Level Agreement (SLA) defines target response and resolution times for tickets. Different tiers have different SLA targets. Breaching SLA can trigger automatic escalation.'
        },
        {
          question: 'How do I set different SLAs for each tier?',
          answer: 'Go to SLA Configuration and select the tier (L1, L2, L3) using the tabs. Configure first response time, resolution times by priority, and satisfaction targets.'
        },
        {
          question: 'What does "Escalate on SLA Breach" mean?',
          answer: 'When enabled, tickets that exceed the SLA threshold will automatically escalate to the next tier for faster resolution.'
        }
      ]
    },
    {
      id: 'auto_assign',
      title: 'Auto-Assignment Configuration',
      icon: Settings,
      content: [
        {
          question: 'What assignment strategies are available?',
          answer: 'Round Robin: Equal distribution. Load Balancing: Based on current workload. Skill-Based: Matches ticket requirements to agent skills.'
        },
        {
          question: 'What is "skill matching weight"?',
          answer: 'Controls the priority: higher = prioritize skill matching (quality), lower = prioritize availability (speed). Range is 0-1 (0%-100%).'
        },
        {
          question: 'How do auto-escalation rules work?',
          answer: 'Tickets auto-escalate if: (1) time threshold is exceeded without response, or (2) ticket has been reassigned more than the threshold number of times.'
        }
      ]
    },
    {
      id: 'escalations',
      title: 'Escalation Management',
      icon: BarChart3,
      content: [
        {
          question: 'What statuses can an escalation have?',
          answer: 'Pending: Awaiting review. Reviewed: Reviewed but not resolved. Resolved: Issue fixed. Rejected: Not escalated (returned to L1/L2).'
        },
        {
          question: 'How do I handle an escalation?',
          answer: 'Go to Escalation Queue, review the ticket details, add review notes, select an action (Review, Resolve, or Reject), and click Update Status.'
        },
        {
          question: 'What does "Review" vs "Resolve" mean?',
          answer: 'Review: Acknowledge and assign for further work. Resolve: Mark as fixed and closed. Reject: Send back to L1/L2 for additional work.'
        }
      ]
    },
    {
      id: 'reporting',
      title: 'Analytics & Reporting',
      icon: BarChart3,
      content: [
        {
          question: 'What data is included in reports?',
          answer: 'Reports show: team metrics, performance trends, escalation analysis, customer satisfaction, SLA compliance, and performance by agent.'
        },
        {
          question: 'How do I interpret the trends?',
          answer: 'Upward trend (↑) = improving, Downward (↓) = declining, Flat (→) = stable. Compare month-over-month or quarter-over-quarter.'
        },
        {
          question: 'Can I export reports?',
          answer: 'Yes, use the Export button in the Reports section to download data as CSV or PDF for sharing with stakeholders.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertCircle,
      content: [
        {
          question: 'Tickets aren\'t auto-assigning',
          answer: 'Check: (1) Auto-assign is enabled in config. (2) Agents are marked as available. (3) Agents have max tickets available. (4) Skill requirements are met (if skill-based).'
        },
        {
          question: 'SLA keeps getting breached',
          answer: 'Possible causes: (1) Unrealistic SLA targets. (2) Insufficient team capacity. (3) Skill mismatches causing wrong assignments. Review and adjust SLA config or team capacity.'
        },
        {
          question: 'Team member not receiving assigned tickets',
          answer: 'Check: (1) Member status is "Active". (2) Max tickets > current assigned. (3) Member availability is within working hours. (4) Auto-assign is enabled.'
        },
        {
          question: 'How do I contact support for L3 issues?',
          answer: 'For critical issues or feature requests, email support@examify.com with "L3 Support" in the subject line. Response time: 1-2 hours.'
        }
      ]
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">L3 Help & Documentation</h1>
        <p className="text-white/70">Guides, FAQs, and troubleshooting for L3 leadership features</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-white/40" size={20} />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* FAQ Sections */}
      <div className="space-y-4">
        {filteredSections.map(section => {
          const Icon = section.icon
          const isExpanded = expandedSections[section.id]

          return (
            <div key={section.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-purple-400" size={24} />
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                </div>
                <ChevronDown
                  size={24}
                  className={`text-white/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="border-t border-white/10 px-6 py-4 space-y-4">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="font-medium text-white">{item.question}</p>
                      <p className="text-white/70 text-sm leading-relaxed">{item.answer}</p>
                      {idx < section.content.length - 1 && (
                        <div className="h-px bg-white/5 my-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* No Results */}
      {filteredSections.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <Search size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/70">No documentation found for "{searchTerm}"</p>
        </div>
      )}

      {/* Support Contact */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
          <Lock size={20} />
          Still need help?
        </h3>
        <p className="text-purple-300/80 mb-4">
          For issues not covered in this documentation, please reach out to the support team.
        </p>
        <div className="space-y-2 text-sm text-purple-300">
          <p>📧 <strong>Email:</strong> l3-support@examify.com</p>
          <p>⏰ <strong>Response Time:</strong> Within 1 hour during business hours</p>
          <p>🐛 <strong>Report Bug:</strong> Use the "Report Issue" feature in the main menu</p>
          <p>💡 <strong>Suggest Feature:</strong> Email your feature requests to support@examify.com</p>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
            <BookOpen size={20} />
            Keyboard Shortcuts
          </h3>
          <div className="space-y-2 text-sm text-white/70">
            <p><kbd className="bg-white/10 px-2 py-1 rounded">Ctrl+K</kbd> - Search</p>
            <p><kbd className="bg-white/10 px-2 py-1 rounded">Ctrl+/</kbd> - Help</p>
            <p><kbd className="bg-white/10 px-2 py-1 rounded">Esc</kbd> - Close modal</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>✓ Review escalations daily</li>
            <li>✓ Monitor SLA compliance metrics</li>
            <li>✓ Adjust team capacity seasonally</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
