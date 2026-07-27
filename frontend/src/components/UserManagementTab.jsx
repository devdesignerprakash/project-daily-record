"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Users, Edit3, XCircle } from "lucide-react";
import api from "@/lib/api";
import { MODULE_OPTIONS, MODULE_KEYS } from "@/lib/modules";

export default function UserManagementTab({ onSuccess, onError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [userType, setUserType] = useState("user");
  const [password, setPassword] = useState("");
  const [allowedModules, setAllowedModules] = useState(MODULE_KEYS);
  const [canPrintLetter, setCanPrintLetter] = useState(true);

  const toggleModule = (key) => {
    setAllowedModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Edit states
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users list
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/user");
      setUsers(response.data || []);
    } catch (err) {
      onError(err.message || "प्रयोगकर्ताहरू लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (active) {
        await fetchUsers();
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchUsers]);

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFullName(user.fullName);
    setEmail(user.email);
    setDesignation(user.designation);
    setUserType(user.userType);
    setPassword(""); // Clear password field on edit select
    // Legacy accounts created before this field existed get full access.
    setAllowedModules(Array.isArray(user.allowedModules) ? user.allowedModules : MODULE_KEYS);
    setCanPrintLetter(user.canPrintLetter !== false);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFullName("");
    setEmail("");
    setDesignation("");
    setUserType("user");
    setPassword("");
    setAllowedModules(MODULE_KEYS);
    setCanPrintLetter(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !designation || !userType) {
      onError("सबै आवश्यक क्षेत्रहरू भर्नुहोस्।");
      return;
    }
    if (!editingUserId && !password) {
      onError("नयाँ प्रयोगकर्ता सिर्जना गर्न पासवर्ड आवश्यक छ।");
      return;
    }

    try {
      const payload = {
        fullName,
        email,
        designation,
        userType,
        allowedModules,
        canPrintLetter,
      };
      if (password) {
        payload.password = password;
      }

      if (editingUserId) {
        // Edit mode
        await api.put(`/api/user/${editingUserId}`, payload);
        onSuccess("प्रयोगकर्ताको विवरण सफलतापूर्वक अपडेट भयो!");
      } else {
        // Create mode
        await api.post("/api/user", payload);
        onSuccess("नयाँ प्रयोगकर्ता सफलतापूर्वक सिर्जना भयो!");
      }

      // Reset form
      handleCancelEdit();
      // Refresh list
      fetchUsers();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create / Edit Form */}
      <Card className="lg:col-span-1 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            {editingUserId
              ? "प्रयोगकर्ता विवरण सम्पादन (Edit User)"
              : "नयाँ प्रयोगकर्ता थप्नुहोस् (Add User)"}
          </CardTitle>
          <CardDescription className="text-xs">
            {editingUserId
              ? "चुनिएको प्रयोगकर्ताको विवरणहरू परिवर्तन गर्नुहोस्"
              : "प्रणालीमा नयाँ प्रयोगकर्ता दर्ता गर्नुहोस्"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-xs font-semibold">
                पूरा नाम (Full Name) *
              </Label>
              <Input
                id="user-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-xs font-semibold">
                इमेल (Email) *
              </Label>
              <Input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-designation" className="text-xs font-semibold">
                पद (Designation) *
              </Label>
              <Input
                id="user-designation"
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role" className="text-xs font-semibold">
                भूमिका / प्रकार (User Type) *
              </Label>
              <select
                id="user-role"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-zinc-900"
              >
                <option value="user" className="dark:bg-zinc-900">
                  सामान्य प्रयोगकर्ता (User)
                </option>
                <option value="admin" className="dark:bg-zinc-900">
                  प्रशासक (Admin)
                </option>
              </select>
            </div>
            {userType === "user" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    मोड्युल पहुँच (Editable Modules)
                  </Label>
                  <button
                    type="button"
                    onClick={() =>
                      setAllowedModules((prev) =>
                        prev.length === MODULE_KEYS.length ? [] : MODULE_KEYS
                      )
                    }
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    {allowedModules.length === MODULE_KEYS.length ? "सबै हटाउनुहोस्" : "सबै छान्नुहोस्"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1.5 border border-slate-200 dark:border-zinc-800 rounded-md p-2.5 max-h-48 overflow-y-auto">
                  {MODULE_OPTIONS.map((mod) => (
                    <label
                      key={mod.key}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={allowedModules.includes(mod.key)}
                        onChange={() => toggleModule(mod.key)}
                        className="accent-emerald-600"
                      />
                      {mod.label}
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">
                  यहाँ नछानिएका मोड्युलका ट्याब यो प्रयोगकर्तालाई देखिने छैनन्।
                </p>
              </div>
            )}
            {userType === "user" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canPrintLetter}
                    onChange={(e) => setCanPrintLetter(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  पत्र प्रिन्ट अनुमति (Can Print Letter)
                </label>
                <p className="text-[10px] text-slate-400">
                  यो निष्क्रिय गरेमा यो प्रयोगकर्तालाई &ldquo;पत्र सिर्जना गर्नुहोस्&rdquo; बटन देखिने छैन।
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="user-pass" className="text-xs font-semibold">
                पासवर्ड (Password) {editingUserId ? "(परिवर्तन गर्न मात्र भर्नुहोस्)" : "*"}
              </Label>
              <Input
                id="user-pass"
                type="password"
                required={!editingUserId}
                placeholder={editingUserId ? "नयाँ पासवर्ड (ऐच्छिक)" : "पासवर्ड हाल्नुहोस्"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white rounded-md text-sm font-semibold"
            >
              {editingUserId ? "अपडेट गर्नुहोस् (Update)" : "सिर्जना गर्नुहोस् (Create)"}
            </Button>
            {editingUserId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="w-full text-xs flex items-center justify-center gap-1 border-slate-200 dark:border-zinc-800"
              >
                <XCircle className="w-3.5 h-3.5" /> सम्पादन रद्द गर्नुहोस् (Cancel)
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Users List Table */}
      <Card className="lg:col-span-2 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            प्रयोगकर्ताहरूको सूची (Users List)
          </CardTitle>
          <CardDescription className="text-xs">
            प्रणालीमा दर्ता भएका सम्पूर्ण प्रयोगकर्ता विवरण
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="text-xs">नाम (Name)</TableHead>
                <TableHead className="text-xs">इमेल (Email)</TableHead>
                <TableHead className="text-xs">पद (Designation)</TableHead>
                <TableHead className="text-xs">भूमिका (Role)</TableHead>
                <TableHead className="text-xs">मोड्युल पहुँच (Modules)</TableHead>
                <TableHead className="text-xs">पत्र प्रिन्ट (Letter)</TableHead>
                <TableHead className="text-xs text-right">कार्य (Actions)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    लोड हुँदैछ...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    कुनै प्रयोगकर्ता फेला परेन।
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow
                    key={row._id}
                    className="border-b border-slate-100 dark:border-zinc-900 text-xs"
                  >
                    <TableCell className="font-semibold text-slate-800 dark:text-zinc-200">
                      {row.fullName}
                    </TableCell>
                    <TableCell className="text-slate-500">{row.email}</TableCell>
                    <TableCell className="text-slate-500">{row.designation}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.userType === "admin"
                            ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                            : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                        }`}
                      >
                        {row.userType === "admin" ? "प्रशासक" : "प्रयोगकर्ता"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {row.userType === "admin" ? (
                        "सबै (All)"
                      ) : !Array.isArray(row.allowedModules) || row.allowedModules.length === MODULE_KEYS.length ? (
                        "सबै (All)"
                      ) : row.allowedModules.length === 0 ? (
                        <span className="text-rose-500">कुनै पनि छैन</span>
                      ) : (
                        `${row.allowedModules.length}/${MODULE_KEYS.length} मोड्युल`
                      )}
                    </TableCell>
                    <TableCell>
                      {row.userType === "admin" || row.canPrintLetter !== false ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">अनुमति छ</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">छैन</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-2 px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(row)}
                        className="h-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 gap-1 flex items-center ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>सम्पादन</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
