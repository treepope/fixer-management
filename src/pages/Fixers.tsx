
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Search, SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fixers, provinces, skills, statuses } from "@/data/mockData";
import { TableState, Fixer } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import FixerForm from "@/components/FixerForm";
import FixerDetails from "@/components/FixerDetails";

const Fixers = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Fixer state
  const [fixersList, setFixersList] = useState<Fixer[]>(fixers);
  const [selectedFixer, setSelectedFixer] = useState<Fixer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Table state
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sortColumn: "first_name",
    sortDirection: "asc",
    searchTerm: "",
    filters: {},
  });
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [provinceFilter, setProvinceFilter] = useState<string[]>([]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  
  // Filtered and paginated data
  const [filteredFixers, setFilteredFixers] = useState<Fixer[]>([]);
  const [paginatedFixers, setPaginatedFixers] = useState<Fixer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter and sort the fixers
  useEffect(() => {
    let result = [...fixersList];
    
    // Apply search term
    if (tableState.searchTerm) {
      const searchLower = tableState.searchTerm.toLowerCase();
      result = result.filter(
        (fixer) =>
          fixer.first_name.toLowerCase().includes(searchLower) ||
          fixer.last_name.toLowerCase().includes(searchLower) ||
          fixer.phone.includes(searchLower) ||
          (fixer.email && fixer.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((fixer) => statusFilter.includes(fixer.status_id));
    }
    
    // Apply province filter
    if (provinceFilter.length > 0) {
      result = result.filter((fixer) => provinceFilter.includes(fixer.province_id));
    }
    
    // Apply skill filter
    if (skillFilter.length > 0) {
      result = result.filter((fixer) => 
        skillFilter.some(skill => fixer.skills.includes(skill))
      );
    }
    
    // Apply sorting
    if (tableState.sortColumn && tableState.sortDirection) {
      result.sort((a, b) => {
        const aValue = a[tableState.sortColumn as keyof Fixer] as string;
        const bValue = b[tableState.sortColumn as keyof Fixer] as string;
        
        if (aValue < bValue) {
          return tableState.sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return tableState.sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredFixers(result);
    setTotalPages(Math.ceil(result.length / tableState.pageSize));
    
    // Reset to first page when filters change
    if (tableState.page > Math.ceil(result.length / tableState.pageSize)) {
      setTableState({ ...tableState, page: 1 });
    }
  }, [
    fixersList,
    tableState.searchTerm,
    tableState.sortColumn,
    tableState.sortDirection,
    statusFilter,
    provinceFilter,
    skillFilter,
  ]);
  
  // Handle pagination
  useEffect(() => {
    const start = (tableState.page - 1) * tableState.pageSize;
    const end = start + tableState.pageSize;
    setPaginatedFixers(filteredFixers.slice(start, end));
  }, [filteredFixers, tableState.page, tableState.pageSize]);
  
  const handleSort = (column: string) => {
    setTableState({
      ...tableState,
      sortColumn: column,
      sortDirection: 
        tableState.sortColumn === column && tableState.sortDirection === "asc"
          ? "desc"
          : "asc",
    });
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableState({ ...tableState, searchTerm: event.target.value, page: 1 });
  };
  
  const handlePageChange = (newPage: number) => {
    setTableState({ ...tableState, page: newPage });
  };
  
  const handleStatusFilterChange = (value: string) => {
    if (statusFilter.includes(value)) {
      setStatusFilter(statusFilter.filter(status => status !== value));
    } else {
      setStatusFilter([...statusFilter, value]);
    }
    setTableState({ ...tableState, page: 1 });
  };
  
  const handleProvinceFilterChange = (value: string) => {
    if (provinceFilter.includes(value)) {
      setProvinceFilter(provinceFilter.filter(province => province !== value));
    } else {
      setProvinceFilter([...provinceFilter, value]);
    }
    setTableState({ ...tableState, page: 1 });
  };
  
  const handleSkillFilterChange = (value: string) => {
    if (skillFilter.includes(value)) {
      setSkillFilter(skillFilter.filter(skill => skill !== value));
    } else {
      setSkillFilter([...skillFilter, value]);
    }
    setTableState({ ...tableState, page: 1 });
  };
  
  const handleCreateFixer = (fixer: Fixer) => {
    setFixersList([...fixersList, { ...fixer, id: `f${fixersList.length + 1}` }]);
    setIsFormOpen(false);
    toast({
      title: "Success!",
      description: "Fixer created successfully.",
    });
  };
  
  const handleUpdateFixer = (fixer: Fixer) => {
    setFixersList(fixersList.map(f => f.id === fixer.id ? fixer : f));
    setSelectedFixer(null);
    setIsFormOpen(false);
    toast({
      title: "Success!",
      description: "Fixer updated successfully.",
    });
  };
  
  const handleDeleteFixer = (id: string) => {
    setFixersList(fixersList.filter(f => f.id !== id));
    setSelectedFixer(null);
    setIsDetailsOpen(false);
    toast({
      title: "Success!",
      description: "Fixer deleted successfully.",
    });
  };
  
  const clearAllFilters = () => {
    setStatusFilter([]);
    setProvinceFilter([]);
    setSkillFilter([]);
    setTableState({ ...tableState, searchTerm: "", page: 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Fixers</h1>
        
        {hasPermission("admin") && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={18} />
                <span>Add Fixer</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <FixerForm
                onSave={handleCreateFixer}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fixers..."
            className="pl-8"
            value={tableState.searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {(statusFilter.length > 0 || provinceFilter.length > 0 || skillFilter.length > 0) && (
            <Badge className="ml-1 bg-primary-orange">
              {statusFilter.length + provinceFilter.length + skillFilter.length}
            </Badge>
          )}
        </Button>
      </div>
      
      {showFilters && (
        <div className="bg-card rounded-md border p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Filters</h3>
            <Button variant="ghost" onClick={clearAllFilters} size="sm">
              Clear all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <Badge
                    key={status.id}
                    variant={statusFilter.includes(status.id) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      statusFilter.includes(status.id) ? "bg-primary-orange" : ""
                    }`}
                    onClick={() => handleStatusFilterChange(status.id)}
                  >
                    {status.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Province Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Province</h4>
              <div className="flex flex-wrap gap-2">
                {provinces.map(province => (
                  <Badge
                    key={province.id}
                    variant={provinceFilter.includes(province.id) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      provinceFilter.includes(province.id) ? "bg-primary-orange" : ""
                    }`}
                    onClick={() => handleProvinceFilterChange(province.id)}
                  >
                    {province.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Skill Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge
                    key={skill.id}
                    variant={skillFilter.includes(skill.id) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      skillFilter.includes(skill.id) ? "bg-primary-orange" : ""
                    }`}
                    onClick={() => handleSkillFilterChange(skill.id)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("first_name")}
              >
                Name
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Province</TableHead>
              <TableHead className="hidden md:table-cell">Skills</TableHead>
              <TableHead className="hidden md:table-cell">Hire Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFixers.length > 0 ? (
              paginatedFixers.map((fixer) => (
                <TableRow key={fixer.id}>
                  <TableCell className="font-medium">
                    {fixer.first_name} {fixer.last_name}
                  </TableCell>
                  <TableCell>{fixer.phone}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: fixer.status?.color,
                        color: "#fff",
                      }}
                    >
                      {fixer.status?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {fixer.province?.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {fixer.skillObjects?.slice(0, 2).map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                      {(fixer.skillObjects?.length || 0) > 2 && (
                        <Badge variant="outline">
                          +{(fixer.skillObjects?.length || 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(fixer.hire_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={isDetailsOpen && selectedFixer?.id === fixer.id} onOpenChange={(open) => {
                        if (!open) setSelectedFixer(null);
                        setIsDetailsOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFixer(fixer);
                              setIsDetailsOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          {selectedFixer && (
                            <FixerDetails
                              fixer={selectedFixer}
                              onClose={() => {
                                setSelectedFixer(null);
                                setIsDetailsOpen(false);
                              }}
                              onEdit={() => {
                                setIsDetailsOpen(false);
                                setIsFormOpen(true);
                              }}
                              onDelete={handleDeleteFixer}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {hasPermission("admin") && (
                        <Dialog open={isFormOpen && selectedFixer?.id === fixer.id} onOpenChange={(open) => {
                          if (!open) setSelectedFixer(null);
                          setIsFormOpen(open);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFixer(fixer);
                                setIsFormOpen(true);
                              }}
                            >
                              <Pencil size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            {selectedFixer && (
                              <FixerForm
                                fixer={selectedFixer}
                                onSave={handleUpdateFixer}
                                onCancel={() => {
                                  setSelectedFixer(null);
                                  setIsFormOpen(false);
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No fixers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedFixers.length} of {filteredFixers.length} fixers
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tableState.page - 1)}
            disabled={tableState.page === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="text-sm">
            Page {tableState.page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tableState.page + 1)}
            disabled={tableState.page >= totalPages}
          >
            <ChevronRight size={16} />
          </Button>
          <Select
            value={tableState.pageSize.toString()}
            onValueChange={(value) => {
              setTableState({
                ...tableState,
                pageSize: Number(value),
                page: 1,
              });
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Fixers;
