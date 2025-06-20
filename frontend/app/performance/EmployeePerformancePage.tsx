'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/component/card';
import { Performance } from '@/types/performance';

const EmployeePerformancePage = ({session} : {session:any}) => {
  const [reviews, setReviews] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeReviews = async () => {
      if (!session?.user?.employeeId) return;

      try {
        console.log('main Fetching employee performance data for:', session.user.employeeId);
        const res = await fetch(`/api/performance?employeeId=${session.user.employeeId}`);
        const data = await res.json();
        console.log('Fetched employee performance data:', data);
        setReviews(data);
      } catch (error) {
        console.log('Error fetching employee performance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeReviews();
  }, [session]);

  if (status === 'loading' || loading) return <p className="p-4">Loading your performance data...</p>;

  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent>
            <h2 className="text-xl font-bold">Reviewed by {review.reviewer.name}</h2>
            <p className="text-sm text-gray-500 mb-2">
              On {new Date(review.date).toLocaleDateString()}
            </p>

            <div className="mb-3">
              <h3 className="font-semibold">Rating:</h3>
              <p>{review.rating} / 10</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold">Goals:</h3>
              <ul className="list-disc list-inside">
                {review.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold">KPIs:</h3>
              <ul className="list-disc list-inside">
                {review.kpis.map((kpiObj, index) => (
                  <li key={index}>
                    {kpiObj.kpi} - Target: {kpiObj.target}, Achieved: {kpiObj.achieved}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Feedback:</h3>
              <p>{review.feedback}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmployeePerformancePage;
