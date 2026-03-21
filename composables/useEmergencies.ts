// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string
  text: string
  subtext?: string
}

export interface EmergencySection {
  title: string
  items: ChecklistItem[]
}

export interface EmergencyType {
  id: string
  name: string
  lightColor: string
  lightBorder: string
  lightAccent: string
  darkColor: string
  darkBorder: string
  darkAccent: string
  icon: string
  sections: EmergencySection[]
}

export interface LogEntry {
  timestamp: Date
  action: string
  detail?: string
}

export interface SessionState {
  emergencyId: string | null
  startedAt: Date | null
  checkedItems: Set<string>
  notes: string
  patientMRN: string
  patientName: string
  staffNames: string
  log: LogEntry[]
}

// ─── Emergency data ───────────────────────────────────────────────────────────

export const EMERGENCIES: EmergencyType[] = [
  {
    id: 'coronary-perforation',
    name: 'Coronary Perforation',
    lightColor: 'bg-red-50',
    lightBorder: 'border-red-300',
    lightAccent: 'text-red-700',
    darkColor: 'bg-red-950/60',
    darkBorder: 'border-red-700/60',
    darkAccent: 'text-red-400',
    icon: '⚠️',
    sections: [
      {
        title: 'Immediate Actions',
        items: [
          { id: 'cp-1', text: 'Recognize perforation — contrast extravasation on cine' },
          { id: 'cp-2', text: 'Call for HELP — announce the emergency to the room' },
          { id: 'cp-3', text: 'Reverse anticoagulation — Protamine for heparin (1mg per 100U)' },
          { id: 'cp-4', text: 'Balloon inflation — inflate at perforation site to tamponade' },
          { id: 'cp-5', text: 'Stop GPIIb/IIIa inhibitor infusion if running' },
          { id: 'cp-6', text: 'Maintain wire position across perforation site' },
        ],
      },
      {
        title: 'Hemodynamic Management',
        items: [
          { id: 'cp-7', text: 'IV fluid bolus — 500–1000 mL NS wide open if hypotensive' },
          { id: 'cp-8', text: 'Vasopressors — Norepinephrine or Dopamine if needed' },
          { id: 'cp-9', text: 'Bedside echo — assess for pericardial effusion / tamponade' },
          { id: 'cp-10', text: 'Continuous blood pressure monitoring (arterial line or frequent cuff)' },
        ],
      },
      {
        title: 'Definitive Treatment',
        items: [
          { id: 'cp-11', text: 'Covered stent — order stat (e.g. GRAFTMASTER / PK Papyrus)' },
          { id: 'cp-12', text: 'Pericardiocentesis — if tamponade develops'},
          { id: 'cp-13', text: 'Balloon re-inflation while awaiting covered stent' },
          { id: 'cp-14', text: 'CT surgery notification — early if tamponade or large perforation' },
          { id: 'cp-15', text: 'Consider emergent CABG if not controllable percutaneously' },
        ],
      },
      {
        title: 'Team / Resources',
        items: [
          { id: 'cp-16', text: 'Activate cardiac surgery emergency if available' },
          { id: 'cp-17', text: 'Consider IABP or mechanical circulatory support (Impella) if shock' },
          { id: 'cp-18', text: 'ICU bed notification' },
          { id: 'cp-19', text: 'Blood bank — order 2 units pRBC, FFP, PLTs; hold for cross-match' },
          { id: 'cp-20', text: 'Document timing of events and interventions in real time' },
        ],
      },
    ],
  },
  {
    id: 'shock',
    name: 'Cardiogenic Shock',
    lightColor: 'bg-amber-50',
    lightBorder: 'border-amber-300',
    lightAccent: 'text-amber-700',
    darkColor: 'bg-amber-950/60',
    darkBorder: 'border-amber-700/60',
    darkAccent: 'text-amber-400',
    icon: '⚡',
    sections: [
      {
        title: 'Recognition & Immediate Actions',
        items: [
          { id: 'sh-1', text: 'Confirm shock — SBP <90 mmHg or MAP <65 mmHg >30 min' },
          { id: 'sh-2', text: 'Call for HELP — announce to the room, activate shock protocol' },
          { id: 'sh-3', text: 'IV access — large-bore (×2), draw labs (CBC, CMP, troponin, BNP, lactate)' },
          { id: 'sh-4', text: '12-lead ECG — identify STEMI / ischemia requiring emergent revascularization' },
          { id: 'sh-5', text: 'Bedside echo — assess LV/RV function, effusion, valvular cause' },
        ],
      },
      {
        title: 'Hemodynamic Support',
        items: [
          { id: 'sh-6', text: 'Vasopressors — Norepinephrine 0.1–0.3 mcg/kg/min (first-line)' },
          { id: 'sh-7', text: 'Inotrope — Dobutamine 2.5–10 mcg/kg/min if low CO/CI' },
          { id: 'sh-8', text: 'Judicious fluids — 250 mL bolus, reassess; avoid volume overload' },
          { id: 'sh-9', text: 'Foley catheter — monitor urine output (goal >0.5 mL/kg/hr)' },
          { id: 'sh-10', text: 'Continuous arterial line monitoring' },
        ],
      },
      {
        title: 'Mechanical Circulatory Support',
        items: [
          { id: 'sh-11', text: 'IABP — consider for hemodynamic stabilization pre-PCI' },
          { id: 'sh-12', text: 'Impella CP / 5.0 — consider for severe CS (CI <2.2, refractory)' },
          { id: 'sh-13', text: 'ECMO — consider for refractory shock / cardiac arrest' },
          { id: 'sh-14', text: 'Right-heart catheterization — hemodynamic guidance (Swan-Ganz)' },
        ],
      },
      {
        title: 'Revascularization & Escalation',
        items: [
          { id: 'sh-15', text: 'Emergent PCI — target culprit vessel; avoid multi-vessel PCI acutely' },
          { id: 'sh-16', text: 'CT surgery notification — if surgical candidate or mechanical complication' },
          { id: 'sh-17', text: 'Correct reversible causes — arrhythmia, tamponade, tension pneumo' },
          { id: 'sh-18', text: 'Intubation — if respiratory failure or reduced consciousness' },
          { id: 'sh-19', text: 'ICU transfer — CICU or CCU bed, notify team now' },
          { id: 'sh-20', text: 'Shock team activation — heart failure/CICU attending, perfusion, pharmacy' },
        ],
      },
    ],
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export function formatLogForExport(session: SessionState, emergency: EmergencyType | undefined): string {
  const lines: string[] = []
  const now = new Date()
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('         CATH LAB EMERGENCY — EVENT LOG')
  lines.push('═══════════════════════════════════════════════════════')
  lines.push(`Emergency Type: ${emergency?.name ?? 'Unknown'}`)
  lines.push(`Started:        ${session.startedAt ? session.startedAt.toLocaleString() : '—'}`)
  lines.push(`Exported:       ${now.toLocaleString()}`)
  if (session.startedAt) {
    lines.push(`Duration:       ${formatDuration(now.getTime() - session.startedAt.getTime())}`)
  }
  lines.push('')
  lines.push('PATIENT INFORMATION')
  lines.push('───────────────────')
  lines.push(`Name: ${session.patientName || '(not entered)'}`)
  lines.push(`MRN:  ${session.patientMRN || '(not entered)'}`)
  lines.push('')
  lines.push('STAFF')
  lines.push('─────')
  lines.push(session.staffNames || '(not entered)')
  lines.push('')
  lines.push('CHECKLIST COMPLETION')
  lines.push('────────────────────')
  if (emergency) {
    for (const section of emergency.sections) {
      lines.push(`\n${section.title}`)
      for (const item of section.items) {
        const checked = session.checkedItems.has(item.id)
        lines.push(`  [${checked ? '✓' : ' '}] ${item.text}`)
      }
    }
  }
  const totalItems = emergency?.sections.flatMap(s => s.items).length ?? 0
  lines.push(`\nCompleted: ${session.checkedItems.size} / ${totalItems} items`)
  lines.push('')
  lines.push('EVENT LOG')
  lines.push('─────────')
  for (const entry of session.log) {
    lines.push(`${formatTimestamp(entry.timestamp)}  ${entry.action}${entry.detail ? ` — ${entry.detail}` : ''}`)
  }
  lines.push('')
  lines.push('NOTES')
  lines.push('─────')
  lines.push(session.notes || '(no notes)')
  lines.push('\n═══════════════════════════════════════════════════════')
  return lines.join('\n')
}
