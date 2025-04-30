
import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Fixer } from "@/types";
import { provinces, skills, statuses } from "@/data/mockData";

interface FixerFormProps {
  fixer?: Fixer;
  onSave: (fixer: Fixer) => void;
  onCancel: () => void;
}

const FixerForm: React.FC<FixerFormProps> = ({ fixer, onSave, onCancel }) => {
  const isEditing = !!fixer;
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Fixer>>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    province_id: "",
    status_id: "active",
    skills: [],
    hire_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fixer) {
      setFormData({
        ...fixer,
      });
    }
  }, [fixer]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{3}-\d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{7}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone format";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.province_id) {
      newErrors.province_id = "Province is required";
    }

    if (!formData.status_id) {
      newErrors.status_id = "Status is required";
    }

    if (!formData.skills?.length) {
      newErrors.skills = "At least one skill is required";
    }

    if (!formData.hire_date) {
      newErrors.hire_date = "Hire date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSkillChange = (skillId: string, checked: boolean) => {
    setFormData((prev) => {
      const currentSkills = prev.skills || [];
      
      if (checked) {
        return { ...prev, skills: [...currentSkills, skillId] };
      } else {
        return {
          ...prev,
          skills: currentSkills.filter((id) => id !== skillId),
        };
      }
    });
    
    // Clear error for skills
    if (errors.skills) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.skills;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form.",
      });
      return;
    }

    const province = provinces.find((p) => p.id === formData.province_id);
    const status = statuses.find((s) => s.id === formData.status_id);
    const skillObjects = skills.filter((s) => formData.skills?.includes(s.id));

    const fixerData: Fixer = {
      id: fixer?.id || "",
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      phone: formData.phone || "",
      email: formData.email,
      province_id: formData.province_id || "",
      province: province,
      status_id: formData.status_id || "active",
      status: status,
      skills: formData.skills || [],
      skillObjects: skillObjects,
      hire_date: formData.hire_date || new Date().toISOString().split("T")[0],
      notes: formData.notes,
      total_jobs: fixer?.total_jobs || 0,
      completion_rate: fixer?.completion_rate || 0,
      created_at: fixer?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(fixerData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Fixer" : "Add New Fixer"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the fixer's information below."
            : "Fill in the details to add a new fixer."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? "border-destructive" : ""}
            />
            {errors.first_name && (
              <p className="text-xs text-destructive">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? "border-destructive" : ""}
            />
            {errors.last_name && (
              <p className="text-xs text-destructive">{errors.last_name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081-234-5678"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">
              Province <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.province_id}
              onValueChange={(value) => handleSelectChange("province_id", value)}
            >
              <SelectTrigger
                className={errors.province_id ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name} ({province.name_th})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province_id && (
              <p className="text-xs text-destructive">{errors.province_id}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.status_id}
              onValueChange={(value) => handleSelectChange("status_id", value)}
            >
              <SelectTrigger
                className={errors.status_id ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name} ({status.name_th})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status_id && (
              <p className="text-xs text-destructive">{errors.status_id}</p>
            )}
          </div>

          {/* Hire Date */}
          <div className="space-y-2">
            <Label htmlFor="hire_date">
              Hire Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hire_date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
              className={errors.hire_date ? "border-destructive" : ""}
            />
            {errors.hire_date && (
              <p className="text-xs text-destructive">{errors.hire_date}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label>
            Skills <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill.id}`}
                  checked={(formData.skills || []).includes(skill.id)}
                  onCheckedChange={(checked) =>
                    handleSkillChange(skill.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`skill-${skill.id}`}
                  className="text-sm cursor-pointer"
                >
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
          {errors.skills && (
            <p className="text-xs text-destructive">{errors.skills}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Add"} Fixer</Button>
      </div>
    </form>
  );
};

export default FixerForm;
