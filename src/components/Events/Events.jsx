import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} mb-6`}>
            <h1 className="text-3xl font-bold text-left">Sự Kiện Nổi Bật</h1>
          </div>

          <div className="w-full grid gap-6">
            {allEvents.length > 0 ? (
              allEvents.map((event, index) => (
                <EventCard key={index} data={event} />
              ))
            ) : (
              <h4 className="text-center text-gray-500 text-lg">Không có sự kiện nào!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;