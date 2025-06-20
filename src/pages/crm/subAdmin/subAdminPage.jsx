import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubAdmins, softDeleteSubAdmin } from "../../../store/slices/subAdmin/subAdminThunk";
import { toast } from "sonner";

import {
  User,
  Plus,
  List,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  FilePlus,
  FileText,
  AlertTriangle,
  Search,
  X
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";
import { MoreHorizontal, ArrowRight } from "lucide-react";
const SubAdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subAdmins, loading, error } = useSelector(state => state.subAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    dispatch(fetchSubAdmins())
      .then(action => {
        console.log("SubAdmin response:", action.payload);
      });
  }, [dispatch]);

  const handleSoftDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sub-admin?")) {
      dispatch(softDeleteSubAdmin(id))
        .unwrap()
        .then(() => {
          toast.success("Sub-admin deleted successfully");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete sub-admin");
        });
    }
  };

  const filteredSubAdmins = subAdmins.filter(admin => 
    !admin.isDeleted && 
    (admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     admin.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sub-Admins</h1>
          <p className="text-muted-foreground">
            Manage your organization's sub-administrators
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/crm/role/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Sub-Admin
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sub-admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-2.5"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div> */}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Error Loading Sub-Admins</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      ) : filteredSubAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium">No Sub-Admins Found</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term" : "Create a sub-admin to get started"}
          </p>
          <Button className="mt-4" onClick={() => navigate("/crm/role/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sub-Admin
          </Button>
        </div>
      ) : viewMode === "list" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubAdmins.map((admin) => (
                <TableRow
                  key={admin._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/crm/role/${admin._id}/edit`)}
                >
                  <TableCell className="font-medium">{admin.fullName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={admin.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {admin.createdAt ? format(new Date(admin.createdAt), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/crm/role/${admin._id}/edit`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSoftDelete(admin._id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubAdmins.map((admin) => (
            <Card key={admin._id} className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle>{admin.fullName}</CardTitle>
                <CardDescription>{admin.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={admin.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/crm/role/${admin._id}/edit`)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSoftDelete(admin._id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubAdminPage;
