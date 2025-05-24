import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import tripData from "@/static/tripInformation.json"; // Import the JSON data
import { ExternalLinkIcon } from "lucide-react";

interface CabinInformationProps {
  parkingInfo: string;
  activitiesInfo: { name: string; url: string }[];
}

const CabinInformation = ({
  parkingInfo,
  activitiesInfo,
}: CabinInformationProps) => {
  const [activities, setActivities] = useState(tripData.information.activities);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-4">Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#4a3c31]">Parkering</h3>
              </div>
              <p className="text-[#4a3c31]">{tripData.information.parking}</p>
            </div>

            <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#4a3c31]">
                  Lokala aktiviteter/länkar
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border-b border-[#e8e8d5] pb-2">
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#947b5f] hover:text-[#7f6a52] underline"
                    >
                      <div className="flex items-center gap-2">
                        {activity.name}
                        <ExternalLinkIcon className="w-4 h-4 inline-block" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#4a3c31]">
                  Stugans utrustning
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[#4a3c31] mb-2">
                    WiFi tillgängligt i hela stugan
                  </p>
                </div>
                <div>
                  <h4 className="text-[#4a3c31] font-semibold mb-2">
                    Fullt utrustat kök:
                  </h4>
                  <ul className="list-disc list-inside text-[#4a3c31] space-y-1 ml-4">
                    <li>Ugn</li>
                    <li>Induktionshäll</li>
                    <li>Micro</li>
                    <li>Diskmaskin</li>
                    <li>Kyl och frys</li>
                    <li>Brödrost</li>
                    <li>Kaffebryggare</li>
                    <li>Vattenkokare</li>
                    <li>Kolgrill på uteplatsen</li>
                    {/* link to the inventory pdf (should be blue) https://www.isaberg.com/media/b2zji5yq/aelgen-inventarier.pdf */}
                    <li>
                      <a
                        href="https://www.isaberg.com/media/b2zji5yq/aelgen-inventarier.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#947b5f] hover:text-[#7f6a52] underline"
                      >
                        Inventarie
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#4a3c31] font-semibold mb-2">
                    Sovrum och faciliteter:
                  </h4>
                  <ul className="list-disc list-inside text-[#4a3c31] space-y-1 ml-4">
                    <li>12 bäddar fördelat på fyra sovrum och ett loft</li>
                    <li>2 toaletter, 3 duschar</li>
                    <li>Bastu</li>
                    <li>Torkskåp</li>
                    <li>Eldstad</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinInformation;
