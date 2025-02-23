import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, data._id]);

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[25px] text-[#475ad2] font-bold mx-2">
        {timeLeft[interval]} {interval === 'days' ? 'Ngày' : interval === 'hours' ? 'Giờ' : interval === 'minutes' ? 'Phút' : 'Giây'}
      </span>
    );
  });

  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px] font-bold">Hết Thời Gian</span>
      )}
    </div>
  );
};

export default CountDown;