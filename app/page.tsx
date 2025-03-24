"use client"

import { Check, ChevronDown, Download, FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Types for our water tank data
type ProgressStage =
  | "Formwork Removal"
  | "Repair and Cleaning"
  | "Pump Anchors"
  | "Slope"
  | "Inspection Stage 1"
  | "Waterproofing"
  | "Inspection Stage 2"

type ProgressStatus = "Not Started" | "In Progress" | "Completed"

type StageProgress = {
  stage: ProgressStage
  status: ProgressStatus
}

type TankType = "SEWAGE WATER" | "RAIN WATER" | "CHILLER ROOM"

type WaterTank = {
  id: string
  name: string
  location: string
  currentStage: ProgressStage
  progress: StageProgress[]
  coordinates: {
    top: number
    left: number
    width: number
    height: number
  }
  type: TankType
}

// Define all possible progress stages in order
const allProgressStages: ProgressStage[] = [
  "Formwork Removal",
  "Repair and Cleaning",
  "Pump Anchors",
  "Slope",
  "Inspection Stage 1",
  "Waterproofing",
  "Inspection Stage 2",
]

// Sample data for N00 level tanks
const initialN00Tanks: WaterTank[] = [
  {
    id: "N00-WT-01",
    name: "Water Tank 01",
    location: "N00",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 250,
      left: 300,
      width: 20,
      height: 20,
    },
    type: "SEWAGE WATER",
  },
  {
    id: "N00-WT-02",
    name: "Water Tank 02",
    location: "N00",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 380,
      left: 420,
      width: 20,
      height: 20,
    },
    type: "RAIN WATER",
  },
  {
    id: "N00-WT-03",
    name: "Water Tank 03",
    location: "N00",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 480,
      left: 600,
      width: 20,
      height: 20,
    },
    type: "CHILLER ROOM",
  },
]

// Sample data for N10 level tanks
const initialN10Tanks: WaterTank[] = [
  {
    id: "N10-WT-01",
    name: "Water Tank 01",
    location: "N10",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 220,
      left: 350,
      width: 20,
      height: 20,
    },
    type: "SEWAGE WATER",
  },
  {
    id: "N10-WT-02",
    name: "Water Tank 02",
    location: "N10",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 320,
      left: 420,
      width: 20,
      height: 20,
    },
    type: "RAIN WATER",
  },
]

// Sample data for N20 level tanks
const initialN20Tanks: WaterTank[] = [
  {
    id: "N20-WT-01",
    name: "Water Tank 01",
    location: "N20",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 280,
      left: 350,
      width: 20,
      height: 20,
    },
    type: "SEWAGE WATER",
  },
  {
    id: "N20-WT-02",
    name: "Water Tank 02",
    location: "N20",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 400,
      left: 520,
      width: 20,
      height: 20,
    },
    type: "CHILLER ROOM",
  },
]

// Sample data for N30 level tanks
const initialN30Tanks: WaterTank[] = [
  {
    id: "N30-WT-01",
    name: "Water Tank 01",
    location: "N30",
    currentStage: "Formwork Removal",
    progress: allProgressStages.map((stage) => ({
      stage,
      status: stage === "Formwork Removal" ? "In Progress" : "Not Started",
    })),
    coordinates: {
      top: 250,
      left: 350,
      width: 20,
      height: 20,
    },
    type: "RAIN WATER",
  },
]

