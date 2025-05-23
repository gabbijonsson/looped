import { User, Dog, Home, Users, Baby } from "lucide-react";
import tripData from "@/static/tripInformation.json";

interface Member {
  name: string;
  age: number;
  household: number;
}

interface Household {
  lastName: string;
  household: number;
  members: Member[];
  dogs?: string[];
}

interface TripData {
  tripStartDate: string;
  tripStartDateFull: string;
  tripEndDate: string;
  tripEndDateFull: string;
  participants: Household[];
}

const typedTripData: TripData = tripData;

const ParticipantShowcase = () => {
  const processedHouseholds: (Household | Household[])[] = [];
  let currentSingleMemberGroup: Household[] = [];

  for (const household of typedTripData.participants) {
    const isSimpleSingleMemberHousehold =
      household.members.length === 1 &&
      (!household.dogs || household.dogs.length === 0);

    if (isSimpleSingleMemberHousehold) {
      currentSingleMemberGroup.push(household);
    } else {
      if (currentSingleMemberGroup.length > 0) {
        processedHouseholds.push(currentSingleMemberGroup);
        currentSingleMemberGroup = [];
      }
      processedHouseholds.push(household);
    }
  }
  if (currentSingleMemberGroup.length > 0) {
    processedHouseholds.push(currentSingleMemberGroup);
  }

  return (
    <div className="bg-[#f0e6e4] p-4 rounded-lg shadow-md border border-amber-100">
      <h2 className="text-xl font-bold text-center text-amber-800 mb-4 flex items-center justify-center">
        <Users className="w-7 h-7 mr-2 text-amber-800" />
        Cabin Crew
      </h2>

      <div className="space-y-4">
        {processedHouseholds.map((item, index) => {
          if (Array.isArray(item)) {
            // This is a group of simple single-member households
            return (
              <div
                key={`group-${index}`}
                className="flex flex-row flex-wrap gap-4"
              >
                {item.map((singleHousehold) => {
                  const member = singleHousehold.members[0];
                  return (
                    <div
                      key={singleHousehold.household}
                      className="p-3 bg-stone-50 rounded-md shadow-sm flex-1 min-w-[220px]"
                    >
                      <h3 className="text-md font-semibold text-amber-800 mb-2 flex items-center">
                        <Home className="w-5 h-5 mr-1 text-amber-800" />
                        {singleHousehold.lastName}
                      </h3>
                      <div className="ml-4 pl-4 border-l-2 border-amber-500 flex flex-wrap gap-x-2 pt-1">
                        <div className="flex flex-col items-center text-center w-20">
                          <div className="w-9 h-9 rounded-full bg-[#E4EEF0] flex items-center justify-center mb-1">
                            {member.age > 18 ? (
                              <User className="w-4 h-4 text-amber-800" />
                            ) : member.age >= 13 ? (
                              <User className="w-[15px] h-[15px] text-amber-800" />
                            ) : (
                              <User className="w-3 h-3 text-amber-800" />
                            )}
                          </div>
                          <span className="text-xs text-amber-800 break-words">
                            {member.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          } else {
            // This is a multi-member household or a single-member with dogs
            const household = item as Household;
            return (
              <div
                key={household.household}
                className="p-3 bg-stone-50 rounded-md shadow-sm"
              >
                <h3 className="text-lg font-semibold text-amber-800 mb-2 flex items-center">
                  <Home className="w-6 h-6 mr-2 text-amber-800" />
                  {household.lastName}
                </h3>
                <div className="ml-4 pl-4 border-l-2 border-amber-500 flex flex-wrap gap-4 pt-2">
                  {household.members.map((member) => (
                    <div
                      key={member.name}
                      className="flex flex-col items-center text-center w-20"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E4EEF0] flex items-center justify-center mb-1">
                        {member.age > 18 ? (
                          <User className="w-5 h-5 text-amber-800" />
                        ) : member.age >= 13 ? (
                          <User className="w-[18px] h-[18px] text-amber-800" />
                        ) : (
                          <Baby className="w-4 h-4 text-amber-800" />
                        )}
                      </div>
                      <span className="text-xs text-amber-800 break-words">
                        {member.name}
                      </span>
                    </div>
                  ))}
                  {household.dogs &&
                    household.dogs.length > 0 &&
                    household.dogs.map((dogName) => (
                      <div
                        key={dogName}
                        className="flex flex-col items-center text-center w-20"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E4EEF0] flex items-center justify-center mb-1">
                          <Dog className="w-5 h-5 text-amber-800" />
                        </div>
                        <span className="text-xs text-amber-800 break-words">
                          {dogName}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ParticipantShowcase;
