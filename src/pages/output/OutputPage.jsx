import { useState } from "react"
import { FolderOpen, Hammer, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"

import logo from "/logo.png"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useTwineStore } from "../../store/useTwineStore"
import HeaderBar from "../../components/HeaderBar/HeaderBar"
import OutputViewer from "../../components/OutputViewer/OutputViewer"

export default function OutputPage() {
  const twine = useTwineStore((s) => s.twine)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800">
      {/* ---------------- Header ---------------- */}
      <HeaderBar />

      {/* ---------------- Top Toolbar ---------------- */}
      <div className="px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/project")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Button>
      </div>

      {/* ---------------- Output Viewer ---------------- */}
      <OutputViewer />
    </div>
  )
}