export default function ConstructionTracker() {
  // State for tank data at different levels
  const [n00Tanks, setN00Tanks] = useState<WaterTank[]>(initialN00Tanks)
  const [n10Tanks, setN10Tanks] = useState<WaterTank[]>(initialN10Tanks)
  const [n20Tanks, setN20Tanks] = useState<WaterTank[]>(initialN20Tanks)
  const [n30Tanks, setN30Tanks] = useState<WaterTank[]>(initialN30Tanks)

  // State for current level
  const [currentLevel, setCurrentLevel] = useState<string>("N00")

  // State for dialog visibility and selected tank
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [selectedTankId, setSelectedTankId] = useState<string | null>(null)
  const [undoConfirmOpen, setUndoConfirmOpen] = useState<boolean>(false)
  const [stageToUndo, setStageToUndo] = useState<ProgressStage | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false)

  // Get the color for a tank based on its progress status
  const getTankColor = (tank: WaterTank) => {
    // Check if all tasks are completed
    const allCompleted = tank.progress.every((p) => p.status === "Completed")
    if (allCompleted) {
      return "bg-green-600"
    }

    // Check if currently in inspection stage
    if (
      tank.currentStage === "Inspection Stage 1" ||
      tank.currentStage === "Inspection Stage 2"
    ) {
      return "bg-purple-600"
    }

    // Default color for in-progress tanks
    return "bg-red-600"
  }

  // Handle export to spreadsheet (HTML table for printing)
  const handleExportToSpreadsheet = () => {
    setExportDialogOpen(true)
  }

  // Download spreadsheet data as CSV
  const downloadSpreadsheet = () => {
    const csvContent = generateCsvContent()
    downloadCsvFile(csvContent)
    setExportDialogOpen(false)
  }

  // Open print window with formatted HTML table
  const openPrintView = () => {
    const allTanks = getAllTanks()
    
    // Create a new window
    const printWindow = window.open('', '_blank')
    
    if (printWindow) {
      // HTML content for the print view
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Water Tanks Progress</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .completed { background-color: #d4edda; }
              .in-progress { background-color: #fff3cd; }
              @media print {
                button { display: none; }
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1>Camp Nou Waterproofing Progress</h1>
              <button onclick="window.print();" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Current Stage</th>
                  ${allProgressStages.map(stage => `<th>${stage}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${allTanks.map(tank => `
                  <tr>
                    <td>${tank.id}</td>
                    <td>${tank.name}</td>
                    <td>${tank.location}</td>
                    <td>${tank.type}</td>
                    <td>${tank.currentStage}</td>
                    ${tank.progress.map(p => {
                      let className = '';
                      if (p.status === 'Completed') className = 'completed';
                      else if (p.status === 'In Progress') className = 'in-progress';
                      return `<td class="${className}">${p.status}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `)
      
      printWindow.document.close()
    }
    
    setExportDialogOpen(false)
  }

  // Generate CSV content
  const generateCsvContent = () => {
    const allTanks = getAllTanks()
    
    // CSV header
    let csv = ["ID,Name,Location,Type,Current Stage," + allProgressStages.join(",")].join("\n")
    
    // CSV data rows
    allTanks.forEach(tank => {
      const row = [
        tank.id,
        tank.name,
        tank.location,
        tank.type,
        tank.currentStage,
        ...tank.progress.map(p => p.status)
      ]
      
      // Add the row to the CSV
      csv += "\n" + row.join(",")
    })
    
    return csv
  }

  // Download CSV file
  const downloadCsvFile = (csvContent: string) => {
    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    // Create a download link
    const link = document.createElement('a')
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob)
    
    // Set the link properties
    link.setAttribute('href', url)
    link.setAttribute('download', 'water_tanks_progress.csv')
    link.style.visibility = 'hidden'
    
    // Add the link to the document
    document.body.appendChild(link)
    
    // Click the link to trigger the download
    link.click()
    
    // Clean up
    document.body.removeChild(link)
  }

  // Get all tanks ready for inspection
  const getTanksReadyForInspection = () => {
    const allTanks = getAllTanks()
    
    // Find tanks that are currently in an inspection stage
    return allTanks.filter(tank => 
      tank.currentStage === "Inspection Stage 1" || 
      tank.currentStage === "Inspection Stage 2"
    )
  }

  // Handle tank click to open dialog
  const handleTankClick = (tankId: string) => {
    setSelectedTankId(tankId)
    setIsDialogOpen(true)
  }

  // Get selected tank data
  const getSelectedTank = (): WaterTank | null => {
    if (!selectedTankId) return null
    
    return getAllTanks().find(tank => tank.id === selectedTankId) || null
  }

  // Toggle task completion status
  const toggleTaskCompletion = (stage: ProgressStage) => {
    const selectedTank = getSelectedTank()
    if (!selectedTank) return
    
    // Find the progress item for the selected stage
    const progressItem = selectedTank.progress.find(p => p.stage === stage)
    if (!progressItem) return
    
    // If the task is already completed, prompt for undo
    if (progressItem.status === "Completed") {
      setStageToUndo(stage)
      setUndoConfirmOpen(true)
      return
    }
    
    // Otherwise, mark the task as completed
    markTaskAsCompleted(stage)
  }

  // Mark a task as completed and update the next task
  const markTaskAsCompleted = (stage: ProgressStage) => {
    const selectedTank = getSelectedTank()
    if (!selectedTank) return
    
    // Create a copy of the tank to modify
    const updatedTank = { ...selectedTank }
    
    // Update progress status for the completed stage
    updatedTank.progress = updatedTank.progress.map((p: StageProgress) => {
      if (p.stage === stage) {
        return { ...p, status: "Completed" as ProgressStatus }
      }
      return p
    })
    
    // Get the index of the completed stage
    const completedStageIndex = allProgressStages.findIndex(s => s === stage)
    
    // If there's a next stage, update it to "In Progress"
    if (completedStageIndex < allProgressStages.length - 1) {
      const nextStage = allProgressStages[completedStageIndex + 1]
      
      // Update the next stage to "In Progress"
      updatedTank.progress = updatedTank.progress.map((p: StageProgress) => {
        if (p.stage === nextStage) {
          return { ...p, status: "In Progress" as ProgressStatus }
        }
        return p
      })
      
      // Update the current stage to the next stage
      updatedTank.currentStage = nextStage
    }
    
    // Update tank data
    updateTankData(updatedTank)
  }

  // Undo a task (revert to In Progress and reset subsequent tasks)
  const undoTask = () => {
    if (!stageToUndo) return
    
    const selectedTank = getSelectedTank()
    if (!selectedTank) return
    
    // Create a copy of the tank to modify
    const updatedTank = { ...selectedTank }
    
    // Get the index of the stage to undo
    const stageIndex = allProgressStages.findIndex(s => s === stageToUndo)
    
    // Update progress status for all stages
    updatedTank.progress = updatedTank.progress.map((p: StageProgress, index: number) => {
      const progressStageIndex = allProgressStages.findIndex(s => s === p.stage)
      
      if (progressStageIndex === stageIndex) {
        // Set the undone stage to "In Progress"
        return { ...p, status: "In Progress" as ProgressStatus }
      } else if (progressStageIndex > stageIndex) {
        // Reset all subsequent stages to "Not Started"
        return { ...p, status: "Not Started" as ProgressStatus }
      }
      
      // Leave previous stages unchanged
      return p
    })
    
    // Update the current stage to the undone stage
    updatedTank.currentStage = stageToUndo
    
    // Update tank data
    updateTankData(updatedTank)
    
    // Close the confirmation dialog
    setUndoConfirmOpen(false)
    setStageToUndo(null)
  }

  // Update tank data in the appropriate level's state
  const updateTankData = (updatedTank: WaterTank) => {
    const location = updatedTank.location
    
    // Update the appropriate state based on location
    switch (location) {
      case "N00":
        setN00Tanks((tanks: WaterTank[]) => 
          tanks.map((tank: WaterTank) => 
            tank.id === updatedTank.id ? updatedTank : tank
          )
        )
        break
      case "N10":
        setN10Tanks((tanks: WaterTank[]) => 
          tanks.map((tank: WaterTank) => 
            tank.id === updatedTank.id ? updatedTank : tank
          )
        )
        break
      case "N20":
        setN20Tanks((tanks: WaterTank[]) => 
          tanks.map((tank: WaterTank) => 
            tank.id === updatedTank.id ? updatedTank : tank
          )
        )
        break
      case "N30":
        setN30Tanks((tanks: WaterTank[]) => 
          tanks.map((tank: WaterTank) => 
            tank.id === updatedTank.id ? updatedTank : tank
          )
        )
        break
    }
  }

  // Get all tanks from all levels
  const getAllTanks = () => {
    return [...n00Tanks, ...n10Tanks, ...n20Tanks, ...n30Tanks]
  }

  // Get current level tanks
  const getCurrentLevelTanks = () => {
    switch (currentLevel) {
      case "N00":
        return n00Tanks
      case "N10":
        return n10Tanks
      case "N20":
        return n20Tanks
      case "N30":
        return n30Tanks
      default:
        return []
    }
  }

  // Render the tanks on the blueprint
  const renderTanks = () => {
    const tanks = getCurrentLevelTanks()
    
    return tanks.map(tank => (
      <div
        key={tank.id}
        className={`absolute border border-black cursor-pointer ${getTankColor(tank)}`}
        style={{
          top: `${tank.coordinates.top}px`,
          left: `${tank.coordinates.left}px`,
          width: `${tank.coordinates.width}px`,
          height: `${tank.coordinates.height}px`,
        }}
        onClick={() => handleTankClick(tank.id)}
      >
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
          {tank.type}
        </div>
      </div>
    ))
  }

  // Get the current blueprint image based on level
  const getBlueprintImage = () => {
    switch (currentLevel) {
      case "N00":
        return "/images/N00-1.png"
      case "N10":
        return "/images/N10-1.png"
      case "N20":
        return "/images/N20-1.png"
      case "N30":
        return "/images/N30-1.png"
      default:
        return "/images/N00-1.png"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Camp Nou Construction Tracker</h1>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-1">
                  <span>Export</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportToSpreadsheet}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Export Table</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Level Selection */}
        <div className="mb-6">
          <Tabs 
            defaultValue="N00" 
            value={currentLevel}
            onValueChange={setCurrentLevel}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-[400px]">
              <TabsTrigger value="N00">N00</TabsTrigger>
              <TabsTrigger value="N10">N10</TabsTrigger>
              <TabsTrigger value="N20">N20</TabsTrigger>
              <TabsTrigger value="N30">N30</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Inspection Alert */}
        {getTanksReadyForInspection().length > 0 && (
          <Alert className="mb-6 bg-purple-100 border-purple-200">
            <AlertTitle className="text-purple-800">Tanks Ready for Inspection</AlertTitle>
            <AlertDescription className="text-purple-700">
              {getTanksReadyForInspection().length} tanks are ready for inspection. Check the purple markers on the blueprint.
            </AlertDescription>
          </Alert>
        )}

        {/* Blueprint Area */}
        <div className="relative bg-white rounded-lg shadow-md overflow-auto" style={{ height: "calc(100vh - 250px)" }}>
          <div className="relative">
            <Image 
              src={getBlueprintImage()} 
              alt={`${currentLevel} Blueprint`} 
              width={1200} 
              height={800} 
              className="min-w-full h-auto"
            />
            {renderTanks()}
          </div>
        </div>
      </main>

      {/* Tank Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {getSelectedTank()?.name} ({getSelectedTank()?.id})
            </DialogTitle>
            <DialogDescription>
              Location: {getSelectedTank()?.location} | Type: {getSelectedTank()?.type}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Progress Tracking</h3>
            <div className="space-y-3">
              {getSelectedTank()?.progress.map((progress, index) => (
                <div 
                  key={progress.stage}
                  className={`flex items-center justify-between p-2 rounded ${
                    progress.stage === getSelectedTank()?.currentStage ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded-full border flex items-center justify-center"
                      onClick={() => toggleTaskCompletion(progress.stage)}
                    >
                      {progress.status === "Completed" && (
                        <Check className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                    <span>{progress.stage}</span>
                    {progress.stage === getSelectedTank()?.currentStage && (
                      <span className="text-xs text-blue-600 font-medium">Current Task</span>
                    )}
                  </div>
                  <div className="text-sm">
                    {progress.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Undo Confirmation Dialog */}
      <AlertDialog open={undoConfirmOpen} onOpenChange={setUndoConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Undo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to undo the completion of "{stageToUndo}"? This will reset all subsequent tasks to "Not Started".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUndoConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={undoTask}>Yes, Undo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
            <DialogDescription>
              Choose a format to export the water tank progress data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 py-4">
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={openPrintView}
            >
              <div className="flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Export Print (HTML Table)</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-between items-center"
              onClick={downloadSpreadsheet}
            >
              <div className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                <span>Export Table (CSV)</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

