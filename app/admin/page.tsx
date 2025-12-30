'use client'

import { useEffect, useState } from 'react'
import { getTournament, createOrUpdateTournament } from '@/lib/api'
import { Tournament } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AdminPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: 'PAPI FÚTBOL ROLÓN',
    edition: '',
    year: new Date().getFullYear(),
    points_win: 3,
    points_draw: 1,
    points_loss: 0,
  })

  useEffect(() => {
    loadTournament()
  }, [])

  async function loadTournament() {
    setLoading(true)
    const data = await getTournament()
    if (data) {
      setTournament(data)
      setFormData({
        name: data.name,
        edition: data.edition || '',
        year: data.year || new Date().getFullYear(),
        points_win: data.points_win,
        points_draw: data.points_draw,
        points_loss: data.points_loss,
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const updated = await createOrUpdateTournament(formData)
    if (updated) {
      setTournament(updated)
      alert('Configuración guardada exitosamente')
    } else {
      alert('Error al guardar la configuración')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Torneo</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Nombre del Torneo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Edición (opcional)"
            value={formData.edition}
            onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            placeholder="Ej: 2024"
          />
          <Input
            label="Año"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Puntos por Victoria"
              type="number"
              value={formData.points_win}
              onChange={(e) => setFormData({ ...formData, points_win: parseInt(e.target.value) || 3 })}
            />
            <Input
              label="Puntos por Empate"
              type="number"
              value={formData.points_draw}
              onChange={(e) => setFormData({ ...formData, points_draw: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Puntos por Derrota"
              type="number"
              value={formData.points_loss}
              onChange={(e) => setFormData({ ...formData, points_loss: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

