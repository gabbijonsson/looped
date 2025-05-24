import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import tripData from "@/static/tripInformation.json"; // Import the JSON data
import BedLinens from "./food-coordination/BedLinens";
import GeneralItinerary from "./trip-schedule/GeneralItinerary";
import ArrivalCoordination from "./trip-schedule/ArrivalCoordination";

const TripSchedule = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-4">
          Reseplanering & Logistik
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
            <h3 className="font-bold text-lg text-[#4a3c31] mb-2">Ankomst</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#f0e6e4] flex items-center justify-center">
                <LogIn className="text-[#947b5f] h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#867e74]">Incheckning</p>
                <p className="font-medium text-[#4a3c31]">
                  {new Date(tripData.checkInDateFull).toLocaleString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
            <h3 className="font-bold text-lg text-[#4a3c31] mb-2">Avresa</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#f0e6e4] flex items-center justify-center">
                <LogOut className="text-[#947b5f] h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[#867e74]">Utcheckning</p>
                <p className="font-medium text-[#4a3c31]">
                  {new Date(tripData.checkOutDateFull).toLocaleString(
                    undefined,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New wrapper for Reservations and Itinerary */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* General Itinerary Section (now on the left) */}
          <GeneralItinerary />

          {/* Right column with Bed Linens and Reservations */}
          <div className="md:w-1/2 flex flex-col gap-6">
            {/* Bed Linens Section */}
            <div className="flex flex-col overflow-hidden">
              <h3 className="font-bold text-lg text-[#4a3c31] mb-3">
                Sängkläder
              </h3>
              <BedLinens />
            </div>

            {/* Reservations Section */}
            <div className="flex flex-col overflow-hidden">
              <h3 className="font-bold text-lg text-[#4a3c31] mb-3">
                Reservationer
              </h3>
              <div className="flex flex-row gap-4 flex-wrap flex-1">
                {tripData.reservations && tripData.reservations.length > 0 ? (
                  tripData.reservations.map((reservation) => (
                    <div
                      key={reservation.location}
                      className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5] w-fit flex-grow"
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <p className="font-medium text-[#4a3c31]">
                            {reservation.location}
                          </p>
                          <p className="text-sm text-[#867e74]">
                            {new Date(reservation.date).toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                            , {reservation.time}
                          </p>
                        </div>
                        {reservation.link && (
                          <a
                            href={reservation.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#947b5f] underline hover:text-[#7f6a52] mt-2 self-start"
                          >
                            View Details / Menu
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#867e74] italic">
                    Inga reservationer finns.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Coordination Section */}
        <ArrivalCoordination />
      </div>
    </div>
  );
};

export default TripSchedule;
