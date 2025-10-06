import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Download } from "lucide-react";

const PreviewTab: React.FC = () => {
  
  return (
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-lg gap-4 p-[16px]">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-dark text-[16px]">Task Summary</h1>
        
        <Badge className="text-sm" color="warning" variant="light">Review in Progress</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F2F4F7] rounded-[10px] p-4">
          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">MRN</div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              14800
            </div>
          </div>

          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">Chart Type</div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              SOC
            </div>
          </div>

          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">Assigned To</div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              Chakradhar
            </div>
          </div>
        </div>

        {/* Right Box */}
        <div className="bg-[#F2F4F7] rounded-[10px] p-4">
          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">
              Patient Name
            </div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              Byrd Kamau
            </div>
          </div>

          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">Coding Date</div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              7/5/2023
            </div>
          </div>

          <div className="flex justify-between mt-2 mb-1">
            <div className="text-[16px] text-gray-light w-1/2">QA By</div>
            <div className="text-[16px] text-gray-dark w-1/2 text-right">
              Sunitha
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#EAECF0] rounded-lg p-4 shadow-sm">
          <div className="font-semibold text-xs text-gray-700 mb-2">
            Internal QA Score
          </div>
          <div className="flex items-center gap-[21px] mb-[15px]">
            <div className="w-full h-[20px] bg-gray-200 rounded-full flex-1">
              <div
                className="h-[20px] bg-orange-400 rounded-full"
                style={{ width: "84%" }}
              ></div>
            </div>
            <span
              className={`px-[12px] py-[3px] rounded-[8px] text-[12px] leading-[18px] font-medium bg-[#F79009]`}
            >
              <span className="text-white">84%</span>
            </span>
          </div>
          <div className="flex justify-between gap-[12px]">
            <div className="flex-1 h-[50px] bg-[#F2F4F7] flex items-center justify-center flex-col rounded-[6px]">
              <div className="text-xs text-gray-light mb-1">Coding</div>
              <div className="text-xs text-[#039855]">88%</div>
            </div>
            <div className="flex-1  h-[50px] bg-[#F2F4F7] flex items-center justify-center flex-col rounded-[6px]">
              <div className="text-xs text-gray-light mb-1">OASIS</div>
              <div className="text-xs text-[#039855]">88%</div>
            </div>
            <div className="flex-1 h-[50px] bg-[#F2F4F7] flex items-center justify-center flex-col rounded-[6px]">
              <div className="text-xs text-gray-light mb-1">POC</div>
              <div className="text-xs text-[#039855]">94%</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EAECF0] rounded-lg p-4 shadow-sm">
          <div className="font-semibold text-xs text-gray-700 mb-2">
            External QA Score
          </div>
          <div className="flex items-center gap-[21px] mb-[15px]">
            <div className="w-full h-[20px] bg-gray-200 rounded-full flex-1">
              <div
                className="h-[20px] bg-green-500 rounded-full"
                style={{ width: "88%" }}
              ></div>
            </div>
            <span
              className={`px-[12px] py-[3px] rounded-[8px] text-[12px] leading-[18px] font-medium bg-[#039855]`}
            >
              <span className="text-white">88%</span>
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 h-[50px] bg-[#F2F4F7] flex items-start justify-center px-[10px] flex-col rounded-[6px]">
              <div className="text-xs text-gray-light mb-1">
                External QA Status
              </div>
              <span className="text-[#F79009] text-sm leading-[18px]">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="text-[16px] text-gray-dark mb-[12px]">
          Error Summary
        </div>

        <div className="bg-[#F2F4F7] p-[12px] rounded-[10px] mb-[12px]">
          <div className="font-semibold text-sm text-gray-light">
            Coding Errors
          </div>
          <div className="text-sm text-gray-light mt-[12px]">
            <span className="font-[550]">DX</span>:Missing dx p15: Missing
            secondary diagnosis for CHF{" "}
            <a href="#" className="text-brand-primary underline">
              [Has attachment]
            </a>
          </div>
          <div className="text-sm text-gray-light mt-[10px]">
            <span className="font-[550]">Convention Error</span>:p10: Incorrect
            ICD-10 format for diabetes code{" "}
            <a href="#" className="text-brand-primary underline">
              [Has attachment]
            </a>
          </div>
        </div>

        <div className="bg-[#F2F4F7] p-[12px] rounded-[10px] mb-[12px]">
          <div className="font-semibold text-sm text-gray-light">
            OASIS Errors
          </div>
          <div className="text-sm text-gray-light mt-[12px] leading-[20px]">
            <span className="font-[550]">Goals and interventions</span>{" "}
            <span className="font-normal">
              (6 pts): Incomplete intervention for wound care
            </span>
          </div>
          <div className="text-sm text-gray-light mt-[10px]">
            <span className="font-[550]">Wound care worksheet</span> (6 pts):
            Missing wound measurement{" "}
            <a href="#" className="text-brand-primary underline">
              [Has attachment]
            </a>
          </div>
        </div>

        <div className="bg-[#F2F4F7] p-[12px] rounded-[10px] mb-[12px]">
          <div className="font-semibold text-sm text-gray-light">
            POC Errors
          </div>
          <div className="text-sm text-gray-light mt-[12px] leading-[20px]">
            <span className="font-[550]">Goals and interventions</span>{" "}
            <span className="font-normal">
              (6 pts): Goals do not align with diagnosis
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#EEF1FF] rounded-[10px] p-4 hover:shadow-sm">
        <div className="font-semibold text-gray-light text-sm mb-[12px] leading-[20px]">
          QA Comments
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-light space-y-1">
          <li>
            Ensure all secondary diagnoses are coded, especially for the CHF
            condition mentioned in paragraph 2.
          </li>
          <li>
            Better listing of wound types and procedures, consistent to the full
            7-character code where available.
          </li>
          <li>
            The wound care worksheet is missing the QA&apos;s section about wound
            size, depth, and dimensions.
          </li>
          <li>
            Review the goals section to ensure alignment with the primary
            diagnosis.
          </li>
        </ul>
        <p className="text-sm text-gray-light mt-1">
          Once these issues are addressed, please resubmit for final review.
        </p>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="font-semibold text-sm text-gray-light mb-[10px] leading-[20px]">
          External QA Comments
        </div>
        <div className="bg-[#F2F4F7] p-4 rounded-[10px] text-center text-sm text-gray-light">
          No external QA comments provided
        </div>
        <Button className="self-end  flex items-center gap-2 px-[12px] py-[6px] rounded-[8px] text-brand-primary text-sm font-semibold mt-[20px]">
          <Download className="w-5 h-5" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;
