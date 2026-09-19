import { createClient } from './supabase-client'

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    employeeId: row.employee_id,
    priority: row.priority ?? 'sedang',
    status: row.status ?? 'menunggu',
    category: row.category ?? '',
    createdAt: row.created_at ? row.created_at.slice(0, 10) : '',
    dueDate: row.due_date ?? '',
    progress: row.progress ?? 0,
    result: row.result,
  }
}

function knowledgeToUi(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.file_type ?? 'Dokumen',
    category: row.category ?? 'Umum',
    size: '',
    updatedAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    relatedTo: 'AI Karyawan',
    description: row.content_summary ?? '',
  }
}

function historyToUi(row) {
  return {
    id: row.id,
    employeeId: row.employee_id ?? '',
    action: row.action,
    at: row.at
      ? new Date(row.at).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
  }
}

export async function fetchUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser()
  return user ?? null
}

export async function fetchTasks() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToTask)
}

export async function createTask({
  title,
  description,
  employeeId,
  priority,
  status = 'menunggu',
  category,
  dueDate = null,
  progress = 0,
  result = null,
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sesi tidak ditemukan.")
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      description,
      employee_id: employeeId,
      priority,
      status,
      category,
      due_date: dueDate,
      progress,
      result,
    })
    .select()
    .single()
  if (error) throw error
  return rowToTask(data)
}

export async function updateTask(id, patch) {
  const fields = {}
  if (patch.status !== undefined) fields.status = patch.status
  if (patch.progress !== undefined) fields.progress = patch.progress
  if (patch.result !== undefined) fields.result = patch.result
  if (patch.title !== undefined) fields.title = patch.title
  if (patch.description !== undefined) fields.description = patch.description
  if (patch.priority !== undefined) fields.priority = patch.priority
  if (patch.category !== undefined) fields.category = patch.category
  if (patch.dueDate !== undefined) fields.due_date = patch.dueDate
  const supabase = createClient()
  const { error } = await supabase.from('tasks').update(fields).eq('id', id)
  if (error) throw error
}

export async function fetchKnowledge() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(knowledgeToUi)
}

export async function addKnowledge({ name, fileType, category = 'Umum', fileUrl = null, contentSummary = '' }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sesi tidak ditemukan.")
  const { error } = await supabase.from('knowledge').insert({
    user_id: user.id,
    name,
    file_type: fileType,
    category,
    file_url: fileUrl,
    content_summary: contentSummary,
  })
  if (error) throw error
}

export async function removeKnowledge(id) {
  const supabase = createClient()
  const { error } = await supabase.from('knowledge').delete().eq('id', id)
  if (error) throw error
}

export async function fetchHistory() {
  const supabase = createClient()
  const { data, error } = await supabase.from('history').select('*').order('at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(historyToUi)
}

export async function addHistory({ employeeId, action }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sesi tidak ditemukan.")
  const { error } = await supabase.from('history').insert({
    user_id: user.id,
    employee_id: employeeId,
    action,
  })
  if (error) throw error
}