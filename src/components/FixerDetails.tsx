
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Fixer } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FixerDetailsProps {
  fixer: Fixer;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const FixerDetails: React.FC<FixerDetailsProps> = ({
  fixer,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { hasPermission } = useAuth();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Fixer Profile</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        {/* Basic Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {fixer.first_name} {fixer.last_name}
            </h3>
            <Badge
              style={{
                backgroundColor: fixer.status?.color,
                color: "#fff",
              }}
            >
              {fixer.status?.name}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{fixer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{fixer.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Province</p>
              <p>{fixer.province?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hire Date</p>
              <p>{new Date(fixer.hire_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {fixer.skillObjects?.map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          {fixer.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{fixer.notes}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Performance</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-md p-4 text-center">
              <p className="text-3xl font-bold">{fixer.total_jobs}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
            <div className="bg-muted/30 rounded-md p-4 text-center">
              <p className="text-3xl font-bold">{fixer.completion_rate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Job History</p>
            <p className="text-sm">
              Detailed job history will be available in a future update.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {hasPermission("admin") && (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onEdit}
            >
              <Pencil size={16} />
              <span>Edit</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this fixer? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(fixer.id)}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        <Button onClick={onClose}>Close</Button>
      </div>
    </>
  );
};

export default FixerDetails;
