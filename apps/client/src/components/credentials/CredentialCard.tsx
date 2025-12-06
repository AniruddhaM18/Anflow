import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Copy, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import type { Credentials } from "../../pages/Home"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import telegram from "../../assets/telegramIcon.png"
import resend from "../../assets/resendIcon.svg"

const logos = {
    telegram : telegram,
    resend : resend,
   
}

interface CredentialsCardProps {
  credentials: Credentials[]
  onEdit?: (credential: Credentials) => void
  onDelete?: (credentialId: string) => void
  onSave?: (updated: Credentials) => void
}

export function CredentialsCards({ credentials, onEdit, onDelete, onSave }: CredentialsCardProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [editingById, setEditingById] = useState<Record<string, boolean>>({})
  const [editedValuesById, setEditedValuesById] = useState<Record<string, Record<string, string>>>({})

  const toggleKeyVisibility = (credentialId: string, keyType: string) => {
    const key = `${credentialId}-${keyType}`
    setVisibleKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskValue = (value: string) => {
    if (value.length <= 8) return "•".repeat(value.length)
    return value.substring(0, 4) + "•".repeat(value.length - 8) + value.substring(value.length - 4)
  }

  const handleStartEdit = (credential: Credentials) => {
    setEditingById((prev) => ({ ...prev, [credential.id]: true }))
    setEditedValuesById((prev) => ({
      ...prev,
      [credential.id]: { ...(credential.data as Record<string, string>) },
    }))
    onEdit?.(credential)
  }

  const handleFieldChange = (credentialId: string, key: string, value: string) => {
    setEditedValuesById((prev) => ({
      ...prev,
      [credentialId]: {
        ...(prev[credentialId] || {}),
        [key]: value,
      },
    }))
  }

  const handleSave = (credential: Credentials) => {
    const updated: Credentials = {
      ...credential,
      data: {
        ...(credential.data as Record<string, string>),
        ...(editedValuesById[credential.id] || {}),
      },
      // updated_at: new Date().toISOString() as unknown as string,
    }
    setEditingById((prev) => ({ ...prev, [credential.id]: false }))
    setEditedValuesById((prev) => ({ ...prev, [credential.id]: updated.data as Record<string, string> }))
    onSave?.(updated)
  }

  const renderCredentialData = (credential: Credentials) => {
    const { data } = credential
    const entries = Object.entries(data).filter(([_, value]) => value)

    if (entries.length === 0) {
      return <p className="text-muted-foreground text-sm">No credential data available</p>
    }

    const isEditing = !!editingById[credential.id]

    return (
      <div className="space-y-3">
        {entries.map(([key, originalValue]) => {
          const isVisible = !!visibleKeys[`${credential.id}-${key}`]
          const currentValue = (editedValuesById[credential.id]?.[key] ?? (originalValue as string)) as string
          const displayValue = isVisible || isEditing ? currentValue : maskValue(currentValue)
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize font-inter">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <Badge variant="outline" className="text-xs font-inter">
                    {key === "apikey" ? "API Key" : key === "accessToken" ? "Access Token" : "Business ID"}
                  </Badge>
                </div>
                <Input
                  value={displayValue}
                  onChange={(e) => handleFieldChange(credential.id, key, e.target.value)}
                  disabled={!isEditing}
                  type="text"
                  className="font-mono"
                />
              </div>
              <div className="flex items-center gap-1 ml-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleKeyVisibility(credential.id, key)}
                  className="h-8 w-8 p-0"
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(currentValue)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if(credentials.length === 0){
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <div className="font-kode font-bold text-xl">No Credentials Yet! Create Credentials Now!</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {credentials.map((credential) => (
        <Card key={credential.id} className="w-full">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-4">
                    <img src={logos[credential.application as keyof typeof logos]} height={40} width={40}/>
                    <div>
                  <h3 className="font-semibold text-lg font-kode">{credential.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="font-inter">{credential.application}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Last Updated {new Date(credential.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingById[credential.id] ? (
                  <Button variant="default" size="sm" onClick={() => handleSave(credential)} className="h-8">
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleStartEdit(credential)} className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(credential.id)}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={credential.id} className="border-none">
                <AccordionTrigger className="hover:no-underline py-1">
                  <span className="text-sm font-kode font-extrabold text-orange-500">View Credentials</span>
                </AccordionTrigger>
                <AccordionContent className="pt-0.5">{renderCredentialData(credential)}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}