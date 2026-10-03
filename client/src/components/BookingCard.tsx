import React, { useState } from 'react';
import {
  Sparkle,
  CalendarBlank,
  Clock,
  ArrowRight,
  CaretRight,
} from '@phosphor-icons/react';

interface BookingCardProps {
  onBookNow?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ onBookNow }) => {
  const [date, setDate] = useState('Tue, Sep 23, 2025');
  const [time, setTime] = useState('10:00 AM \u2013 12:00 PM');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const dates = [
    'Tue, Sep 23, 2025',
    'Wed, Sep 24, 2025',
    'Thu, Sep 25, 2025',
    'Fri, Sep 26, 2025',
    'Sat, Sep 27, 2025',
  ];
  const times = [
    '08:00 AM \u2013 10:00 AM',
    '10:00 AM \u2013 12:00 PM',
    '01:00 PM \u2013 03:00 PM',
    '03:00 PM \u2013 05:00 PM',
    '05:00 PM \u2013 07:00 PM',
  ];

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onBookNow?.(); }}
      className="w-full max-w-[340px] mx-auto lg:mx-0 rounded-[22px] bg-booking-card p-6 shadow-[0_14px_34px_rgba(12,51,82,0.16)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-foreground">
        <Sparkle size={20} weight="fill" className="text-accent" />
        <span>Trusted cleaners</span>
        <span className="text-muted">•</span>
        <span>Flexible slots</span>
      </div>

      <div className="relative mt-5">

        {/* 1000+ HAPPY HOMES floating badge */}
        <div className="absolute -right-2 sm:-right-12 -top-[90px] sm:-top-[102px] flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center rounded-full border-2 border-accent bg-booking-card text-center shadow-[0_4px_14px_rgba(12,51,82,0.15)] z-30">
          {/* blue heart icon */}
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary fill-primary">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
          <strong className="mt-0.5 text-base sm:text-lg leading-none text-foreground">1000+</strong>
          <span className="mt-0.5 text-[7px] sm:text-[8px] font-extrabold text-primary">HAPPY HOMES</span>
          <span className="mt-0.5 text-[9px] sm:text-[10px] tracking-[1px] text-accent">★★★★★</span>
        </div>

        {/* Date selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowDate(!showDate); setShowTime(false); }}
            className="flex w-full items-center gap-4 rounded-2xl border border-foreground/10 bg-input-row px-4 py-3 text-left"
          >
            <CalendarBlank size={24} className="text-foreground shrink-0" />
            <span className="flex-1">
              <span className="block text-[10px] font-normal text-muted">Select Date</span>
              <span className="block text-sm font-medium text-foreground">{date}</span>
            </span>
            <CaretRight size={14} weight="bold" className="text-foreground" />
          </button>

          {showDate && (
            <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDate(d); setShowDate(false); }}
                  className={`block w-full rounded-xl px-4 py-2 text-left text-xs font-semibold transition-colors ${
                    date === d ? 'bg-blue-50 text-primary' : 'text-foreground hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time selector */}
        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => { setShowTime(!showTime); setShowDate(false); }}
            className="flex w-full items-center gap-4 rounded-2xl border border-foreground/10 bg-input-row px-4 py-3 text-left"
          >
            <Clock size={24} className="text-foreground shrink-0" />
            <span className="flex-1">
              <span className="block text-[10px] font-normal text-muted">Select Time</span>
              <span className="block text-sm font-medium text-foreground">{time}</span>
            </span>
            <CaretRight size={14} weight="bold" className="text-foreground" />
          </button>

          {showTime && (
            <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTime(t); setShowTime(false); }}
                  className={`block w-full rounded-xl px-4 py-2 text-left text-xs font-semibold transition-colors ${
                    time === t ? 'bg-blue-50 text-primary' : 'text-foreground hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book Now button */}
        <button
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-4 rounded-[28px] bg-grad-primary-cta px-6 py-3 text-sm font-semibold text-foreground shadow-[0_7px_16px_rgba(255,191,17,0.24)] hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <span>Book Now</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </form>
  );
};
