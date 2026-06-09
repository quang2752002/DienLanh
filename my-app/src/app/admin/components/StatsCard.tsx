'use client';

import React from 'react';
import Link from 'next/link';

interface StatItemProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  link: string;
}

export function StatsCard({ title, value, icon, color, link }: StatItemProps) {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className={`card border-left-${color} shadow h-100 py-2`}>
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
                {title}
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {value}
              </div>
            </div>
            <div className="col-auto">
              <i className={`fas ${icon} fa-2x text-gray-300`}></i>
            </div>
          </div>
          <div className="mt-3">
            <Link href={link} className="text-xs font-weight-bold text-gray-500 text-decoration-none">
              Xem chi tiết <i className="fas fa-chevron-right ml-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatItemProps[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="row">
      {stats.map((stat, idx) => (
        <StatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}
