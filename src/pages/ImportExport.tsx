
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, CheckCircle, FileText, X } from "lucide-react";
import { fixers } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Fixer } from "@/types";

const ImportExport: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<any[] | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  
  const handleExport = () => {
    // Convert data to CSV
    const headers = [
      "id",
      "first_name",
      "last_name",
      "phone",
      "email",
      "province_id",
      "status_id",
      "skills",
      "hire_date",
      "notes",
    ];
    
    const rows = fixers.map((fixer) => {
      return [
        fixer.id,
        fixer.first_name,
        fixer.last_name,
        fixer.phone,
        fixer.email || "",
        fixer.province_id,
        fixer.status_id,
        fixer.skills.join("|"),
        fixer.hire_date,
        fixer.notes || "",
      ];
    });
    
    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `24carfix_fixers_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Exported ${fixers.length} fixers to CSV.`,
    });
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleFileSelect = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a CSV file.",
      });
      return;
    }
    
    setSelectedFile(file);
    parseCSV(file);
  };
  
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((header) => header.replace(/"/g, "").trim());
      
      // Validate required headers
      const requiredHeaders = ["first_name", "last_name", "phone", "province_id", "status_id"];
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        setImportErrors([`Missing required headers: ${missingHeaders.join(", ")}`]);
        toast({
          variant: "destructive",
          title: "Invalid CSV format",
          description: `Missing required headers: ${missingHeaders.join(", ")}`,
        });
        return;
      }
      
      // Parse data rows
      const parsedData = [];
      const errors = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(",").map((value) => value.replace(/"/g, "").trim());
        
        if (values.length !== headers.length) {
          errors.push(`Line ${i + 1}: Column count mismatch`);
          continue;
        }
        
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        
        // Validate required fields
        const missingFields = requiredHeaders.filter((field) => !row[field]);
        if (missingFields.length > 0) {
          errors.push(`Line ${i + 1}: Missing required fields: ${missingFields.join(", ")}`);
          continue;
        }
        
        // Convert skills from string to array
        if (row.skills) {
          row.skills = row.skills.split("|").filter(Boolean);
        } else {
          row.skills = [];
        }
        
        parsedData.push(row);
      }
      
      if (errors.length > 0) {
        setImportErrors(errors);
        toast({
          variant: "destructive",
          title: "Import errors detected",
          description: `${errors.length} rows have validation errors.`,
        });
      } else {
        setImportErrors([]);
      }
      
      setImportedData(parsedData);
    };
    
    reader.readAsText(file);
  };
  
  const handleImport = () => {
    if (!importedData) return;
    
    toast({
      title: "Import Successful",
      description: `Imported ${importedData.length} fixers.`,
    });
    
    // Reset state after successful import
    setSelectedFile(null);
    setImportedData(null);
  };
  
  const handleCancel = () => {
    setSelectedFile(null);
    setImportedData(null);
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Import/Export</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Export Fixers
            </CardTitle>
            <CardDescription>
              Export your fixers data as a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to export all fixers data to a CSV file. The export includes all
              fixers with their details.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </CardContent>
        </Card>
        
        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Import Fixers
            </CardTitle>
            <CardDescription>
              Import fixer data from a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with fixer data. The file should include columns for first_name,
                  last_name, phone, province_id, status_id, and other optional fields.
                </p>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept=".csv"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Only CSV files are supported
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-muted p-3 rounded-md">
                  <FileText size={32} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {importedData ? `${importedData.length} records` : "Parsing..."}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="shrink-0"
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                {importErrors.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p className="text-sm font-medium text-destructive mb-2">
                      {importErrors.length} errors found:
                    </p>
                    <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {importErrors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-destructive">
                          {error}
                        </li>
                      ))}
                      {importErrors.length > 5 && (
                        <li className="text-destructive">
                          ...and {importErrors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={!importedData || importErrors.length > 0 || !hasPermission("admin")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {hasPermission("admin") ? "Import Data" : "Import (Admin Only)"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportExport;
