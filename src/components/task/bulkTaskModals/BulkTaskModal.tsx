import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import { Modal } from "@/components/ui/modal";
import { ChevronDown, ChevronUp, OctagonAlert, User, Users } from "lucide-react";
import Checkbox from "@/components/form/input/Checkbox";
import Badge from "@/components/ui/badge/Badge";

interface BulkTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  seletedItems: any;
  setSelectedItems: any;
}

const teamsData = [
  {
    id: "team-alpha",
    name: "Team Alpha",
    capacity: { used: 7, total: 10 },
    members: [
      { id: "member-1", name: "John Doe", role: "Coder", capacity: { used: 4, total: 5 } },
      { id: "member-2", name: "Jane Smith", role: "QA", capacity: { used: 3, total: 6 } },
      { id: "member-3", name: "Mike Johnson", role: "Coder", capacity: { used: 2, total: 5 } },
      { id: "member-4", name: "Sarah Wilson", role: "QA", capacity: { used: 1, total: 5 } }
    ]
  },
  {
    id: "team-beta",
    name: "Team Beta", 
    capacity: { used: 10, total: 10 },
    members: [
      { id: "member-5", name: "Alex Brown", capacity: { used: 5, total: 5 } },
      { id: "member-6", name: "Emily Davis", capacity: { used: 5, total: 5 } }
    ]
  },
  {
    id: "team-gamma",
    name: "Team Gamma",
    capacity: { used: 4, total: 10 },
    members: [
      { id: "member-7", name: "Chris Lee", capacity: { used: 2, total: 5 } },
      { id: "member-8", name: "Maria Garcia", capacity: { used: 2, total: 5 } },
      { id: "member-9", name: "David Kim", capacity: { used: 3, total: 6 } }
    ]
  }
];

