import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Lock, LogOut, Users, CheckCircle2, AlertTriangle, XCircle,
  ArrowRightLeft, Clock, Download, ChevronDown, ChevronUp, X, Loader2,
  BarChart3
} from "lucide-react";

type Lead = {
  id: string;
  schoolName: string;
  state: string;
  yearsOperating: string;
  entityType: string;
  website: string | null;
  productType: string;
  amountRequested: number;
  termRequested: number | null;
  revenueRange: string;
  creditRange: string;
  contactName: string;
  contactRole: string | null;
  contactEmail: string;
  contactPhone: string;
  attQbo: boolean;
  attReconciled: boolean;
  attPayroll: boolean;
  attBankAccount: boolean;
  attNoCommingling: boolean;
  attBillsPaid: boolean;
  attContracts: boolean;
  attEnrollmentVerification: boolean;
  flags: string[] | null;
  hardStops: string[] | null;
  status: string;
  riskScore: number | null;
  dsrResult: string | null;
  suggestedAmount: number | null;
  handoffStatus: string;
  claimedAt: string | null;
  claimedBy: string | null;
  submittedAt: string;
};

type Stats = {
  total: number;
  qualified: number;
  flagged: number;
  ineligible: number;
  handedOff: number;
  waitlisted: number;
};

type WaitlistEntry = {
  id: string;
  email: string;
  schoolName: string;
  productInterest: string | null;
  createdAt: string;
};

function useAdminKey() {
  const [key, setKeyState] = useState(() => localStorage.getItem("adminKey") || "");
  const setKey = useCallback((k: string) => {
    localStorage.setItem("adminKey", k);
    setKeyState(k);
  }, []);
  const clearKey = useCallback(() => {
    localStorage.removeItem("adminKey");
    setKeyState("");
  }, []);
  return { key, setKey, clearKey };
}

function makeHeaders(key: string) {
  return { Authorization: `Bearer ${key}` };
}

