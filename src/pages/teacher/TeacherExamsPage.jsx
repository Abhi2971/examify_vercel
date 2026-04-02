import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, Badge, Button } from '../../components/ui'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { mockApi } from '../../lib/mockApi'

const statusColors = { draft: 'warning', published: 'success', ongoing: 'primary', completed: 'info', archived: 'default' }

export function TeacherExamsPage() {
  const [exams, setExams] = useState([])

  useEffect(() => {
    mockApi.getExams().then(setExams)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Exams</h1>
        <Link to="/teacher/exams/create">
          <Button><Plus size={18} className="mr-2" /> Create Exam</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {exams.map(exam => (
          <Card key={exam.id}>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{exam.title}</h3>
                  <p className="text-gray-500 text-sm">{exam.subject} • Created by {exam.created_by}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusColors[exam.status]}>{exam.status}</Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Eye size={16} /></Button>
                    <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                    <Button variant="ghost" size="sm"><Trash2 size={16} /></Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