export default function BulkTaskModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  seletedItems,
  setSelectedItems,
}: BulkTaskModalProps) {
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleTeam = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const toggleTeamSelection = (teamId: string, checked: boolean) => {
    const team = teamsData.find(t => t.id === teamId);
    if (!team) return;

    const newSelected = new Set(selectedTeams);
    if (checked) {
      if (!isTeamFull(team)) {
        newSelected.add(teamId);
      }
    } else {
      newSelected.delete(teamId);
    }
    setSelectedTeams(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType === "assign" && selectedTeams.size === 0) {
      showToast("error", "Please select at least one team");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const selectedTeamNames = teamsData
        .filter(team => selectedTeams.has(team.id))
        .map(team => team.name)
        .join(", ");
      
      showToast("success", `Tasks assigned to: ${selectedTeamNames}`);
      handleClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedTeams(new Set());
      setExpandedTeams(new Set());
      setModelType("");
      setSelectedItems([]);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "assign":
        return "Bulk Assign Tasks";
      case "unassign":
        return "Bulk Unassign Tasks";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "assign":
        return "Select one or more teams to assign the selected tasks in bulk.";
      case "unassign":
        return "Unassign the selected tasks from users or roles in bulk.";
      default:
        return "";
    }
  };

  const isTeamFull = (team: typeof teamsData[0]) => {
    return team.capacity.used >= team.capacity.total;
  };

  const getTotalAvailableCapacity = () => {
    return teamsData
      .filter(team => !isTeamFull(team))
      .reduce((total, team) => total + (team.capacity.total - team.capacity.used), 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[900px] p-5 lg:p-10 m-4"
    >
      <div className="space-y-6">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {getModalDescription()}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {modelType === "assign" ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Available Teams
                  </h5>
                  <div className="text-sm text-gray-500">
                    {selectedTeams.size} team(s) selected • {getTotalAvailableCapacity()} total capacity available
                  </div>
                </div>
                
                <div className="space-y-3">
                  {teamsData.map((team) => {
                    const isExpanded = expandedTeams.has(team.id);
                    const isFull = isTeamFull(team);
                    const isSelected = selectedTeams.has(team.id);
                    const availableCapacity = team.capacity.total - team.capacity.used;

                    return (
                      <div
                        key={team.id}
                        className={`border rounded-lg transition-all ${
                          isSelected 
                            ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50" 
                            : "border-gray-200 hover:border-gray-300"
                        } ${isFull ? "opacity-75" : ""}`}
                      >
                        {/* Team Header */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={isSelected}
                                onChange={(checked) => toggleTeamSelection(team.id, checked)}
                                disabled={isFull}
                                className="flex-shrink-0"
                              />

                              <span className={`font-medium ${isFull ? "text-gray-500" : "text-gray-800"}`}>
                                {team.name}
                              </span>
                              
                              <div className={`px-2 py-1 text-xs rounded-full ${
                                isFull 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {team.capacity.used}/{team.capacity.total}
                                {isFull && " - Full"}
                              </div>

                              {!isFull && (
                                <span className="text-sm text-gray-500">
                                  {availableCapacity} available
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleTeam(team.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                disabled={isFull && team.members.length === 0}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Team Members - Accordion Content */}
                        {isExpanded && team.members.length > 0 && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4 rounded-b-xl">
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <User className="h-3 w-3" />
                              Team Members
                              <span className="text-xs text-gray-500 ml-2">
                                ({team.members.length} members)
                              </span>
                            </h6>
                            
                            <div className="overflow-x-auto">
                              <div className="flex gap-3 pb-2 min-w-max">
                                {team.members.map((member: any) => {
                                  const memberFull = member.capacity.used >= member.capacity.total;
                                  return (
                                    <div
                                      key={member.id}
                                      className={`flex-shrink-0 w-48 p-3 border rounded-lg ${
                                        memberFull
                                          ? "bg-red-50 border-red-200"
                                          : "bg-white border-gray-200"
                                      }`}
                                    >
                                      <div className={`font-medium text-sm ${
                                        memberFull ? "text-red-800" : "text-gray-800"
                                      }`}>
                                        {member.name}
                                        <Badge color="success" variant="light" className="text-xs ml-3">{member?.role}</Badge>
                                      </div>
                                      <div className={`text-xs mt-1 ${
                                        memberFull
                                          ? "text-red-600"
                                          : "text-gray-600"
                                      }`}>
                                        Capacity: {member.capacity.used}/{member.capacity.total}
                                        {memberFull && " - Full"}
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                        <div 
                                          className={`h-1.5 rounded-full ${
                                            memberFull
                                              ? "bg-red-500"
                                              : "bg-brand-500"
                                          }`}
                                          style={{ 
                                            width: `${Math.min((member.capacity.used / member.capacity.total) * 100, 100)}%` 
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {isExpanded && team.members.length === 0 && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4 text-center text-gray-500 text-sm">
                            No members in this team
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {teamsData.every(team => isTeamFull(team)) && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 mt-4">
                    <OctagonAlert className="h-5 w-5" />
                    <p>All teams are currently at full capacity and cannot be selected.</p>
                  </div>
                )}
              </div>

              {selectedTeams.size > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Selected Teams ({selectedTeams.size}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {teamsData
                      .filter(team => selectedTeams.has(team.id))
                      .map(team => (
                        <span
                          key={team.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                        >
                          {team.name} ({team.capacity.total - team.capacity.used} available)
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-warning-50 text-warning-800 rounded-md border border-warning-200">
              <OctagonAlert className="h-5 w-5" />
              <p>
                {Object.keys(seletedItems || {}).length > 0
                  ? `This will unassign ${
                      Object.keys(seletedItems).length
                    } task(s).`
                  : "No tasks selected to unassign."}
              </p>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 min-w-[175px]"
              disabled={
                loading || 
                (modelType === "assign" && selectedTeams.size === 0)
              }
            >
              {loading ? (
                <Loading size={1} style={2} />
              ) : (
                `${modelType === "assign" ? "Bulk Assign" : "Bulk Retrieval"}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}