export default function Admin() {
  const { key, setKey, clearKey } = useAdminKey();
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHandoff, setFilterHandoff] = useState("all");
  const [sortField, setSortField] = useState<"submittedAt" | "amountRequested" | "riskScore">("submittedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "waitlist">("leads");
  const queryClient = useQueryClient();

  async function handleLogin() {
    setLoginError("");
    try {
      const res = await fetch("/api/admin/verify", { headers: makeHeaders(loginInput) });
      if (res.ok) {
        setKey(loginInput);
      } else {
        setLoginError("Invalid admin key");
      }
    } catch {
      setLoginError("Connection error");
    }
  }

  const statsQuery = useQuery<Stats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/leads/stats", { headers: makeHeaders(key) });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!key,
    refetchInterval: 30000,
  });

  const leadsQuery = useQuery<Lead[]>({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads", { headers: makeHeaders(key) });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!key,
    refetchInterval: 30000,
  });

  const waitlistQuery = useQuery<WaitlistEntry[]>({
    queryKey: ["admin", "waitlist"],
    queryFn: async () => {
      const res = await fetch("/api/waitlist", { headers: makeHeaders(key) });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!key && activeTab === "waitlist",
  });

  const claimMutation = useMutation({
    mutationFn: async (leadId: string) => {
      const res = await fetch(`/api/leads/${leadId}/claim`, {
        method: "POST",
        headers: { ...makeHeaders(key), "Content-Type": "application/json" },
        body: JSON.stringify({ claimedBy: "admin" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  useEffect(() => {
    if (key && leadsQuery.error) {
      clearKey();
    }
  }, [leadsQuery.error]);

  if (!key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-sm shadow-lg" data-testid="screen-admin-login">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-display">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin key"
                value={loginInput}
                onChange={e => setLoginInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                data-testid="input-admin-key"
              />
              {loginError && <p className="text-xs text-destructive mt-1">{loginError}</p>}
            </div>
            <Button className="w-full bg-primary" onClick={handleLogin} data-testid="button-admin-login">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const leads = leadsQuery.data || [];
  const stats = statsQuery.data;

  const filteredLeads = leads.filter(l => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterHandoff !== "all" && l.handoffStatus !== filterHandoff) return false;
    return true;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let cmp = 0;
    if (sortField === "submittedAt") cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    else if (sortField === "amountRequested") cmp = a.amountRequested - b.amountRequested;
    else if (sortField === "riskScore") cmp = (a.riskScore || 0) - (b.riskScore || 0);
    return sortDir === "desc" ? -cmp : cmp;
  });

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function statusBadge(status: string) {
    if (status === "qualified") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Qualified</Badge>;
    if (status === "flagged") return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Flagged</Badge>;
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ineligible</Badge>;
  }

  function handoffBadge(hs: string) {
    if (hs === "handed_off") return <Badge variant="outline" className="border-emerald-300 text-emerald-700">Handed Off</Badge>;
    if (hs === "waitlisted") return <Badge variant="outline" className="border-amber-300 text-amber-700">Waitlisted</Badge>;
    return <Badge variant="outline" className="border-muted-foreground/30">Pending</Badge>;
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === "desc" ? <ChevronDown className="w-3 h-3 inline ml-1" /> : <ChevronUp className="w-3 h-3 inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="font-display font-bold text-lg text-primary">Lending Lab Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab(activeTab === "leads" ? "waitlist" : "leads")} data-testid="button-toggle-tab">
              {activeTab === "leads" ? "Waitlist" : "Leads"}
            </Button>
            <a href={`/api/leads/export?key=${key}`} download>
              <Button variant="outline" size="sm" data-testid="button-export-csv">
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={clearKey} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3" data-testid="stats-grid">
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{stats.total}</div><div className="text-xs text-muted-foreground">Total</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{stats.qualified}</div><div className="text-xs text-muted-foreground">Qualified</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-amber-600">{stats.flagged}</div><div className="text-xs text-muted-foreground">Flagged</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{stats.ineligible}</div><div className="text-xs text-muted-foreground">Ineligible</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-secondary">{stats.handedOff}</div><div className="text-xs text-muted-foreground">Handed Off</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-primary">{stats.waitlisted}</div><div className="text-xs text-muted-foreground">Waitlist</div></CardContent></Card>
          </div>
        )}

        {activeTab === "leads" && (
          <>
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]" data-testid="filter-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="ineligible">Ineligible</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterHandoff} onValueChange={setFilterHandoff}>
                <SelectTrigger className="w-[160px]" data-testid="filter-handoff"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Handoff</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="handed_off">Handed Off</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">{sortedLeads.length} leads</span>
            </div>

            {leadsQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="leads-table">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-3 cursor-pointer hover:text-primary" onClick={() => toggleSort("submittedAt")}>Date <SortIcon field="submittedAt" /></th>
                      <th className="p-3">School</th>
                      <th className="p-3">State</th>
                      <th className="p-3">Product</th>
                      <th className="p-3 cursor-pointer hover:text-primary" onClick={() => toggleSort("amountRequested")}>Amount <SortIcon field="amountRequested" /></th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Handoff</th>
                      <th className="p-3 cursor-pointer hover:text-primary" onClick={() => toggleSort("riskScore")}>Score <SortIcon field="riskScore" /></th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeads.map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedLead(lead)} data-testid={`row-lead-${lead.id}`}>
                        <td className="p-3 whitespace-nowrap">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                        <td className="p-3 font-medium">{lead.schoolName}</td>
                        <td className="p-3">{lead.state}</td>
                        <td className="p-3 capitalize">{lead.productType.replace("_", " ")}</td>
                        <td className="p-3">${lead.amountRequested.toLocaleString()}</td>
                        <td className="p-3">{statusBadge(lead.status)}</td>
                        <td className="p-3">{handoffBadge(lead.handoffStatus)}</td>
                        <td className="p-3">{lead.riskScore ?? "—"}</td>
                        <td className="p-3" onClick={e => e.stopPropagation()}>
                          {lead.handoffStatus === "pending" && (lead.status === "qualified" || lead.status === "flagged") && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => claimMutation.mutate(lead.id)} disabled={claimMutation.isPending} data-testid={`button-handoff-${lead.id}`}>
                              <ArrowRightLeft className="w-3 h-3 mr-1" /> Hand Off
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {sortedLeads.length === 0 && (
                      <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No leads match the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "waitlist" && (
          <div>
            <h2 className="font-display font-bold text-lg text-primary mb-4">Waitlist Entries</h2>
            {waitlistQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="waitlist-table">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-3">Date</th>
                      <th className="p-3">School</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Product Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(waitlistQuery.data || []).map(entry => (
                      <tr key={entry.id} className="border-b" data-testid={`row-waitlist-${entry.id}`}>
                        <td className="p-3">{new Date(entry.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-medium">{entry.schoolName}</td>
                        <td className="p-3">{entry.email}</td>
                        <td className="p-3 capitalize">{entry.productInterest?.replace("_", " ") || "—"}</td>
                      </tr>
                    ))}
                    {(waitlistQuery.data || []).length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No waitlist entries yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} data-testid="modal-lead-detail">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-display">{selectedLead.schoolName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedLead.state} · {selectedLead.entityType} · {selectedLead.yearsOperating} years</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                {statusBadge(selectedLead.status)}
                {handoffBadge(selectedLead.handoffStatus)}
                {selectedLead.riskScore !== null && <Badge variant="outline">Score: {selectedLead.riskScore}</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Product</span>
                  <p className="font-medium capitalize">{selectedLead.productType.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount</span>
                  <p className="font-medium">${selectedLead.amountRequested.toLocaleString()}</p>
                </div>
                {selectedLead.termRequested && (
                  <div>
                    <span className="text-muted-foreground">Term</span>
                    <p className="font-medium">{selectedLead.termRequested} years</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Revenue</span>
                  <p className="font-medium">{selectedLead.revenueRange.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Credit</span>
                  <p className="font-medium">{selectedLead.creditRange.replace("_", " ")}</p>
                </div>
                {selectedLead.dsrResult && (
                  <div>
                    <span className="text-muted-foreground">DSR</span>
                    <p className="font-medium">{selectedLead.dsrResult}</p>
                  </div>
                )}
                {selectedLead.suggestedAmount && (
                  <div>
                    <span className="text-muted-foreground">Suggested Amount</span>
                    <p className="font-medium">${selectedLead.suggestedAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm mb-2">Contact</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {selectedLead.contactName}</div>
                  <div><span className="text-muted-foreground">Role:</span> {selectedLead.contactRole || "—"}</div>
                  <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedLead.contactEmail}`} className="text-secondary hover:underline">{selectedLead.contactEmail}</a></div>
                  <div><span className="text-muted-foreground">Phone:</span> {selectedLead.contactPhone}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-2">Attestations</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {[
                    ["QBO", selectedLead.attQbo],
                    ["Reconciled", selectedLead.attReconciled],
                    ["Payroll", selectedLead.attPayroll],
                    ["Bank Account", selectedLead.attBankAccount],
                    ["No Commingling", selectedLead.attNoCommingling],
                    ["Bills Paid", selectedLead.attBillsPaid],
                    ["Contracts", selectedLead.attContracts],
                    ["Enrollment Verification", selectedLead.attEnrollmentVerification],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex items-center gap-1">
                      {val ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-red-400" />}
                      <span>{label as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLead.flags && selectedLead.flags.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2 text-amber-700">Flags</h4>
                  <ul className="space-y-1 text-sm text-amber-700">
                    {selectedLead.flags.map((f, i) => (
                      <li key={i} className="flex items-start gap-1"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLead.hardStops && selectedLead.hardStops.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2 text-red-700">Hard Stops</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {selectedLead.hardStops.map((h, i) => (
                      <li key={i} className="flex items-start gap-1"><XCircle className="w-3 h-3 shrink-0 mt-0.5" />{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedLead.handoffStatus === "pending" && (selectedLead.status === "qualified" || selectedLead.status === "flagged") && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => { claimMutation.mutate(selectedLead.id); setSelectedLead(null); }} data-testid="button-handoff-modal">
                    <ArrowRightLeft className="w-4 h-4 mr-1" /> Mark as Handed Off
                  </Button>
                )}
                {selectedLead.claimedAt && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Handed off {new Date(selectedLead.claimedAt).toLocaleDateString()} by {selectedLead.claimedBy}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
