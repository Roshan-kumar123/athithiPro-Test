import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubAdmin,
  updateSubAdmin,
  fetchSubAdminById,
} from "../../../store/slices/subAdmin/subAdminThunk";
import { clearCurrentSubAdmin } from "../../../store/slices/subAdmin/subAdminSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import { Switch } from "../../../components/ui/switch";

const CreateSubAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubAdmin, loading, error } = useSelector(
    (state) => state.subAdmins
  );
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    isActive: true,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchSubAdminById(id));
      return () => dispatch(clearCurrentSubAdmin());
    }
  }, [isEditMode, id, dispatch]);

  useEffect(() => {
    if (isEditMode && currentSubAdmin) {
      setFormData({
        fullName: currentSubAdmin.fullName || "",
        email: currentSubAdmin.email || "",
        password: "",
        isActive: currentSubAdmin.isActive !== false,
      });
    }
  }, [isEditMode, currentSubAdmin]);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!isEditMode && !formData.password) {
      errors.password = "Password is required for new sub-admin";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});
    if (!validateForm()) {
      Object.values(validationErrors).forEach((err) => toast.error(err));
      return;
    }

    const submissionData = { ...formData };
    if (isEditMode && !formData.password) delete submissionData.password;

    const action = isEditMode
      ? updateSubAdmin({ id, updatedFields: submissionData })
      : createSubAdmin(submissionData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          isEditMode ? "Sub-admin updated successfully" : "Sub-admin created successfully"
        );
        navigate("/crm/role", { replace: true });
      })
      .catch((err) => toast.error(err || "Operation failed"));
  };

  if (isEditMode && loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isEditMode && error && !currentSubAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold">Error Loading Sub-Admin</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4" onClick={() => navigate("/crm/role")}>Back to Sub-Admins</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit Sub-Admin" : "Create New Sub-Admin"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update sub-admin information" : "Add a new sub-admin to your organization"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Admin Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter full name"
                required
                className={validationErrors.fullName ? "border-red-500" : ""}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500">{validationErrors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditMode ? "Password (leave blank to keep current)" : "Password *"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                required={!isEditMode}
                className={validationErrors.password ? "border-red-500" : ""}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active Account</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/crm/role")}>Cancel</Button>
              <Button type="submit">{isEditMode ? "Update Sub-Admin" : "Create Sub-Admin"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSubAdmin;
