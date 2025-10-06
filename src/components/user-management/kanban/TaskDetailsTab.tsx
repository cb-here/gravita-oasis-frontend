import React from "react";
import { Task } from "./types/types";

const TaskDetailsTab: React.FC<{ task: Task }> = ({ task }) => (
  <div className="pt-[20px] pb-2 px-2">
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {task && (
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-[20px] leading-[30px] font-bold text-gray-900">
              {task?.title || "SN Assessment E"}
            </h2>

            <div className="flex justify-between items-center w-full">
              {/* Left Column */}
              <div className="space-y-3 w-1/2">
                {/* MRN */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">MRN</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-brand-primary font-medium">
                      {task?.mrn || "123456"}
                    </p>
                  </div>
                </div>

                {/* Type of Chart */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Type of Chart
                    </p>
                  </div>
                  <div className="flex-1">
                    <span className="capitalize inline-flex px-[10px] py-[5px] rounded-[6px] text-xs bg-new-green text-text-green font-semibold">
                      {task?.status || "Fresh"}
                    </span>
                  </div>
                </div>

                {/* Priority */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Priority
                    </p>
                  </div>
                  <div className="flex-1">
                    <span className="capitalize inline-flex px-[10px] py-[5px] rounded-[6px] text-xs bg-red-50 text-red-700 font-semibold">
                      {task?.priority || "High"}
                    </span>
                  </div>
                </div>

                {/* Current Status */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Current Status
                    </p>
                  </div>
                  <div className="flex-1">
                    <span className="capitalize inline-flex px-[10px] py-[5px] rounded-[6px] text-xs bg-brand-primary-100 text-brand-primary font-semibold">
                      {"Workflow"}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Assignee
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-yellow-300 overflow-hidden mr-2 flex items-center justify-center">
                        <span className="font-medium text-xs text-gray-700">
                          JD
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {"John Doe"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (pushed to bottom) */}
              <div className="space-y-3 mr-10">
                {/* Target Date */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Target Date
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {task?.dueDate || "01 - 01 - 2025"}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">Age</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{"38"}</p>
                  </div>
                </div>

                {/* Project Name */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Task Type
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">SOC</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Insurance
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Human Medical</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Assigned Date
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">01-01-2025</p>
                  </div>
                </div>

                {/* Patient Name */}
                <div className="flex">
                  <div className="w-32">
                    <p className="text-sm text-gray-light font-medium">
                      Patient Name
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{"John Doe"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default React.memo(TaskDetailsTab);
