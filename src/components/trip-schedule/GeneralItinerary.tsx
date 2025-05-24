const GeneralItinerary = () => {
  const itineraryItems = [
    {
      date: "29 maj",
      activities: ["Ankomst"],
    },
    {
      date: "30 maj",
      activities: ["Middagsreservation"],
    },
    {
      date: "31 maj",
      activities: ["Korvgrillning i området", "Vandringstur"],
    },
    {
      date: "1 juni",
      activities: ["Hemresa"],
    },
  ];

  return (
    <div className="md:w-1/2 flex flex-col overflow-hidden">
      <h3 className="font-bold text-lg text-[#4a3c31] mb-3">Generell plan</h3>
      <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5] flex-1">
        <p className="italic text-[#867e74] mb-3"></p>
        <div className="space-y-4">
          {itineraryItems.map((item, index) => (
            <div
              key={index}
              className="relative pl-6 border-l-2 border-[#d1cdc3]"
            >
              <div className="absolute w-4 h-4 bg-[#947b5f] rounded-full -left-[9px] top-0"></div>
              <p className="font-medium text-[#4a3c31]">{item.date}</p>
              <div className="text-[#867e74]">
                {item.activities.map((activity, activityIndex) => (
                  <p key={activityIndex} className="mb-1 last:mb-0">
                    {activity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralItinerary;
