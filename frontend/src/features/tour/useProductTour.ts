import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function useProductTour() {
  const [hasTakenTour, setHasTakenTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('finsight_tour_completed');
    if (completed === 'true') {
      setHasTakenTour(true);
    }
  }, []);

  const startTour = () => {
    const tourDriver = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Finish',
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      onDestroyed: () => {
        localStorage.setItem('finsight_tour_completed', 'true');
        setHasTakenTour(true);
      },
      steps: [
        {
          element: 'aside[aria-label="Sidebar"]',
          popover: {
            title: 'Welcome to FinSight',
            description: 'This is your intelligent financial analytics workspace. Navigate between core features using the sidebar.',
            side: 'right',
            align: 'start'
          }
        },
        {
          popover: {
            title: 'Dashboard Overview',
            description: 'The dashboard gives you an immediate bird\'s eye view of your cash flow and recent financial activity.',
          }
        },
        {
          element: 'a[href="/analytics"]',
          popover: {
            title: 'Deterministic Analytics',
            description: 'Dive deep into your category spending velocity and exact trends without any AI hallucinations.',
            side: 'right'
          }
        },
        {
          element: 'a[href="/health"]',
          popover: {
            title: 'Explainable Health Score',
            description: 'A rule-based algorithm scores your financial stability from 0-100 based on exact mathematical criteria.',
            side: 'right'
          }
        },
        {
          element: 'a[href="/goals"]',
          popover: {
            title: 'Smart Goals',
            description: 'Set financial targets and let FinSight dynamically calculate whether they are realistic based on your current cash flow.',
            side: 'right'
          }
        },
        {
          element: 'a[href="/simulation"]',
          popover: {
            title: 'Scenario Simulation',
            description: 'Wondering what happens if rent increases? Run what-if simulations against your historical baseline.',
            side: 'right'
          }
        },
        {
          element: 'a[href="/ai-coach"]',
          popover: {
            title: 'Privacy-First AI Coach',
            description: 'Connect your own API key to ask natural language questions grounded strictly in your deterministically calculated metrics.',
            side: 'right'
          }
        },
        {
          element: 'a[href="/import"]',
          popover: {
            title: 'Secure Import',
            description: 'Import bank CSV files directly. FinSight automatically categorizes them based on your historical merchant patterns.',
            side: 'right'
          }
        }
      ]
    });

    tourDriver.drive();
  };

  return { hasTakenTour, startTour };
}
